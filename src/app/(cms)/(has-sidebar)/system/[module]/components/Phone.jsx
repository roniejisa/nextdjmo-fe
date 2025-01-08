const Phone = ({value}) => {
    return (
      <a href={`tel:${value}`} className="hover:text-blue-500 transition">{value}</a>
    )
  }
  
  export default Phone