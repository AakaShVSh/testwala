import axios from "axios";
import { setCookies } from "../helpers/cookies";
import { setLocalStorage } from "../helpers/localStorage";
export const signUpApi = async (data, cmpPassword) => {
  console.log(data.Password, "d", cmpPassword);
try {
   if (data.Email.includes("@gmail.com") && data.Email!=="") {
     if (data.Password === cmpPassword&&data.Password!=="") {
       const r = axios.post(
         "https://testwala-backend.onrender.com/auth/signup",
         data
       );

       if (r.data.token) {
         setCookies("_user", r.data.token);
         console.log("hh");
         return true;
       } else if (r.data.message) {
         alert(r.data.message);
         console.log("ll");
         return false;
       }
     } else {
       alert("Password and Confirm Password should be same");
     }
   } else {
     alert("It should be Email only");
   }
} catch (error) {
   console.log(error);
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
