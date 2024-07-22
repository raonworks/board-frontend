import axios from "axios";
import { SignInRequestDTO, SignUpRequestDTO } from "./request/auth";
import { SignInResponseDTO, SignUpResponseDTO } from "./response/auth";
import { ResponseDTO } from "./response";
import { GetSignInUserResponseDTO } from "./response/user";

const DOMAIN = "http://localhost:8080";
const API_DOMAIN = `${DOMAIN}/api/v1`;
const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;
const Get_SIGN_IN_USER_URL = () => `${API_DOMAIN}/user`;

//function 로그인 요청
export const signInRequest = async (req: SignInRequestDTO) => {
  const result = await axios
    .post(SIGN_IN_URL(), req)
    .then((res) => {
      const body: SignInResponseDTO = res.data;
      return body;
    })
    .catch((error) => {
      if (!error.response.data) return null;
      const body: ResponseDTO = error.response.data;
      return body;
    });

  return result;
};

//function 회원가입 요청
export const signUpRequest = async (req: SignUpRequestDTO) => {
  const result = await axios
    .post(SIGN_UP_URL(), req)
    .then((res) => {
      const body: SignUpResponseDTO = res.data;
      return body;
    })
    .catch((error) => {
      if (!error.response.data) return null;
      const body: ResponseDTO = error.response.data;
      return body;
    });

  return result;
};

const authorization = (accessToken: string) => {
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

export const getSignInUserRequest = async (accessToken: string) => {
  const result = await axios
    .get(Get_SIGN_IN_USER_URL(), authorization(accessToken))
    .then((res) => {
      const resBody: GetSignInUserResponseDTO = res.data;
      return resBody;
    })
    .catch((error) => {
      if (!error.response) return null;
      const resBody: ResponseDTO = error.response.data;
      return resBody;
    });
  return result;
};
