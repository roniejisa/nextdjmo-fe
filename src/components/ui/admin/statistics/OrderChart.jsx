"use client";
import dynamic from "next/dynamic";

// Dynamically import the Chart component with SSR disabled
const ChartNoSSR = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useEffect, useState } from "react";
import { getDataStatistic } from "./action";

const OrderChart = () => {
  const colors = {
    order: "#FF69B4",
    profit: "#0ea754",
    revenue: "#39aaf5",
  };

  const [type, setType] = useState("order");
  const [time, setTime] = useState("week");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [state, setState] = useState({
    series: [],
    options: {},
  });

  const changeTypeOrTime = async () => {
    if (time === "custom" && (startTime == "" || endTime == "")) return;
    const response = await getDataStatistic(type, time, startTime, endTime);
    const {
      times,
      data,
      options: { name },
    } = response.data;
    const color = colors[type];
    setState({
      series: [{ name, data }],
      options: {
        chart: {
          type: "area",
          height: 350,
          animations: {
            enabled: true,
            easing: "linear", // Hiệu ứng chuyển động
            dynamicAnimation: {
              enabled: true,
              speed: 1000, // Thời gian hiệu ứng
            },
          },
          zoom: { enabled: false },
          toolbar: { show: false },
        },
        colors: [color],
        dataLabels: { enabled: false },
        stroke: {
          curve: "smooth",
          colors: [color],
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            inverseColors: true,
            opacityFrom: 0.5,
            opacityTo: 0.2,
            stops: [0, 90, 100],
          },
        },
        // labels: times,
        xaxis: {
          categories: times,
        },
        yaxis: {
          animations: {
            enabled: true,
            easing: "easeInOutExpo", // Hiệu ứng trục Y kéo stroke từ dưới lên
            speed: 1000,
          },
          labels: {
            formatter: function (val) {
              return (
                Intl.NumberFormat().format(val) +
                (type === "order" ? " đơn" : " đ")
              ); // Định dạng dữ liệu trên trục Y
            },
          },
        },
        grid: {
          padding: {
            left: 10,
            right: 10, // Giảm padding để tránh ngày ra mép
          },
        },
        legend: {
          horizontalAlign: "left",
        },
      },
    });
  };
  useEffect(() => {
    changeTypeOrTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, time, startTime, endTime]);

  return (
    <div className="flex-1 px-2">
      <div className="flex justify-between my-4 items-center">
        <h3 className="text-2xl">Đơn hàng</h3>
        <div className="flex gap-4 items-center">
          {time === "custom" && (
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex gap-2 whitespace-nowrap">
                <label htmlFor="start-time">Bắt đầu</label>
                <input
                  type="date"
                  id="start-time"
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="flex gap-2 whitespace-nowrap items-center">
                <label htmlFor="end-time">Kết thúc</label>
                <input
                  type="date"
                  id="end-time"
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          )}
          <select
            className="w-[150px]"
            defaultValue={time}
            onChange={(e) => {
              setTime(e.target.value);
              setStartTime("");
              setEndTime("");
            }}
          >
            <option value="day">Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="year">Năm trước</option>
            <option value="custom">Tự chọn</option>
          </select>
        </div>
      </div>
      <div className="flex -mx-2 my-2">
        <div
          className="flex-[0_0_calc(100%/3)] px-2"
          onClick={() => setType("profit")}
        >
          <div
            className={`rounded-lg py-2 text-center transition-all cursor-pointer border ${
              type == "profit" ? `border-[#0ea754] bg-[#0ea754] text-white` : ""
            }`}
          >
            Lợi nhuận
          </div>
        </div>
        <div
          className="flex-[0_0_calc(100%/3)] px-2"
          onClick={() => setType("order")}
        >
          <div
            className={`rounded-lg py-2 text-center transition-all cursor-pointer border ${
              type == "order" ? `border-[#FF69B4] bg-[#FF69B4] text-white` : ""
            }`}
          >
            Đơn hàng
          </div>
        </div>
        <div
          className="flex-[0_0_calc(100%/3)] px-2"
          onClick={() => setType("revenue")}
        >
          <div
            className={`rounded-lg py-2 text-center transition-all cursor-pointer border ${
              type == "revenue"
                ? `border-[#39aaf5] bg-[#39aaf5] text-white`
                : ""
            }`}
          >
            Doanh thu
          </div>
        </div>
      </div>
      <div className="text-left">
        {" "}
        {/* Căn chart sang trái */}
        <ChartNoSSR
          options={state.options}
          series={state.series}
          type="area"
          height={350}
        />
      </div>
    </div>
  );
};

export default OrderChart;
