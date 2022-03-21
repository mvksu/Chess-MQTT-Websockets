import React, { useState } from "react";
import axios from "axios";
import { Field, Formik } from "formik";
import { Form } from "formik";
import InputSelect from "./InputSelect";
import Chess from 'chess.js';
import { Chessboard } from 'react-chessboard';

export default function Modal({ showModal, setShowModal, token }) {

  const handleCreateRoom = (values) => {
    axios
      .post(`http://localhost:8000/rooms/${token}`, values)
      .then((data) => setShowModal(false))
      .catch((err) => console.error(err));
  };

  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-96 my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none text-center">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid rounded-t">
                  <h3 className="text-3xl font-semibold text-center">
                    Create Room
                  </h3>

                  <button
                    className="p-1 ml-auto text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="text-red-500 h-12 w-12 text-2xl focus:outline-none">
                      X
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6">
                  <Formik
                    initialValues={{
                      name: "",
                      minutesPerSide: 5,
                      increment: 0,
                      fen: ""
                    }}
                    onSubmit={async (values) => {
                      handleCreateRoom(values);
                    }}
                  >
                    <Form className="flex flex-col">
                      <label htmlFor="firstName">Name</label>
                      <Field
                        id="name"
                        name="name"
                        placeholder="Room name"
                        className="border-2 my-2"
                      />

                      <InputSelect
                        name="minutesPerSide"
                        label="Minutes per side"
                        options={[5, 10, 15]}
                      />
                      <InputSelect
                        name="increment"
                        label="Increment"
                        options={[0, 5, 15]}
                      />
                      <h1 className="mx-6">Custom board</h1>
                      <Chessboard boardWidth="330" />

                      <button
                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 my-4"
                        type="submit"
                      >
                        Create Room
                      </button>
                    </Form>
                  </Formik>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
