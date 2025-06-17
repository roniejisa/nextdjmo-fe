import SelectType from "./fields/layouts/SelectType";
import TabType from "./fields/layouts/TabType";

export const hookComponent = {
  tab: TabType,
  select: SelectType
};
const StartTable = ({ module }) => {
  return (
    <div className="flex justify-between items-center flex-wrap">
      {module?.layoutConfig &&
        module?.layoutConfig?.left &&
        Array.isArray(module?.layoutConfig?.left) && (
          <>
            {module?.layoutConfig?.left.map((item, index) => {
              const Component = hookComponent[item.type];
              if (Component) {
                return (
                  <div key={index}>
                    <b className="mb-2 block text-gray-500">{item.label}</b>
                    <Component data={item.data} name={item.name} />
                  </div>
                );
              }
            })}
          </>
        )}

      {module?.layoutConfig &&
        module?.layoutConfig?.right &&
        Array.isArray(module?.layoutConfig?.right) && (
          <>
            {module?.layoutConfig?.right.map((item, index) => {
              const Component = hookComponent[item.type];
              if (Component) {
                return (
                  <div key={index}>
                    <b className="mb-2 block text-gray-500">{item.label}</b>
                    <Component data={item.data} name={item.name} />
                  </div>
                );
              }
            })}
          </>
        )}
    </div>
  );
};

export default StartTable;
