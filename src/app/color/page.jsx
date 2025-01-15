"use client";
import React, { useState, useCallback } from "react";
import chroma from "chroma-js";

// Hàm tính độ tương phản giữa 2 màu
const getContrastRatio = (color1, color2) => {
  const luminance1 = chroma(color1).luminance();
  const luminance2 = chroma(color2).luminance();

  const ratio =
    (Math.max(luminance1, luminance2) + 0.05) / 
    (Math.min(luminance1, luminance2) + 0.05);
  return ratio;
};

// Hàm tính điểm tương phản theo chuẩn WCAG
const calculateContrastScore = (ratio) => {
  if (ratio >= 7) return 30; // Độ tương phản cao
  if (ratio >= 4.5) return 20; // Độ tương phản đủ cho văn bản bình thường
  if (ratio >= 3) return 10; // Độ tương phản đủ cho văn bản lớn
  return 5; // Độ tương phản thấp quá, không đạt yêu cầu
};

// Tạo danh sách màu sắc cho button
const buttonColors = [
  "#ff6347", // Tomato Red
  "#4682b4", // Steel Blue
  "#32cd32", // Lime Green
  "#ff69b4", // Hot Pink
  "#ffff00", // Yellow
  "#8a2be2", // Blue Violet
  "#ff1493", // Deep Pink
  "#00bfff", // Deep Sky Blue
  "#ff4500", // Orange Red
  "#adff2f", // Green Yellow
];

