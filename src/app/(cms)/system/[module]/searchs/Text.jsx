const Text = ({field}) => {
  return (
    <div>
      <input type="text" name={field.name} placeholder={field.placeholder} />
    </div>
  );
};

export default Text;
