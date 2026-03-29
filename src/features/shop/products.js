const makeSvgDataUri = ({ bg1, bg2, title, emoji }) => {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${bg1}"/>
        <stop offset="1" stop-color="${bg2}"/>
      </linearGradient>
      <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="18" stdDeviation="25" flood-color="#000" flood-opacity="0.45" />
      </filter>
    </defs>
    <rect width="1200" height="800" fill="url(#g)"/>
    <circle cx="980" cy="220" r="220" fill="rgba(255,255,255,0.18)"/>
    <circle cx="260" cy="640" r="260" fill="rgba(0,0,0,0.10)"/>
    <g filter="url(#s)">
      <rect x="90" y="120" width="1020" height="560" rx="44" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.20)" />
    </g>
    <text x="150" y="330" font-size="120" font-family="Inter, Arial" fill="rgba(255,255,255,0.96)">${emoji}</text>
    <text x="150" y="440" font-size="72" font-weight="900" font-family="Inter, Arial" fill="rgba(255,255,255,0.96)">${title}</text>
    <text x="150" y="520" font-size="34" font-weight="800" font-family="Inter, Arial" fill="rgba(255,255,255,0.84)">SpeeDial</text>
  </svg>`;

  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
};

export const PRODUCTS = [
  // Chips (multiple flavors)
  {
    id: "chips-classic-salt",
    name: "Chips • Classic Salt",
    desc: "Simple, crispy, and perfectly salted.",
    type: "snack",
    category: "chips",
    price: 30,
    image: makeSvgDataUri({
      bg1: "#fbbf24",
      bg2: "#f97316",
      title: "Classic",
      emoji: "🥔",
    }),
  },
  {
    id: "chips-masala",
    name: "Chips • Masala",
    desc: "Spicy desi masala punch.",
    type: "snack",
    category: "chips",
    price: 35,
    image: makeSvgDataUri({
      bg1: "#d3243e",
      bg2: "#ef4444",
      title: "Masala",
      emoji: "🌶️",
    }),
  },
  {
    id: "chips-bbq",
    name: "Chips • BBQ",
    desc: "Smoky BBQ flavor with a crunch.",
    type: "snack",
    category: "chips",
    price: 40,
    image: makeSvgDataUri({
      bg1: "#a78bfa",
      bg2: "#8b5cf6",
      title: "BBQ",
      emoji: "🔥",
    }),
  },
  {
    id: "chips-cheese",
    name: "Chips • Cheese",
    desc: "Cheesy, creamy, dangerously addictive.",
    type: "snack",
    category: "chips",
    price: 40,
    image: makeSvgDataUri({
      bg1: "#fde047",
      bg2: "#f59e0b",
      title: "Cheese",
      emoji: "🧀",
    }),
  },
  {
    id: "chips-sour-cream",
    name: "Chips • Sour Cream",
    desc: "Tangy sour cream & onion vibes.",
    type: "snack",
    category: "chips",
    price: 45,
    image: makeSvgDataUri({
      bg1: "#22d3ee",
      bg2: "#3b82f6",
      title: "Sour",
      emoji: "🧅",
    }),
  },
  {
    id: "chips-sweet",
    name: "Chips • Tangy and Sweet",
    desc: "Sweet. Crisp. Perfect.",
    type: "snack",
    category: "chips",
    price: 45,
    image: makeSvgDataUri({
      bg1: "#a51458",
      bg2: "#d8781e",
      title: "Sweet",
      emoji: "🍅",
    }),
  },

  // Other snacks
  {
    id: "nachos",
    name: "Cheesy Nachos",
    desc: "Loaded nachos with a cheesy kick.",
    type: "snack",
    category: "snacks",
    price: 60,
    image: makeSvgDataUri({
      bg1: "#f72585",
      bg2: "#7209b7",
      title: "Nachos",
      emoji: "🧀",
    }),
  },
  {
    id: "cookies",
    name: "Choco Cookies",
    desc: "Soft cookies with chocolate chunks.",
    type: "snack",
    category: "snacks",
    price: 25,
    image: makeSvgDataUri({
      bg1: "#b08968",
      bg2: "#7f5539",
      title: "Cookies",
      emoji: "🍪",
    }),
  },
  {
    id: "kurkure",
    name: "Masala kurkure",
    desc: "flavour of Indian spices.",
    type: "snack",
    category: "snacks",
    price: 30,
    image: makeSvgDataUri({ bg1: "#043b15", bg2: "#7209b7", title: "Kurkure", emoji: "🧀" }),
  },

  // Drinks
  {
    id: "cola",
    name: "Cola",
    desc: "Ice-cold fizzy refreshment.",
    type: "drink",
    category: "drinks",
    price: 40,
    image: makeSvgDataUri({
      bg1: "#111827",
      bg2: "#ef4444",
      title: "Cola",
      emoji: "🥤",
    }),
  },
  {
    id: "lemonade",
    name: "Lemonade",
    desc: "Fresh and tangy.",
    type: "drink",
    category: "drinks",
    price: 50,
    image: makeSvgDataUri({
      bg1: "#34d399",
      bg2: "#f59e0b",
      title: "Lemonade",
      emoji: "🍋",
    }),
  },
  {
    id: "iced-tea",
    name: "Iced Tea",
    desc: "Sweet, chilled, and smooth.",
    type: "drink",
    category: "drinks",
    price: 55,
    image: makeSvgDataUri({
      bg1: "#06b6d4",
      bg2: "#2563eb",
      title: "Iced Tea",
      emoji: "🧊",
    }),
  },
  {
    id: "wtaer",
    name: "Water",
    desc: "Stay hydrated stay healthy",
    type: "drink",
    category: "drinks",
    price: 40,
    image: makeSvgDataUri({
      bg1: "#111827",
      bg2: "#08bfec",
      title: "Water",
      emoji: "💧",
    }),
  },
  {
    id: "chocolates",
    name: "Chocolate",
    desc: "A Bite of Happiness",
    type: "sweets",
    category: "sweets",
    price: 40,
    image: makeSvgDataUri({
      bg1: "#704d34",
      bg2: "#372d2d",
      title: "Chocolate",
      emoji: "🍫",
    }),
  },

  {
    id: "Candies",
    name: "Candies",
    desc: "A Bite of sweetness",
    type: "sweets",
    category: "sweets",
    price: 40,
    image: makeSvgDataUri({
      bg1: "#ceb6a6",
      bg2: "#c791c3",
      title: "Candies",
      emoji: "🍬",
    }),
  },

  {
    id: "ice-cream",
    name: "Ice Cream",
    desc: "A Bite of cold sweetness",
    type: "sweets",
    category: "sweets",
    price: 40,
    image: makeSvgDataUri({
      bg1: "#93cecf",
      bg2: "#d665da",
      title: "Ice Cream",
      emoji: "🍦",
    }),
  },
  
  
];

