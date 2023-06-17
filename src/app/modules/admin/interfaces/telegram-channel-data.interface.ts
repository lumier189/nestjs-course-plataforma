export interface TelegramChannelData {
  name: string;
  type: string;
  id: number;
  messages: TelegramMessage[];
}

export interface TelegramMessage {
  id: number;
  type: string;
  date: string;
  date_unixtime: string;
  actor: string;
  action: string;
  title: string;
  file: string;
  mime_type: string;
  thumbnail: string;
  duration_seconds: number;
  media_type: string;
  text_entities: { type: string; text: string }[];
}
