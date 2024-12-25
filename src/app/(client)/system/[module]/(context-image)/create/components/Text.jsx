const Text = ({ field, defaultValue }) => {
  return (
    <input
      name={field.name}
      placeholder={field.placeholder}
      defaultValue={defaultValue || ""}
      className="w-full outline-outline outline-4 transition border rounded-md p-2"
    />
  );
};

export default Text;