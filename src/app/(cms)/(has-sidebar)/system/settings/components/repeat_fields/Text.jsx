import Group from "../../../[module]/(context-image)/create/components/Group";

const Text = ({ field, onChange, defaultValue }) => {
  return (
    <Group field={field}>
      <input
        data-name={field.name}
        placeholder={field.placeholder}
        defaultValue={defaultValue || ""}
        onChange={onChange}
        className="w-full outline-outline outline-4 transition border rounded-md p-2"
      />
    </Group>
  );
};
export default Text;
