import LinkCustom from "@/packages/translation/Link"

const Slug = ({value, item, field}) => {
  return (
      <LinkCustom href={`${field?.permalink}${value}`} className={`hover:text-blue-500 transition`}>{value}</LinkCustom>
    )
  }
  
  export default Slug