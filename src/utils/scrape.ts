import * as cheerio from "cheerio";
import { gotScraping } from "got-scraping";
import { Event } from "../types/event.js";
import { MAJOR_ORGS, MAX_EVENTS } from "../config/constants.js";

const baseUrl = "https://www.tapology.com";

export const scrapeEvents = async (): Promise<Omit<Event, "fights">[]> => {
  try {
    const response = await gotScraping({
      url: `${baseUrl}/fightcenter?group=ufc&schedule=upcoming`,
      // proxyUrl: process.env.PROXY_URL,
    });

    if (response.statusCode !== 200) {
      throw new Error("Failed to scrape data from Tapology");
    }

    const $ = cheerio.load(response.body);

    const events = $(".fightcenterEvents > div")
      .toArray()
      .map((el) => {
        const eventLink = $(el).find(".promotion a");
        const date = $(el).find(".promotion span").eq(3).text().trim();
        const location = $(el).find(".geography span").eq(2).text().trim();
        const locationFlag = $(el).find(".geography img").attr("src");
        return {
          title: eventLink.first().text().trim(),
          date,
          link: baseUrl + eventLink.first().attr("href"),
          location,
          locationFlag: baseUrl + locationFlag,
        };
      })
      .filter(
        (event) =>
          MAJOR_ORGS.some((org) => event.title.toUpperCase().includes(org)) &&
          !event.title.toUpperCase().includes("ONE FRIDAY FIGHTS")
      )
      .slice(0, MAX_EVENTS);

    return events;
  } catch (error) {
    console.error("Scraping error:", error);
    throw new Error(`Error during scraping: ${error}`);
  }
};

export const scrapeEventDetails = async (
  events: Omit<Event, "fights">[]
): Promise<Event[]> => {
  try {
    const eventsWithFights = await Promise.all(
      events.map(async (event): Promise<Event> => {
        const eventResponse = await gotScraping({
          url: event.link,
        });

        if (eventResponse.statusCode !== 200) {
          throw new Error(`Failed to fetch for: ${event.link}`);
        }

        const $ = cheerio.load(eventResponse.body);

        const fights = $('ul[data-event-view-toggle-target="list"] li')
          .toArray()
          .map((el) => {
            const main = $(el)
              .find(
                "a.hover\\:border-solid.hover\\:border-b.hover\\:border-neutral-950.hover\\:text-neutral-950"
              )
              .text()
              .toLowerCase()
              .includes("main");

            const weight = $(el)
              .find(
                "span.px-1\\.5.md\\:px-1.leading-\\[23px\\].text-sm.md\\:text-\\[13px\\].text-neutral-50.rounded"
              )
              .text()
              .trim()
              .substring(0, 3);

            const belt = !!$(el).find(
              "div.flex.items-center.justify-center.gap-1 svg.w-\\[22px\\].md\\:w-\\[30px\\],h-\\[22px\\],md\\:h-\\[30px\\].fill-tap_darkgold"
            ).length;

            const fighterContainers = $(el).find(
              ".div.flex.flex-row.gap-0\\.5.md\\:gap-0.w-full"
            );

            const fighterAContainer = fighterContainers.eq(0);
            const fighterA = {
              name: fighterAContainer.find(".link-primary-red").text().trim(),
              record: fighterAContainer
                .find(".text-\\[15px\\].md\\:text-xs.order-2")
                .text()
                .trim(),
              rank: fighterAContainer
                .find(
                  ".div.flex.md\\:hidden.items-center.justify-center.bg-tap_darkred.text-tap_f2.h-\\[20px\\].min-w-\\[38px\\].rounded.order-2.gap-px"
                )
                .text()
                .trim(),
              country:
                baseUrl +
                fighterAContainer
                  .find(
                    ".opacity-70.h-\\[14px\\].md\\:h-\\[11px\\].w-\\[22px\\].md\\:w-\\[17px\\]"
                  )
                  .attr("src"),
              picture:
                fighterAContainer
                  .find(
                    ".w-\\[77px\\].h-\\[77px\\].md\\:w-\\[104px\\].md\\:h-\\[104px\\].rounded"
                  )
                  .attr("src") || "",
              link:
                baseUrl +
                fighterAContainer.find(".link-primary-red").attr("href"),
            };

            const fighterBContainer = fighterContainers.eq(1);
            const fighterB = {
              name: fighterBContainer.find(".link-primary-red").text().trim(),
              record: fighterBContainer
                .find(".text-\\[15px\\].md\\:text-xs.order-1")
                .text()
                .trim(),
              rank: fighterBContainer
                .find(
                  ".div.hidden.md\\:flex.items-center.justify-center.bg-tap_darkred.text-tap_f2.h-\\[18px\\].md\\:min-w-\\[30px\\].rounded.order-1.gap-px"
                )
                .text()
                .trim(),
              country:
                baseUrl +
                fighterBContainer
                  .find(
                    ".opacity-70.h-\\[14px\\].md\\:h-\\[11px\\].w-\\[22px\\].md\\:w-\\[17px\\]"
                  )
                  .attr("src"),
              picture:
                fighterBContainer
                  .find(
                    ".w-\\[77px\\].h-\\[77px\\].md\\:w-\\[104px\\].md\\:h-\\[104px\\].rounded"
                  )
                  .attr("src") || "",
              link:
                baseUrl +
                fighterBContainer.find(".link-primary-red").attr("href"),
            };

            return { main, weight, belt, fighterA, fighterB };
          });

        return {
          ...event,
          fights,
        };
      })
    );

    return eventsWithFights.filter((event) => event.fights.length > 0);
  } catch (error) {
    console.error("Error during scraping event details:", error);
    throw new Error(`Error during scraping event details: ${error}`);
  }
};
