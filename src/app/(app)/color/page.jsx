"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Copy,
  Palette,
  Download,
  Eye,
  Sparkles,
  Zap,
  Check,
  RefreshCw,
  Star,
  Code2,
  FileText,
  ChevronDown,
  ChevronRight,
  Settings,
  Layers,
  Monitor,
  Smartphone,
  Globe,
  Heart,
  BookOpen,
  Briefcase,
  ShoppingCart,
  Stethoscope,
  Lightbulb,
  Contrast,
  Wand2,
  ArrowRight,
  TrendingUp,
  PaintBucket,
} from "lucide-react";
import { colorSchemes } from "./constants";

// Enhanced Smart Color System với thuật toán cải tiến
class SmartColorSystem {
  static generateColorPalettes(schemeKey, baseHsl, palettes) {
    const scheme = colorSchemes[schemeKey];

    if (!scheme) {
      throw new Error(`Color scheme "${schemeKey}" không tồn tại`);
    }

    // Generate HSL colors dựa trên scheme được chọn
    const hslColors = scheme.generateColors(baseHsl, this);

    // Convert HSL to HEX và generate adaptive shades cho secondary
    palettes.secondary = this.generateAdaptiveShades(
      this.hslToHex(hslColors.secondary),
      "secondary"
    );

    // Convert HSL to HEX và generate adaptive shades cho accent
    palettes.accent = this.generateAdaptiveShades(
      this.hslToHex(hslColors.accent),
      "accent"
    );

    return palettes;
  }

  static generateHarmoniousPalette(baseColor, harmonyType = "monochromatic") {
    const hsl = this.hexToHSL(baseColor);
    let palettes = {};

    // Enhanced primary palette với curve tối ưu - GIỮ NGUYÊN MÀU GỐC
    palettes.primary = this.generateAdaptiveShades(baseColor, "primary");

    palettes = this.generateColorPalettes(harmonyType, hsl, palettes);

    palettes.neutral = this.generateSmartNeutral(baseColor);
    return palettes;
  }

  static adjustLightnessForHarmony(baseLightness, type) {
    switch (type) {
      case "secondary":
        return baseLightness > 50
          ? Math.min(baseLightness + 12, 85)
          : Math.max(baseLightness + 18, 25);
      case "accent":
        return baseLightness > 60
          ? Math.max(baseLightness - 18, 25)
          : Math.min(baseLightness + 12, 75);
      default:
        return baseLightness;
    }
  }

  static generateAdaptiveShades(baseColor, type = "primary") {
    const baseHsl = this.hexToHSL(baseColor);
    const palette = {};
    const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

    // Giữ nguyên màu gốc cho shade 500
    palette[500] = baseColor;

    let lightnesses, saturations;

    if (type === "primary") {
      lightnesses = [97, 94, 87, 74, 59, baseHsl.l, 39, 30, 21, 13, 7];
      saturations = [32, 48, 63, 73, 82, baseHsl.s, 90, 94, 96, 98, 100];
    } else if (type === "secondary") {
      lightnesses = [98, 95, 90, 77, 63, baseHsl.l, 43, 33, 25, 17, 11];
      saturations = [28, 38, 53, 63, 70, baseHsl.s, 79, 83, 87, 92, 97];
    } else if (type === "accent") {
      lightnesses = [96, 93, 85, 72, 57, baseHsl.l, 37, 29, 23, 16, 9];
      saturations = [38, 53, 68, 78, 85, baseHsl.s, 92, 95, 97, 99, 100];
    }

    shades.forEach((shade, index) => {
      // Bỏ qua shade 500 vì đã gán màu gốc
      palette[shade] = this.hslToHex({
        h: baseHsl.h, // Giữ nguyên hue của màu gốc
        s: Math.min(Math.max(saturations[index], 0), 100),
        l: Math.max(Math.min(lightnesses[index], 98), 2),
      });
    });

    return palette;
  }

  static generateSmartNeutral(baseColor) {
    const hsl = this.hexToHSL(baseColor);
    const palette = {};
    const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

    const neutralHue = hsl.h;
    const lightnesses = [98, 96, 92, 83, 70, 54, 44, 34, 26, 17, 9];
    const saturations = [9, 7, 6, 5, 4, 4, 3, 3, 2, 2, 1];

    shades.forEach((shade, index) => {
      palette[shade] = this.hslToHex({
        h: neutralHue,
        s: saturations[index],
        l: lightnesses[index],
      });
    });

    return palette;
  }

