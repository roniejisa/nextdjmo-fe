const Date = ({ value }) => {
  try {
    const [year, month, day] = value.split("-");
    return (
      <div>
        {day}/{month}/{year}
      </div>
    );
  } catch (e) {
    return <div>Không xác định</div>;
  }
};

export default Date;
