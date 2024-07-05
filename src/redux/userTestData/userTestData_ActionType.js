import axios from "axios";
import { setCookies } from "../../helpers/cookies";
import {
  USERTESTDATA_ERROR,
  USERTESTDATA_LOADING,
  USERTESTDATA_SUCCESS,
} from "./userTestData.type";

export const userTestDataApi = (data) => async (dispatch) => {
  // console.log(data);
  dispatch({ type: USERTESTDATA_LOADING });
  axios
    .post(
      "https://testwala-backend.onrender.com/UserTestData/AddNew-userTestData",
      data
    )
    .then((r) => {
      dispatch({ type: USERTESTDATA_SUCCESS, payload: r.data });
    })
    .catch((e) => {
      dispatch({ type: USERTESTDATA_ERROR });
    });
};
