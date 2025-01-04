const Text = ({ defaultValue, field, oldData }) => {
  console.log(defaultValue, oldData)
  return (
    <input
      value={defaultValue || ""}
      name={field.name}
      placeholder={field.placeholder}
      className="w-full outline-outline outline-4 transition border rounded-md p-2"
    />
  );
};

export default Text;
