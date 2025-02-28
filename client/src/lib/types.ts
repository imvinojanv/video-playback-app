export interface Comment {
  id: string;
  timestamp: number; // In seconds
  text: string;
  createdAt: Date;
  editedAt?: Date; // Optional edit timestamp
}

export interface VideoState {
  url: string | null;
  duration: number;
  currentTime: number;
  comments: Comment[];
}