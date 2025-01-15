const Text = ({field}) => {
  return (
    <div>
      <input autoComplete="off" type="text" name={field.name} placeholder={field.placeholder} />
    </div>
  );
};

export default Text;