  static generateSmartSemantic(baseColor) {
    const baseHsl = this.hexToHSL(baseColor);

    // Tạo màu success (xanh lá)
    const successHue = 142; // Hue cho màu xanh lá tự nhiên
    const successBase = this.hslToHex({
      h: successHue,
      s: Math.max(65, baseHsl.s * 0.8), // Saturation vừa phải
      l: 45, // Lightness cân bằng cho accessibility
    });

    // Tạo màu warning (cam/vàng)
    const warningHue = 38; // Hue cho màu cam
    const warningBase = this.hslToHex({
      h: warningHue,
      s: Math.max(85, baseHsl.s * 0.9), // Saturation cao hơn để nổi bật
      l: 50,
    });

    // Tạo màu error/danger (đỏ)
    const errorHue = 0; // Hue cho màu đỏ
    const errorBase = this.hslToHex({
      h: errorHue,
      s: Math.max(75, baseHsl.s * 0.85),
      l: 48,
    });

    // Tạo màu info (xanh dương) - có thể dựa trên baseColor hoặc tạo riêng
    const infoHue = baseHsl.h > 180 && baseHsl.h < 240 ? baseHsl.h : 217; // Sử dụng hue của base nếu là xanh, không thì dùng xanh dương chuẩn
    const infoBase = this.hslToHex({
      h: infoHue,
      s: Math.max(70, baseHsl.s * 0.8),
      l: 50,
    });

    // Helper function để tạo variants cho mỗi semantic color
    const generateSemanticVariants = (baseSemanticColor) => {
      const hsl = this.hexToHSL(baseSemanticColor);
      return {
        light: this.hslToHex({
          h: hsl.h,
          s: Math.max(15, hsl.s * 0.3),
          l: 95,
        }),
        DEFAULT: baseSemanticColor,
        dark: this.hslToHex({
          h: hsl.h,
          s: Math.min(100, hsl.s * 1.1),
          l: Math.max(25, hsl.l * 0.7),
        }),
        text: this.getOptimalTextColor(baseSemanticColor),
      };
    };

    return {
      success: generateSemanticVariants(successBase),
      warning: generateSemanticVariants(warningBase),
      error: generateSemanticVariants(errorBase),
      info: generateSemanticVariants(infoBase),
    };
  }

