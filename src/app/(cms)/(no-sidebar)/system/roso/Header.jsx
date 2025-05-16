import style from "./Header.module.scss";
const Header = ({ models }) => {
  return (
    <div className={`fixed ml-4 px-4 top-4 ${style.overlaySelected}`}>
      <select
        id="model"
        defaultValue={models.find((item) => item?.default == 1)?.name}
      >
        {models?.map((item) => {
          return (
            <option value={item.name} key={item.name}>
              {item.label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default Header;
