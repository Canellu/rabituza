export type User = {
  id: string;
  code: string;
  picture?: string;
  first_name?: string;
  last_name?: string;
  dob?: Date;
  gender?: string;
  height?: number;
  weight?: number;
  bio?: string;
} & (
  | { email: string; username?: string }
  | { username: string; email?: string }
);
