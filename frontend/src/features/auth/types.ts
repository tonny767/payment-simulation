export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  email: string;
  role: string;
  token: string;
};

export type AuthState = {
  token: string | null;
  role: string | null;
};

export type AuthContextType = AuthState & {
  isAuthenticated: boolean;
  login: (token: string, role: string) => void;
  logout: () => void;
};
