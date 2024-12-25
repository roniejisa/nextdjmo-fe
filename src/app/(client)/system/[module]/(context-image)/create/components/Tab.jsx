import { listTab } from "@/app/(client)/constants/tab";

const Tab = ({ field, defaultValue }) => {
  return (
    <select
      name={field.name}
      className="w-full outline-outline outline-4 transition border rounded-md p-2"
      defaultValue={defaultValue}
    >
      {listTab.map(({ name, value }) => (
        <option value={name} key={name}>
          {value}
        </option>
      ))}
    </select>
  );
};

export default Tab;
