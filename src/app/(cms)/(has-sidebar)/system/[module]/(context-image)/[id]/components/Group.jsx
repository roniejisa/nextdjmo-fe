const Group = ({ children, field: {label} }) => {
  return <div className="mt-4">
    <label className="block mb-2">{label}</label>
    {children}
  </div>;
};

export default Group;
