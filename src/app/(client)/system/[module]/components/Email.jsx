const Email = ({value}) => {
    return (
        <a href={`mailto:${value}`} className="hover:text-blue-500 transition">{value}</a>
    )
}

export default Email