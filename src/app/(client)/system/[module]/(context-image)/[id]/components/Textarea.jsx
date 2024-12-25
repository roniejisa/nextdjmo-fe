const Textarea = ({ defaultValue, field }) => {
  return (
    <textarea
      defaultValue={defaultValue || ""}
      name={field.name}
      placeholder={field.placeholder}
      className="w-full outline-outline outline-4 transition border rounded-md p-2"
    ></textarea>
  );
};

export default Textarea;
