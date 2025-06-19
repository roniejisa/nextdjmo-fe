export const colorSchemes = {
  monochromatic: {
    name: "Monochromatic",
    description: "Đơn sắc với các tông màu tương tự",
    generateColors: (hsl, context) => ({
      secondary: {
        h: hsl.h,
        s: Math.max(hsl.s * 0.65, 28),
        l: context.adjustLightnessForHarmony(hsl.l, "secondary"),
      },
      accent: {
        h: hsl.h,
        s: Math.min(hsl.s * 1.25, 88),
        l: context.adjustLightnessForHarmony(hsl.l, "accent"),
      },
    }),
  },

  "neon-cyberpunk": {
    name: "Neon Cyberpunk",
    description: "Phong cách cyberpunk với màu neon tương phản mạnh",
    generateColors: (hsl) => ({
      secondary: {
        h: (hsl.h + 150) % 360,
        s: Math.min(100, hsl.s * 1.3),
        l: Math.max(hsl.l, 65),
      },
      accent: {
        h: (hsl.h + 300) % 360,
        s: Math.min(100, hsl.s * 1.5),
        l: Math.max(hsl.l, 70),
      },
    }),
  },

  "sunset-gradient": {
    name: "Sunset Gradient",
    description: "Hoàng hôn ấm áp với sắc cam vàng",
    generateColors: (hsl) => ({
      secondary: {
        h: (hsl.h + 30) % 360,
        s: Math.min(85, hsl.s * 1.2),
        l: Math.min(hsl.l * 1.1, 75),
      },
      accent: {
        h: (hsl.h + 60) % 360,
        s: Math.max(70, hsl.s * 0.9),
        l: Math.max(hsl.l * 1.2, 65),
      },
    }),
  },

  "ocean-depths": {
    name: "Ocean Depths",
    description: "Đại dương sâu thẳm với xanh dương và san hô",
    generateColors: (hsl) => ({
      secondary: {
        h: (hsl.h + 180) % 360,
        s: Math.min(90, hsl.s * 1.4),
        l: Math.max(hsl.l * 0.7, 25),
      },
      accent: {
        h: (hsl.h + 45) % 360,
        s: Math.min(95, hsl.s * 1.3),
        l: Math.min(hsl.l * 1.3, 80),
      },
    }),
  },

  "forest-mystique": {
    name: "Forest Mystique",
    description: "Rừng huyền bí với xanh lá và nâu đất",
    generateColors: (hsl) => ({
      secondary: {
        h: hsl.h < 180 ? (hsl.h + 120) % 360 : (hsl.h - 120) % 360,
        s: Math.max(45, hsl.s * 0.8),
        l: Math.max(hsl.l * 0.85, 35),
      },
      accent: {
        h: (hsl.h + 200) % 360,
        s: Math.min(60, hsl.s * 0.7),
        l: Math.min(hsl.l * 1.1, 70),
      },
    }),
  },

  "retro-synthwave": {
    name: "Retro Synthwave",
    description: "Phong cách 80s với tím và hồng neon",
    generateColors: (hsl) => ({
      secondary: {
        h: (hsl.h + 270) % 360,
        s: Math.min(100, hsl.s * 1.4),
        l: Math.max(hsl.l, 60),
      },
      accent: {
        h: (hsl.h + 330) % 360,
        s: Math.min(95, hsl.s * 1.6),
        l: Math.max(hsl.l * 1.1, 70),
      },
    }),
  },

  "desert-mirage": {
    name: "Desert Mirage",
    description: "Sa mạc với vàng cát và cam ấm",
    generateColors: (hsl) => ({
      secondary: {
        h: (hsl.h + 25) % 360,
        s: Math.max(50, hsl.s * 0.9),
        l: Math.min(hsl.l * 1.2, 80),
      },
      accent: {
        h: (hsl.h + 50) % 360,
        s: Math.min(85, hsl.s * 1.1),
        l: Math.max(hsl.l * 0.9, 45),
      },
    }),
  },

  "aurora-borealis": {
    name: "Aurora Borealis",
    description: "Cực quang với xanh lá và tím",
    generateColors: (hsl) => ({
      secondary: {
        h: (hsl.h + 90) % 360,
        s: Math.min(100, hsl.s * 1.5),
        l: Math.max(hsl.l, 55),
      },
      accent: {
        h: (hsl.h + 240) % 360,
        s: Math.min(90, hsl.s * 1.3),
        l: Math.min(hsl.l * 1.1, 75),
      },
    }),
  },

  "volcanic-eruption": {
    name: "Volcanic Eruption",
    description: "Núi lửa mãnh liệt với đỏ cam",
    generateColors: (hsl) => ({
      secondary: {
        h: Math.max(0, Math.min(30, hsl.h + 15)),
        s: Math.min(100, hsl.s * 1.6),
        l: Math.max(hsl.l * 0.8, 40),
      },
      accent: {
        h: (hsl.h + 45) % 360,
        s: Math.min(95, hsl.s * 1.4),
        l: Math.min(hsl.l * 1.3, 85),
      },
    }),
  },

  "galaxy-nebula": {
    name: "Galaxy Nebula",
    description: "Thiên hà với tím và xanh dương sâu",
    generateColors: (hsl) => ({
      secondary: {
        h: (hsl.h + 210) % 360,
        s: Math.min(100, hsl.s * 1.3),
        l: Math.max(hsl.l * 0.6, 30),
      },
      accent: {
        h: (hsl.h + 280) % 360,
        s: Math.min(85, hsl.s * 1.1),
        l: Math.min(hsl.l * 1.4, 90),
      },
    }),
  },

  "cherry-blossom": {
    name: "Cherry Blossom",
    description: "Hoa anh đào với hồng pastel nhẹ nhàng",
    generateColors: (hsl) => ({
      secondary: {
        h: (hsl.h + 315) % 360,
        s: Math.max(40, hsl.s * 0.7),
        l: Math.min(hsl.l * 1.3, 85),
      },
      accent: {
        h: (hsl.h + 340) % 360,
        s: Math.min(70, hsl.s * 0.9),
        l: Math.max(hsl.l * 1.1, 70),
      },
    }),
  },

  "steampunk-bronze": {
    name: "Steampunk Bronze",
    description: "Phong cách steampunk với đồng và xanh cổ điển",
    generateColors: (hsl) => ({
      secondary: {
        h: (hsl.h + 35) % 360,
        s: Math.max(55, hsl.s * 0.8),
        l: Math.max(hsl.l * 0.9, 45),
      },
      accent: {
        h: (hsl.h + 190) % 360,
        s: Math.min(70, hsl.s * 0.9),
        l: Math.min(hsl.l * 1.1, 65),
      },
    }),
  },
};
