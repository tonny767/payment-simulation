export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  email: string;
  role: string;
  token: string;
};
