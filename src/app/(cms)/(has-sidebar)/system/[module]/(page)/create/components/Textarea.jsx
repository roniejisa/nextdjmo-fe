const Textarea = ({ field, defaultValue }) => {
  return (
    <textarea
      name={field.name}
      placeholder={field.placeholder}
      defaultValue={defaultValue || ""}
      className="w-full outline-outline outline-4 transition border rounded-md p-2"
    ></textarea>
  );
};

export default Textarea;
