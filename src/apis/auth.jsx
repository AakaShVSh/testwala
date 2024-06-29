import axios from "axios";
import { setCookies } from "../helpers/cookies";
import { setLocalStorage } from "../helpers/localStorage";
export const signUpApi = async (data, cmpPassword,setMessage) => {
  console.log(data.Password, "d", cmpPassword);
  try {
    const r = await axios.post(
      "https://testwala-backend.onrender.com/auth/signup",
      data
    );
    console.log(r);
    if (r.data.token!==undefined) {
      console.log(r.data);
      setCookies("_user", r.data.token);
       setMessage(r.data.message);
      console.log("hh");
      return true;
    } else {
      // alert(r.data.message);
      console.log("ll");
      setMessage(r.data.message)
      return false;
    }
  } catch (error) {
    console.log(error.message);
    setMessage(error.message)
    return false;
  }
};

export const signInApi = async (data) => {
  axios
    .post("https://testwala-backend.onrender.com/auth/signin", data)
    .then((r) => {
      setCookies("_user", r.data.token);
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};
