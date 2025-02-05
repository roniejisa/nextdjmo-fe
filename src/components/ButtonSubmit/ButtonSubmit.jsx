const ButtonSubmit = ({
  children,
  label = "",
  eventClick = () => {},
  typeButton = "submit",
}) => {
  return (
    <button
      onClick={eventClick}
      type={typeButton}
      className={`rounded-md text-white px-4 py-2 whitespace-nowrap bg-active ml-2`}
    >
      {children}
      {label}
    </button>
  );
};

export default ButtonSubmit;
