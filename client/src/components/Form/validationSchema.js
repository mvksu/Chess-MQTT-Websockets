import * as yup from "yup";

export const userValidationSchema = yup.object().shape({
  id: yup.string().required(),
  username: yup.string().min(5).required(),
  password: yup.string().min(5).required(),
});
