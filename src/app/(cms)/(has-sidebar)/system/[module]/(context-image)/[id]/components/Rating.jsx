import StarHasValue from "@/packages/comments/StarHasValue";

const Rating = ({ defaultValue,field }) => {
  return (
    <div>
      <StarHasValue defaultValue={defaultValue} name={field.name} />
    </div>
  );
};

export default Rating;
