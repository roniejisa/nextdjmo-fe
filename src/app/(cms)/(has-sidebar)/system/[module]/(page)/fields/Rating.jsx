import StarHasValue from "@/packages/comments/StarHasValue";

const Rating = ({ value,field }) => {
  return (
    <div>
      <StarHasValue value={value} name={field.name} />
    </div>
  );
};

export default Rating;
