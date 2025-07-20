import { Fight } from "./fight";

export interface Event {
  title: string;
  date: string;
  link: string;
  fights: Fight[];
}
