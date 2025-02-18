"use client";
import ButtonSubmit from "@/components/ButtonSubmit/ButtonSubmit";
import Chart from "chart.js/auto";
import { useEffect, useRef, useState } from "react";
import { normalizeData } from "@/utils/client/normalize";
const ChartComponent = () => {
  const [question, setQuestion] = useState("");
  const [statistics, setStatistics] = useState(null);
  const chartRef = useRef(null);

  // Xác định được có bao nhiêu loại thống kê
  const sendDataChart = async (e) => {
    e.preventDefault();
    // Mẫu dữ liệu

    const data = normalizeData({
      usa: {
        active_personnel: 1400000,
        reserve_personnel: 800000,
        navy: {
          total_ships: 490,
          aircraft_carriers: 11,
        },
        air_force: {
          total_aircraft: 5000,
          "5th_generation_fighters": ["F-22", "F-35"],
        },
        nuclear_weapons: {
          total_warheads: 5428,
          deployed: 1744,
        },
        budget: 842000000000,
      },
      china: {
        active_personnel: 2185000,
        reserve_personnel: 1170000,
        paramilitary_personnel: 660000,
        navy: {
          total_ships: 370,
          aircraft_carriers: 3,
          modern_ships: ["Type 055"],
        },
        air_force: {
          total_aircraft: 2800,
          "5th_generation_fighters": ["J-20"],
        },
        nuclear_weapons: {
          total_warheads: 350,
          policy: "no first use",
        },
        budget: 224000000000,
      },
    });
    setStatistics(data);
  };

  useEffect(() => {
    if (!statistics) return;
    let chartStatus = Chart.getChart(chartRef.current.getContext("2d"));
    if (chartStatus) {
      chartStatus.destroy();
    }

    const labels = [
      "Active Personnel",
      "Reserve Personnel",
      "Budget (Billion USD)",
      "Nuclear Weapons",
    ];
    const datasets = Object.values(statistics).map((country) => ({
      label: country.name,
      data: [
        country.active_personnel,
        country.reserve_personnel,
        country.budget / 1e9, // Chuyển ngân sách sang tỷ USD
        country.nuclear_weapons,
      ],
      backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)}, 0.5)`,
      borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)}, 1)`,
      borderWidth: 1,
    }));

    // Khởi tạo biểu đồ
    new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Danh mục",
              font: {
                size: 14,
              },
            },
          },
          y: {
            title: {
              display: true,
              text: "Số lượng",
              font: {
                size: 14,
              },
            },
            beginAtZero: true,
          },
        },
      },
    });

    return () => {};
  }, [statistics]);

  return (
    <div>
      <form onSubmit={sendDataChart} className="flex gap-2">
        <input
          className="border rounded-md w-full py-1 px-2 focus:bg-border outline-none text-background"
          type="text"
          onChange={(e) => setQuestion(e.target.value)}
          value={question}
          placeholder="VD: So sánh lực lượng quân đội Mỹ và TQ"
        />
        <ButtonSubmit label="Vẽ" />
      </form>
      <div>
        <canvas
          ref={chartRef}
          height={200}
          className="max-h-[calc(100vh-80px)]"
        ></canvas>
      </div>
    </div>
  );
};

export default ChartComponent;
