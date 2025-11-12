export interface AuthSessionPayload {
  token: string;
  user: {
    id: number;
    email: string;
    displayName?: string;
    faculty?: string;
    avatarUrl?: string | null;
    bio?: string | null;
  };
}
