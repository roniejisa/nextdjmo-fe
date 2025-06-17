import Group from "../../../fields/Group";

const Text = ({ field, onChange, value }) => {
  return (
    <Group field={field}>
      <input
        type="text"
        autoComplete="off"
        data-name={field.name}
        placeholder={field.placeholder}
        value={value || ""}
        onChange={onChange}
        className="w-full outline-outline outline-4 transition border rounded-md p-2"
      />
    </Group>
  );
};
export default Text;
