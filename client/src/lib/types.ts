export interface Comment {
  id: string;
  timestamp: number; // In seconds
  text: string;
  createdAt: Date;
}

export interface VideoState {
  url: string | null;
  duration: number;
  currentTime: number;
  comments: Comment[];
}
