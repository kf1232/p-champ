export type CalendarConnectionStatus = {
  configured: boolean;
  connected: boolean;
  email?: string;
};

export type CalendarListEntry = {
  id: string;
  summary: string;
  primary?: boolean;
};

export type CalendarEventEntry = {
  id: string;
  summary: string;
  start: string;
  end: string;
  htmlLink?: string;
};