const ColorGenerator = () => {
  const [backgroundColor, setBackgroundColor] = useState("#ecf7fb");
  const [generatedColors, setGeneratedColors] = useState({});
  const [contrastScore, setContrastScore] = useState(0);

  const generateLinkColor = (bgColor, buttonColor) => {
    // Màu liên kết cần có độ tương phản cao với nền
    const linkBaseColor = chroma(buttonColor).set("hsl.l", 0.5).hex(); // Điều chỉnh độ sáng

    const ratio = getContrastRatio(bgColor, linkBaseColor);
    
    // Nếu độ tương phản thấp, sáng lên một chút để dễ đọc hơn
    if (ratio < 4.5) {
      return chroma(linkBaseColor).set("hsl.l", 0.7).hex(); // Sáng lên một chút nếu không đủ độ tương phản
    }
    return linkBaseColor;
  };

  // Hàm chọn ngẫu nhiên màu button từ danh sách
  const generateButtonColor = () => {
    if (backgroundColor === "#ffffff" || backgroundColor === "white") {
      const randomIndex = Math.floor(Math.random() * buttonColors.length);
      return buttonColors[randomIndex];
    } else {
      const base = chroma(backgroundColor);
      const brightness = base.luminance();
      return brightness > 0.5
        ? base.darken(1).hex() // Màu tối nếu nền sáng
        : base.brighten(1.5).hex(); // Màu sáng nếu nền tối
    }
  };

  const generateAttractiveColors = useCallback(() => {
    const base = chroma(backgroundColor);

    // Background của khối sẽ sáng hơn nền để tạo sự nổi bật
    const blockBackground = base.brighten(1.2).hex();

    const generateTextColor = (bgColor) => {
      const brightness = chroma(bgColor).luminance();
      return brightness > 0.5 ? "#333333" : "#ffffff"; // Chữ tối trên nền sáng, chữ sáng trên nền tối
    };

    const text = generateTextColor(blockBackground);
    const secondaryText = chroma(text).brighten(1.4).hex();

    const buttonBase = generateButtonColor(); // Tính màu button dựa trên nền
    const buttonHover = chroma(buttonBase).darken(0.3).hex();
    const buttonHoverText = generateTextColor(buttonHover);

    const secondaryBackground = chroma(backgroundColor)
      .desaturate(0.1)
      .brighten(1.4)
      .hex();
    const border = chroma(secondaryBackground).darken(0.5).hex();
    const inputBackground = chroma(backgroundColor).brighten(1.8).hex();
    const inputText = generateTextColor(inputBackground);
    const inputPlaceholder = chroma(inputText).brighten(1.4).hex();

    // Tính toán màu liên kết (link) dựa trên màu button
    const linkAdjusted = generatedColors.link
      ? generateLinkColor(backgroundColor, generatedColors.buttonBase)
      : generateLinkColor(backgroundColor, buttonBase); // Điều chỉnh màu liên kết
    const linkHover = chroma(buttonBase).set("hsl.l", 0.8).hex(); // Màu hover sáng hơn một chút

    const adjustMessageColor = (color) => {
      const adjustedColor = chroma(color).set("hsl.l", 0.65).hex();
      const messageTextColor = generateTextColor(chroma(adjustedColor));
      return { color: adjustedColor, textColor: messageTextColor };
    };

    const { color: success, textColor: successText } =
      adjustMessageColor("#83c985");
    const { color: danger, textColor: dangerText } =
      adjustMessageColor("#f66156");
    const { color: warning, textColor: warningText } =
      adjustMessageColor("#ffb74d");
    const { color: info, textColor: infoText } = adjustMessageColor("#56aff6");

    // Cập nhật tất cả các màu
    setGeneratedColors((prevColors) => ({
      ...prevColors,
      backgroundColor,
      blockBackground,
      text,
      secondaryText,
      buttonText: generateTextColor(chroma(buttonBase)),
      buttonBase,
      buttonHover,
      buttonHoverText,
      secondaryBackground,
      border,
      inputBackground,
      inputText,
      inputPlaceholder,
      success,
      successText,
      danger,
      dangerText,
      warning,
      warningText,
      info,
      infoText,
      link: linkAdjusted, // Cập nhật màu liên kết đã điều chỉnh
      linkHover,
    }));

    const contrastRatio = getContrastRatio(backgroundColor, text);
    const score = calculateContrastScore(contrastRatio);
    setContrastScore(score);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backgroundColor, generatedColors.link]);

  const copyToClipboard = (color) => {
    navigator.clipboard.writeText(color).then(() => {
      alert(`Đã sao chép mã màu: ${color}`);
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: backgroundColor }}>
      <style>
        {`
          body {
            font-family: Arial, sans-serif;
          }
          button {
            color: ${generatedColors.buttonText};
            background-color: ${generatedColors.buttonBase};
            border-color: ${generatedColors.border};
            padding: 10px 20px;
            border-radius: 8px;
            transition: background-color 0.3s, color 0.3s, transform 0.3s, box-shadow 0.3s;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          button:hover {
            background-color: ${generatedColors.buttonHover};
            color: ${generatedColors.buttonHoverText};
            transform: scale(1.05);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
          }
          button:active {
            transform: scale(0.98);
            box-shadow: none;
          }
          input {
            padding: 10px;
            border-radius: 8px;
            border: 2px solid ${generatedColors.border};
            transition: background-color 0.3s, color 0.3s;
          }
          input::placeholder {
            color: ${generatedColors.inputPlaceholder};
          }
          input:focus {
            background-color: ${generatedColors.secondaryBackground};
            outline: none;
            transform: scale(1.02);
          }
          a {
            color: ${generatedColors.link};
            text-decoration: none;
            transition: color 0.3s;
          }
          a:hover {
            color: ${generatedColors.linkHover};
          }
          .block {
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
            transition: box-shadow 0.3s, transform 0.3s;
          }
          .block:hover {
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            transform: translateY(-5px);
          }
        `}
      </style>
      <div className="flex flex-col gap-4 p-8">
        <label>
          <input
            type="text"
            autoComplete="off"
            className="border"
            style={{
              borderColor: generatedColors.border,
              color: generatedColors.inputText,
              backgroundColor: generatedColors.inputBackground,
            }}
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            placeholder="Nhập mã màu nền"
          />
          <button className="ml-4" onClick={generateAttractiveColors}>
            Generate Colors
          </button>
        </label>
        <div
          style={{ backgroundColor: generatedColors.blockBackground }}
          className="block"
        >
          <div style={{ color: generatedColors.text }}>
            Đây là màu chữ chính
          </div>
          <div style={{ color: generatedColors.secondaryText }}>
            Đây là màu chữ phụ
          </div>
        </div>
        <div className="flex gap-4">
          <button
            style={{
              backgroundColor: generatedColors.success,
              color: generatedColors.successText,
            }}
          >
            Thành công
          </button>
          <button
            style={{
              backgroundColor: generatedColors.danger,
              color: generatedColors.dangerText,
            }}
          >
            Thất bại
          </button>
          <button
            style={{
              backgroundColor: generatedColors.warning,
              color: generatedColors.warningText,
            }}
          >
            Cảnh báo
          </button>
          <button
            style={{
              backgroundColor: generatedColors.info,
              color: generatedColors.infoText,
            }}
          >
            Thông báo
          </button>
        </div>
        <a href="#">Click me to see link color</a>
        <div className="mt-4">
          <strong>Độ tương phản điểm: {contrastScore}</strong>
        </div>

        {/* Bảng hiển thị màu */}
        <div
          className="mt-8 p-4"
          style={{
            backgroundColor: generatedColors.blockBackground,
            color: generatedColors.text,
          }}
        >
          <h3>Danh sách Màu sắc</h3>
          <table className="table-auto border-collapse w-full mt-4">
            <thead>
              <tr>
                <th className="border p-2">Tên</th>
                <th className="border p-2">Màu</th>
                <th className="border p-2">Chú thích</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(generatedColors).map(([key, color]) => (
                <tr key={key}>
                  <td className="border p-2">{key}</td>
                  <td
                    className="border p-2 flex"
                    onContextMenu={(e) => {
                      e.preventDefault();
                      copyToClipboard(color);
                    }}
                  >
                    <span className="flex-[0_0_100px]">{color}</span>
                    <div
                      style={{ backgroundColor: color }}
                      className="w-10 h-10 border"
                    ></div>
                  </td>
                  <td className="border p-2">Click chuột phải để sao chép</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ColorGenerator;