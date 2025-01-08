const Text = ({ defaultValue, field }) => {
  return (
    <input
      defaultValue={defaultValue || ""}
      name={field.name}
      placeholder={field.placeholder}
      className="w-full outline-outline outline-4 transition border rounded-md p-2"
    />
  );
};

export default Text;
