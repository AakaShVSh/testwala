import axios from "axios";
import { setCookies } from "../helpers/cookies";
import { setLocalStorage } from "../helpers/localStorage";
export const signUpApi = async (data, cmpPassword) => {
  console.log(data.Password, "d", cmpPassword);
  if (data.Password === cmpPassword) {
    axios
      .post("https://testwala-backend.onrender.com/auth/signup", data)
      .then((r) => {
        console.log(r);
        return true;
      })
      .catch((err) => {console.log(err);return false});
  } else {
    alert("Comfirm password is different");
  }
};

export const signInApi = async (data) => {
  axios
    .post("https://testwala-backend.onrender.com/auth/signin", data)
    .then((r) => {
      setCookies("token", r.data.token);
      return true;
    })
    .catch((err) => {console.log(err);return false});
};
