export type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
};

export type Offer = {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  user: User;
};
