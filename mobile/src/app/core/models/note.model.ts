export interface Note {
  id: number;
  user_id: number;
  title: string;
  content?: string;
  created_at: string;
  updated_at: string;
}

export interface NoteCreate {
  user_id: number;
  title: string;
  content?: string;
}

export interface NoteUpdate {
  title?: string;
  content?: string;
}
