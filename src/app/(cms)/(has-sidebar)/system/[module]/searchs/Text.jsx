const Text = ({field}) => {
  return (
    <div>
      <input className="w-full outline-outline outline-4 transition border rounded-md p-2" autoComplete="off" type="text" name={field.name} placeholder={field.placeholder} />
    </div>
  );
};

export default Text;
