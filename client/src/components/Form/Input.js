import { useField } from "formik";

const Input = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className="py-1 w-full">
      <div className="flex justify-between">
        <label htmlFor={field.name}>{label}</label>
        {meta.touched && meta.error ? (
          <p className="text-red-500 font-light text-xs">{meta.error}</p>
        ) : null}
      </div>
      <input
        className={`bg-white ring-1 ring-gray-200 w-full px-3 py-1 my-3 focus:ring-2 focus:ring-blue-300 outline-none hover:ring-2 ${
          meta.touched && meta.error ? "ring-red-500 ring-2" : "ring-blue-300"
        }`}
        type={props.type || "text"}
        {...props}
        {...field}
      />
    </div>
  );
};

export default Input;
