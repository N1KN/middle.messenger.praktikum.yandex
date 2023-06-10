export type SignInRequestDTO = {
  login: string;
  password: string;
};

export type SignUpRequestDTO = {
  first_name: string;
  second_name: string;
  email: string;
  phone: string;
} & SignInRequestDTO;

export type SignUpResponseDTO = {
  id: string;
};