  // Utility functions
  static hexToHSL(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  static hslToHex({ h, s, l }) {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (c) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  static getContrastRatio(color1, color2) {
    const getLuminance = (hex) => {
      const rgb = [
        parseInt(hex.slice(1, 3), 16),
        parseInt(hex.slice(3, 5), 16),
        parseInt(hex.slice(5, 7), 16),
      ].map((c) => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    };

    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  }

  // Thêm method để gợi ý màu chữ tốt nhất
  static getOptimalTextColor(backgroundColor) {
    const contrastWithWhite = this.getContrastRatio(backgroundColor, "#ffffff");
    const contrastWithBlack = this.getContrastRatio(backgroundColor, "#000000");

    return contrastWithWhite > contrastWithBlack ? "#ffffff" : "#000000";
  }

  // Thêm method để đánh giá chất lượng tương phản
  static getContrastQuality(contrastRatio) {
    if (contrastRatio >= 7)
      return { level: "AAA", quality: "Xuất sắc", color: "green" };
    if (contrastRatio >= 4.5)
      return { level: "AA", quality: "Tốt", color: "blue" };
    if (contrastRatio >= 3)
      return { level: "AA Large", quality: "Khá", color: "yellow" };
    return { level: "Fail", quality: "Kém", color: "red" };
  }
}

const AdvancedSmartColorSystem = () => {
  const [brandColor, setBrandColor] = useState("#432de1");
  const [harmonyType, setHarmonyType] = useState("monochromatic");
  const [colorSystem, setColorSystem] = useState({});
  const [activeTab, setActiveTab] = useState("generator");
  const [copiedColor, setCopiedColor] = useState("");
  const [websiteType, setWebsiteType] = useState("corporate");
  const [expandedSections, setExpandedSections] = useState({
    primary: true,
    secondary: true,
    accent: true,
    neutral: false,
  });
  const [viewMode, setViewMode] = useState("desktop");
  const [isGenerating, setIsGenerating] = useState(false);

  const websitePresets = {
    corporate: {
      name: "Doanh nghiệp",
      description: "Chuyên nghiệp & tin cậy",
      harmony: "monochromatic",
      icon: Briefcase,
      color: "#1e40af",
    },
    creative: {
      name: "Sáng tạo",
      description: "Năng động & đầy màu sắc",
      harmony: "monochromatic",
      icon: Lightbulb,
      color: "#7c3aed",
    },
    tech: {
      name: "Công nghệ",
      description: "Hiện đại & tối giản",
      harmony: "monochromatic",
      icon: Monitor,
      color: "#0891b2",
    },
    ecommerce: {
      name: "Thương mại",
      description: "Thân thiện & dễ sử dụng",
      harmony: "monochromatic",
      icon: ShoppingCart,
      color: "#059669",
    },
    healthcare: {
      name: "Y tế",
      description: "Tin cậy & an toàn",
      harmony: "monochromatic",
      icon: Stethoscope,
      color: "#0284c7",
    },
    education: {
      name: "Giáo dục",
      description: "Thân thiện & dễ tiếp cận",
      harmony: "monochromatic",
      icon: BookOpen,
      color: "#dc2626",
    },
  };

  const generateSmartColorSystem = useCallback(async () => {
    setIsGenerating(true);

    // Simulate processing time for better UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    const palettes = SmartColorSystem.generateHarmoniousPalette(
      brandColor,
      harmonyType
    );
    const semantic = SmartColorSystem.generateSmartSemantic(brandColor);

    setColorSystem({
      ...palettes,
      semantic,
      generated: new Date().toISOString(),
      harmonyType,
      websiteType,
    });

    setIsGenerating(false);
  }, [brandColor, harmonyType, websiteType]);

  useEffect(() => {
    generateSmartColorSystem();
  }, [generateSmartColorSystem]);

  const applyWebsitePreset = (presetType) => {
    setWebsiteType(presetType);
    setHarmonyType(websitePresets[presetType].harmony);
    setBrandColor(websitePresets[presetType].color);
  };

  const designTokens = useMemo(() => {
    if (!colorSystem.primary) return {};
    return {
      colors: {
        primary: colorSystem.primary,
        secondary: colorSystem.secondary,
        accent: colorSystem.accent,
        neutral: colorSystem.neutral,
        semantic: colorSystem.semantic,
      },
      typography: {
        heading: colorSystem.neutral[900],
        body: colorSystem.neutral[700],
        caption: colorSystem.neutral[600],
        onPrimary: "#ffffff",
        onSecondary:
          colorSystem.secondary?.[900] ||
          colorSystem.secondary?.[800] ||
          colorSystem.secondary?.[700],
        onAccent: "#ffffff",
      },
      surfaces: {
        background: colorSystem.neutral[50],
        surface: "#ffffff",
        surfaceSecondary: colorSystem.neutral[100],
        border: colorSystem.neutral[200],
        divider: colorSystem.neutral[200],
      },
      shadows: {
        primary: `0 4px 14px 0 ${colorSystem.primary[500]}20`,
        secondary: `0 2px 8px 0 ${colorSystem.neutral[900]}10`,
        accent: `0 6px 20px 0 ${
          colorSystem.accent?.[500] ?? colorSystem.accent?.[400]
        }30`,
      },
    };
  }, [colorSystem]);

  const copyToClipboard = async (color, name) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(name);
      setTimeout(() => setCopiedColor(""), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const exportTokens = () => {
    const tokens = {
      name: "Advanced Smart Color System",
      version: "3.0.0",
      websiteType: websiteType,
      harmonyType: harmonyType,
      generated: new Date().toISOString(),
      tokens: designTokens,
    };

    const blob = new Blob([JSON.stringify(tokens, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `advanced-color-system-${websiteType}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSS = () => {
    if (!colorSystem.primary) return;

    let css = `:root {
  /* Generated by Advanced Smart Color System */
  /* Website Type: ${websitePresets[websiteType]?.name} */
  /* Harmony: ${harmonyType} */
  /* Generated: ${new Date().toLocaleString()} */

`;

    Object.entries(colorSystem.primary).forEach(([shade, color]) => {
      css += `  --color-primary-${shade}: ${color};\n`;
    });

    css += "\n";
    Object.entries(colorSystem.secondary).forEach(([shade, color]) => {
      css += `  --color-secondary-${shade}: ${color};\n`;
    });

    css += "\n";
    Object.entries(colorSystem.accent).forEach(([shade, color]) => {
      css += `  --color-accent-${shade}: ${color};\n`;
    });

    css += "\n";
    Object.entries(colorSystem.neutral).forEach(([shade, color]) => {
      css += `  --color-neutral-${shade}: ${color};\n`;
    });

    css += "\n  /* Semantic Colors */\n";
    Object.entries(colorSystem.semantic).forEach(([type, colors]) => {
      Object.entries(colors).forEach(([variant, color]) => {
        const name = variant === "DEFAULT" ? type : `${type}-${variant}`;
        css += `  --color-${name}: ${color};\n`;
      });
    });

    css += "}\n";

    const blob = new Blob([css], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `advanced-color-system-${websiteType}.css`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const ColorSwatch = ({ color, name, shade, onClick, isMain = false }) => {
    const contrastRatio = SmartColorSystem.getContrastRatio(color, "#ffffff");
    const optimalTextColor = SmartColorSystem.getOptimalTextColor(color);
    const contrastQuality = SmartColorSystem.getContrastQuality(contrastRatio);

    return (
      <div
        className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
          isMain ? "col-span-2 row-span-2" : ""
        }`}
        onClick={() => onClick(color, name)}
      >
        <div
          className={`w-full rounded-xl shadow-sm border border-white/20 relative overflow-hidden backdrop-blur-sm ${
            isMain ? "h-32" : "h-20"
          }`}
          style={{ backgroundColor: color }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
            {copiedColor === name ? (
              <div className="flex flex-col items-center gap-1">
                <Check
                  className="w-5 h-5"
                  style={{ color: optimalTextColor }}
                />
                <span
                  className="text-xs font-medium"
                  style={{ color: optimalTextColor }}
                >
                  Copied!
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Copy className="w-4 h-4" style={{ color: optimalTextColor }} />
                <span
                  className="text-xs font-medium"
                  style={{ color: optimalTextColor }}
                >
                  Copy
                </span>
              </div>
            )}
          </div>

          {isMain && (
            <div className="absolute bottom-3 left-3">
              <div
                className="text-sm font-bold"
                style={{ color: optimalTextColor }}
              >
                Main
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 text-center space-y-1">
          <div className="text-sm font-semibold text-gray-900">{shade}</div>
          <div className="text-xs text-gray-500 font-mono">{color}</div>
          <div className="flex items-center justify-center gap-1">
            <div
              className={`w-2 h-2 rounded-full`}
              style={{ backgroundColor: contrastQuality.color }}
            />
            <div className="text-xs text-gray-400">{contrastQuality.level}</div>
          </div>
          <div
            className="text-xs font-medium"
            style={{
              color: optimalTextColor,
              backgroundColor: color,
              padding: "2px 6px",
              borderRadius: "4px",
            }}
          >
            Màu chữ: {optimalTextColor}
          </div>
        </div>
      </div>
    );
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderPaletteSection = (colors, title, description, sectionKey) => {
    const isExpanded = expandedSections[sectionKey];
    const mainShade = colors["500"];

    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div
          className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
          onClick={() => toggleSection(sectionKey)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl shadow-md border-2 border-white"
                style={{ backgroundColor: mainShade }}
              />
              <div>
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                <p className="text-gray-600">{description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 font-mono">
                {mainShade}
              </span>
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="px-6 pb-6">
            <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-11 gap-3">
              {Object.entries(colors).map(([shade, color]) => (
                <ColorSwatch
                  key={shade}
                  color={color}
                  name={`${title.toLowerCase()}-${shade}`}
                  shade={shade}
                  onClick={copyToClipboard}
                  isMain={shade === "500"}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const WebsitePreview = () => (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
      {/* Browser Chrome */}
      <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-white rounded-lg px-3 py-1 text-sm text-gray-600 border">
              https://yourwebsite.com
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setViewMode("desktop")}
              className={`p-1 rounded ${
                viewMode === "desktop"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("mobile")}
              className={`p-1 rounded ${
                viewMode === "mobile"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`transition-all duration-300 ${
          viewMode === "mobile" ? "max-w-sm mx-auto" : ""
        }`}
      >
        {/* Status Bar */}
        <div
          className="h-1"
          style={{
            background: `linear-gradient(90deg, ${colorSystem.primary[500]}, ${colorSystem.accent[500]})`,
          }}
        />

        {/* Header */}
        <div
          className="px-6 py-4 border-b"
          style={{ backgroundColor: colorSystem.neutral[50] }}
        >
          <div className={`flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl shadow-md flex items-center justify-center"
                style={{ backgroundColor: colorSystem.primary[500] }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1
                  className="text-xl font-bold"
                  style={{ color: colorSystem.neutral[900] }}
                >
                  YourBrand
                </h1>
                <p
                  className="text-sm"
                  style={{ color: colorSystem.neutral[600] }}
                >
                  {websitePresets[websiteType]?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <nav
                className={`${
                  viewMode === "mobile" ? "hidden" : "flex"
                } items-center gap-6`}
              >
                <a
                  href="#"
                  style={{ color: colorSystem.neutral[600] }}
                  className="hover:text-gray-900 transition-colors"
                >
                  Home
                </a>
                <a
                  href="#"
                  style={{ color: colorSystem.neutral[600] }}
                  className="hover:text-gray-900 transition-colors"
                >
                  About
                </a>
                <a
                  href="#"
                  style={{ color: colorSystem.neutral[600] }}
                  className="hover:text-gray-900 transition-colors"
                >
                  Services
                </a>
                <a
                  href="#"
                  style={{ color: colorSystem.neutral[600] }}
                  className="hover:text-gray-900 transition-colors"
                >
                  Contact
                </a>
              </nav>
              <button
                className="px-4 py-2 rounded-lg font-medium text-white transition-all duration-200 hover:shadow-lg"
                style={{ backgroundColor: colorSystem.primary[500] }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div
          className="px-6 py-12 text-center"
          style={{
            background: `linear-gradient(135deg, ${colorSystem.primary[50]}, ${colorSystem.secondary[50]})`,
          }}
        >
          <h2
            className="text-4xl font-bold mb-4"
            style={{ color: colorSystem.neutral[900] }}
          >
            {websitePresets[websiteType]?.description}
          </h2>
          <p
            className="text-lg mb-8 max-w-2xl mx-auto"
            style={{ color: colorSystem.neutral[600] }}
          >
            Experience the perfect harmony of colors designed specifically for
            your {websitePresets[websiteType]?.name.toLowerCase()} website.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              className="px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:shadow-lg hover:scale-105"
              style={{ backgroundColor: colorSystem.primary[500] }}
            >
              Primary Action
            </button>
            <button
              className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg"
              style={{
                backgroundColor: colorSystem.secondary[500],
                color: colorSystem.secondary[900],
              }}
            >
              Secondary Action
            </button>
            <button
              className="px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:shadow-lg"
              style={{ backgroundColor: colorSystem.accent[500] }}
            >
              Accent Action
            </button>
          </div>
        </div>

        {/* Content Sections */}
        <div className="px-6 py-8 space-y-6">
          <div
            className={`grid ${
              viewMode === "mobile" ? "grid-cols-1" : "grid-cols-3"
            } gap-6`}
          >
            {[
              { title: "Feature One", icon: Zap },
              { title: "Feature Two", icon: Star },
              { title: "Feature Three", icon: Lightbulb },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border transition-all duration-200 hover:shadow-lg"
                style={{
                  backgroundColor: colorSystem.neutral[50],
                  borderColor: colorSystem.neutral[200],
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: colorSystem.accent[100] }}
                  >
                    <feature.icon
                      className="w-5 h-5"
                      style={{ color: colorSystem.accent[600] }}
                    />
                  </div>
                  <h3
                    className="font-semibold"
                    style={{ color: colorSystem.neutral[900] }}
                  >
                    {feature.title}
                  </h3>
                </div>
                <p
                  className="text-sm"
                  style={{ color: colorSystem.neutral[600] }}
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const SemanticColors = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Contrast className="w-5 h-5" />
        Semantic Colors
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(colorSystem.semantic || {}).map(([type, colors]) => (
          <div key={type} className="space-y-2">
            <h4 className="font-semibold text-gray-700 capitalize">{type}</h4>
            <div className="space-y-1">
              {Object.entries(colors).map(([variant, color]) => (
                <div
                  key={variant}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => copyToClipboard(color, `${type}-${variant}`)}
                >
                  <div
                    className="w-6 h-6 rounded border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {variant === "DEFAULT" ? "Default" : variant}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {color}
                    </div>
                  </div>
                  {copiedColor === `${type}-${variant}` && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const DesignTokensPanel = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Code2 className="w-5 h-5" />
          Design Tokens
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Typography Tokens */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Typography</h4>
            <div className="space-y-2">
              {Object.entries(designTokens.typography || {}).map(
                ([key, color]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => copyToClipboard(color, `typography-${key}`)}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded border border-gray-200"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm font-medium">{key}</span>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">
                      {color}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Surface Tokens */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Surfaces</h4>
            <div className="space-y-2">
              {Object.entries(designTokens.surfaces || {}).map(
                ([key, color]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => copyToClipboard(color, `surface-${key}`)}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded border border-gray-200"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm font-medium">{key}</span>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">
                      {color}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <SemanticColors />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Advanced Smart Color System
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tạo hệ thống màu sắc thông minh với thuật toán AI tiên tiến, tối ưu
            hóa cho trải nghiệm người dùng và khả năng tiếp cận
          </p>
        </div>

        {/* Main Controls */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Brand Color Input */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Màu thương hiệu
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="w-16 h-16 rounded-xl border-2 border-gray-200 cursor-pointer shadow-md hover:shadow-lg transition-shadow"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="#432de1"
                  />
                </div>
              </div>
            </div>

            {/* Harmony Type */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Kiểu hài hòa
              </label>
              <select
                value={harmonyType}
                onChange={(e) => setHarmonyType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {Array.from(Object.entries(colorSchemes)).map(
                  ([value, label]) => {
                    return (
                      <option key={value} value={value}>
                        {label?.description}
                      </option>
                    );
                  }
                )}
              </select>
            </div>

            {/* Generate Button */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Tạo hệ thống màu
              </label>
              <button
                onClick={generateSmartColorSystem}
                disabled={isGenerating}
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Tạo hệ thống màu
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Website Type Presets */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Mẫu thiết kế website
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(websitePresets).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => applyWebsitePreset(key)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                    websiteType === key
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: preset.color }}
                    >
                      <preset.icon className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gray-900">
                        {preset.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {preset.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8 bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
          {[
            { id: "generator", label: "Color Generator", icon: Palette },
            { id: "preview", label: "Website Preview", icon: Eye },
            { id: "tokens", label: "Design Tokens", icon: Code2 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-indigo-500 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "generator" && colorSystem.primary && (
            <div className="space-y-8">
              {renderPaletteSection(
                colorSystem.primary,
                "Primary",
                "Màu chính của thương hiệu",
                "primary"
              )}
              {renderPaletteSection(
                colorSystem.secondary,
                "Secondary",
                "Màu phụ hỗ trợ",
                "secondary"
              )}
              {renderPaletteSection(
                colorSystem.accent,
                "Accent",
                "Màu nhấn cho CTA",
                "accent"
              )}
              {renderPaletteSection(
                colorSystem.neutral,
                "Neutral",
                "Màu trung tính cho text và background",
                "neutral"
              )}
            </div>
          )}

          {activeTab === "preview" && <WebsitePreview />}

          {activeTab === "tokens" && <DesignTokensPanel />}
        </div>

        {/* Export Actions */}
        {colorSystem.primary && (
          <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export Options
            </h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={exportTokens}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors shadow-md"
              >
                <FileText className="w-5 h-5" />
                Export JSON
              </button>
              <button
                onClick={exportCSS}
                className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors shadow-md"
              >
                <Code2 className="w-5 h-5" />
                Export CSS
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg border border-gray-100">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-sm text-gray-600">
              Made with love for designers & developers
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSmartColorSystem;
