import { superFormatDate } from "@/utils/client";

const Date = ({ value }) => {
  try {
    const time = superFormatDate(value);
    return <>{time}</>;
  } catch (e) {
    return <div>Không xác định</div>;
  }
};

export default Date;
