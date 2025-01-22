export type User = {
  id: string;
  profileData: {
    first_name: string;
    last_name: string;
    email: string;
    age?: number;
    height?: number;
    gender?: string;
    bio?: string;
  };
};
