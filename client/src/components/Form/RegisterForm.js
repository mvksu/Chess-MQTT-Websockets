import { Formik, Form } from "formik";
import { userValidationSchema } from "./validationSchema";
import Input from "./Input";
import { initValues } from "./initValues";
import { useState } from "react";
import axios from "axios";

async function registerUser(credentials) {
  return axios
    .post("http://localhost:8000/users/register/", credentials)
    .then((data) => data.data);
}

function RegisterForm() {
  const [msg, setMessage] = useState("");

  const handleRegister = async (values) => {
    const { msg } = await registerUser(values);
    setMessage(msg);
  };

  return (
    <Formik
      onSubmit={(values) => handleRegister(values)}
      initialValues={initValues}
      validationSchema={userValidationSchema}
      enableReinitialize
    >
      <Form className="mt-5 relative" onChange={() => setMessage("")}>
        <h1 className="my-4">Register</h1>
        <label className="text-green-500 absolute right-0 bottom-0">
          {msg}
        </label>
        <Input
          name="username"
          type="text"
          label="Username"
          placeholder="Username"
        />
        <Input
          name="password"
          type="password"
          label="Password"
          placeholder="Password"
        />
        <button
          type="submit"
          className="bg-blue-300 rounded-3xl px-3 py-1 text-white text-bold"
        >
          Register
        </button>
      </Form>
    </Formik>
  );
}

export default RegisterForm;
