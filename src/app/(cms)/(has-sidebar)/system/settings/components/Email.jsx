const Email = ({defaultValue, item, field}) => {
    
    return (
        <input type="email" name={field.name} defaultValue={defaultValue || ""} className="w-full outline-outline outline-4 transition border rounded-md p-2"/>
    )
}

export default Email