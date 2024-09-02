import axios from "axios";
import { QUESTION_ERROR, QUESTION_LOADING, QUESTION_SUCCESS } from "./questions.Type";

export const QuestionApi = (sub) => async (dispatch) => {
    dispatch({type:QUESTION_LOADING});
  axios
    .get(`https://testwala-backend.onrender.com/QuestionStorage/${sub}`)
    .then((r) => dispatch({ type: QUESTION_SUCCESS, payload: r.data }))
    .catch((err) => dispatch({ type: QUESTION_ERROR }));
};
