
const Password = ({ defaultValue, field, item }) => {
  return (
    <input
      type="password"
      autoComplete="off"
      name={field.name}
      defaultValue={defaultValue || ""}
      className="w-full outline-outline outline-4 transition border rounded-md p-2"
    />
  );
};

export default Password;
