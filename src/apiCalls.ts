import axios from "axios";
import { useDispatch } from "react-redux";

export interface LoginCallProps {
  userCredential: { email: any; password: any };
}

export const LoginCall = async (props: LoginCallProps) => {
  const { userCredential } = props;
  const url = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post(
      `${url}auth/login`,
      userCredential,
    );
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
  }
};
