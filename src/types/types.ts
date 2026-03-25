export type TimerTypes = "pomodoro" | "shortBreak" | "longBreak";

export type MotivationalQuote = {
  q: string;
  a: string;
  h: string;
};

export type RadioStation = {
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  favicon: string;
  tags: string;
  country: string;
  codec: string;
  bitrate: number;
  lastcheckok: number;
  votes: number;
};
