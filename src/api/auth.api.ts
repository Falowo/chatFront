import { AxiosResponse } from "axios";
import { authInstance, instance } from ".";
import { IUser } from "../interfaces";

export interface IUserSigninCredentials {
  email: string;
  password: string;
}

export const signup = (
  user: IUser,
): Promise<AxiosResponse<string>> => {
  return authInstance.post(`auth/signup`, user);
};

export const signin = (
  creds: IUserSigninCredentials,
): Promise<AxiosResponse<string>> => {
  return authInstance.post(`auth/signin`, creds);
};

export const refreshToken = (
 props: {oldToken: string},
): Promise<AxiosResponse<string>> => {
  return instance.post(`auth/refreshToken`, props);
};
