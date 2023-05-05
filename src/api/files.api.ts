import { instance } from ".";


export const uploadFile = (data: FormData) => {
  return instance().post(`upload`, data);
};
