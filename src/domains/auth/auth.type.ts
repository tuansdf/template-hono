export type LoginRequestDTO = {
  username: string;
  password: string;
};

export type RegisterRequestDTO = {
  email: string;
  username: string;
  password: string;
};

export type ForgotPasswordRequestDTO = {
  username: string;
};

export type ResetPasswordRequestDTO = {
  t: string;
  password: string;
  passwordConfirm: string;
};
