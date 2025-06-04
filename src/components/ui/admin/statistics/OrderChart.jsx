"use client";
import { useEffect, useState } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
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
  const [chartData, setChartData] = useState([]);
  const [chartName, setChartName] = useState("");

  const changeTypeOrTime = async () => {
    if (time === "custom" && (startTime === "" || endTime === "")) return;
    
    const response = await getDataStatistic(type, time, startTime, endTime);
    if (!response) return;
    
    const {
      times,
      data,
      options: { name },
    } = response.data;

    // Chuyển đổi dữ liệu cho Recharts
    const formattedData = times.map((time, index) => ({
      time: time,
      value: data[index],
    }));

    setChartData(formattedData);
    setChartName(name);
  };

  useEffect(() => {
    changeTypeOrTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, time, startTime, endTime]);

  // Custom formatter cho tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const formattedValue = 
        Intl.NumberFormat().format(value) + (type === "order" ? " đơn" : " đ");
      
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="text-gray-800">{`${label}`}</p>
          <p className="text-gray-600">
            <span style={{ color: colors[type] }}>●</span>
            {` ${chartName}: ${formattedValue}`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom formatter cho YAxis
  const formatYAxisLabel = (value) => {
    return Intl.NumberFormat().format(value) + (type === "order" ? " đơn" : " đ");
  };

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
              type === "profit" ? `border-[#0ea754] bg-[#0ea754] text-white` : ""
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
              type === "order" ? `border-[#FF69B4] bg-[#FF69B4] text-white` : ""
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
              type === "revenue"
                ? `border-[#39aaf5] bg-[#39aaf5] text-white`
                : ""
            }`}
          >
            Doanh thu
          </div>
        </div>
      </div>
      
      <div className="text-left h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id={`colorGradient-${type}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[type]} stopOpacity={0.5}/>
                <stop offset="95%" stopColor={colors[type]} stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#666' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#666' }}
              tickFormatter={formatYAxisLabel}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              align="left"
              verticalAlign="top"
              wrapperStyle={{ paddingBottom: '20px' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={colors[type]}
              strokeWidth={2}
              fill={`url(#colorGradient-${type})`}
              name={chartName}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrderChart;