const Password = ({ value, field, item }) => {
  return (
    <>
      <input
        type="password"
        name={field.name}
        defaultValue={value || ""}
        className="w-full outline-outline outline-4 transition border rounded-md p-2"
        autoComplete="off"
      />
      {!item && (
        <>
          <p>Nhập lại</p>
          <input
            type="password"
            autoComplete="off"
            name={`${field.name}_confirmation`}
            placeholder={field.placeholder}
            className="w-full outline-outline outline-4 transition border rounded-md p-2"
          />
        </>
      )}
    </>
  );
};

export default Password;
