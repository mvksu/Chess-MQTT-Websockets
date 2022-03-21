import { useField } from "formik";

const InputSelect = ({ label, options, ...props }) => {
  const [field, meta] = useField(props.name);

  return (
    <div className="py-1 w-full">
      <div className="flex justify-between">
        <label htmlFor={field.name} className="text-gray-500 text-sm text-bold">
          {label}
        </label>
        {meta.touched && meta.error ? (
          <p className="text-red-500 text-xs">{meta.error}</p>
        ) : null}
      </div>
      <select
        className={`bg-white ring-1 w-full p-3 rounded text-black text-sm font-bold focus:ring-2 focus:ring-blue-300 outline-none hover:ring-2 ${
          meta.touched && meta.error ? "ring-red-500 ring-2" : "ring-blue-300"
        }`}
        {...props}
        {...field}
        value={meta.value ? meta.value : undefined}
      >
        {options.map((option) =>
          option.id ? (
            <option
              value={option.id}
              key={option.id}
              label={`${option.first_name} ${option.last_name}`}
            />
          ) : (
            <option value={option} key={option} label={option} />
          )
        )}
      </select>
    </div>
  );
};

export default InputSelect;
