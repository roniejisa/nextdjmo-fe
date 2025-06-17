import StarIcon from "@/packages/comments/StarIcon"

const Rating = ({value}) => {
  return (
    <div>
        <StarIcon percent={value * 20}/>
    </div>
  )
}

export default Rating