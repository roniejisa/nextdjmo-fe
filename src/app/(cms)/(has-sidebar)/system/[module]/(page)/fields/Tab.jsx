import { listTab } from "@/app/(cms)/(has-sidebar)/constants/tab";

const Tab = ({ field, value }) => {
  return (
    <select
      name={field.name}
      className="w-full outline-outline outline-4 transition border rounded-md p-2"
      value={value}
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
