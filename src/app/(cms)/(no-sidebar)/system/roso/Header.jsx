const Header = ({ models }) => {
  return (
    <div className="fixed px-4 top-4">
      <select id="model">
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