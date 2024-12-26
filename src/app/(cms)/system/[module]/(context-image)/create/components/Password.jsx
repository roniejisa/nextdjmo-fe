const Password = ({field, defaultValue}) => {
  return (
    <>
      <input type="password" name={field.name} placeholder={field.placeholder} defaultValue={defaultValue || ""} className="w-full outline-outline outline-4 transition border rounded-md p-2"/>
      <p>Nhập lại</p>
      <input type="password" name={`${field.name}_confirmation`} placeholder={field.placeholder} defaultValue={defaultValue || ""} className="w-full outline-outline outline-4 transition border rounded-md p-2"/>
    </>
  )
}

export default Password