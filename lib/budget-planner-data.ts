import type { BudgetCategoryId } from "@/lib/constants";

export type BudgetTier = "budget" | "mid" | "luxury";

export const budgetTierSplits: Record<
  BudgetTier,
  Record<BudgetCategoryId, number>
> = {
  budget: {
    transport: 20,
    accommodation: 30,
    food: 25,
    activities: 15,
    visa: 5,
    other: 5,
  },
  mid: {
    transport: 20,
    accommodation: 35,
    food: 20,
    activities: 15,
    visa: 5,
    other: 5,
  },
  luxury: {
    transport: 18,
    accommodation: 40,
    food: 22,
    activities: 15,
    visa: 3,
    other: 2,
  },
};

export type BudgetProfile = {
  country: string;
  currency: string;
  dailyBudgets: Record<BudgetTier, number>;
  highlights: string[];
  notes: string;
};

export const budgetProfiles: BudgetProfile[] = [
  {
    country: "Japan",
    currency: "JPY",
    dailyBudgets: { budget: 12000, mid: 22000, luxury: 45000 },
    highlights: [
      "Tokyo: Shibuya, Asakusa, teamLab",
      "Kyoto: Fushimi Inari, Arashiyama",
      "Osaka food streets and markets",
      "Day trip to Nara",
    ],
    notes: "Rail passes and local transit can shift totals quickly.",
  },
  {
    country: "France",
    currency: "EUR",
    dailyBudgets: { budget: 90, mid: 160, luxury: 320 },
    highlights: [
      "Paris: Louvre, Seine walk, Montmartre",
      "Versailles day trip",
      "Lyon food markets",
      "Nice and the Riviera",
    ],
    notes: "Museum passes reduce attraction costs in major cities.",
  },
  {
    country: "Italy",
    currency: "EUR",
    dailyBudgets: { budget: 85, mid: 150, luxury: 300 },
    highlights: [
      "Rome: Colosseum, Trastevere, Vatican",
      "Florence: Duomo, Uffizi",
      "Venice: canals and islands",
      "Amalfi Coast day tours",
    ],
    notes: "Prebook timed tickets for popular sites.",
  },
  {
    country: "Spain",
    currency: "EUR",
    dailyBudgets: { budget: 70, mid: 130, luxury: 260 },
    highlights: [
      "Barcelona: Sagrada Familia, Park Guell",
      "Madrid: Prado, Retiro Park",
      "Seville: Alcazar, old town",
      "Granada: Alhambra",
    ],
    notes: "Tapas districts keep food costs flexible.",
  },
  {
    country: "United Kingdom",
    currency: "GBP",
    dailyBudgets: { budget: 95, mid: 180, luxury: 360 },
    highlights: [
      "London: Westminster, South Bank",
      "British Museum and museums district",
      "Bath or Oxford day trip",
      "Edinburgh Old Town",
    ],
    notes: "Use contactless transport caps in London.",
  },
  {
    country: "United States",
    currency: "USD",
    dailyBudgets: { budget: 120, mid: 220, luxury: 450 },
    highlights: [
      "New York: Central Park, Broadway",
      "San Francisco: Golden Gate, Alcatraz",
      "National parks day tours",
      "Food halls and local markets",
    ],
    notes: "City costs vary widely; adjust per destination.",
  },
  {
    country: "Thailand",
    currency: "THB",
    dailyBudgets: { budget: 1500, mid: 3000, luxury: 7000 },
    highlights: [
      "Bangkok temples and markets",
      "Chiang Mai old town and night bazaars",
      "Island hopping in Krabi or Phuket",
      "Ayutthaya day trip",
    ],
    notes: "Domestic flights can be a major swing cost.",
  },
  {
    country: "Singapore",
    currency: "SGD",
    dailyBudgets: { budget: 110, mid: 200, luxury: 420 },
    highlights: [
      "Gardens by the Bay",
      "Marina Bay and skyline",
      "Hawker centers",
      "Sentosa day trip",
    ],
    notes: "Public transit is efficient; taxis add up fast.",
  },
  {
    country: "Indonesia (Bali)",
    currency: "IDR",
    dailyBudgets: { budget: 650000, mid: 1300000, luxury: 3000000 },
    highlights: [
      "Ubud rice terraces and temples",
      "Uluwatu and beach clubs",
      "Mount Batur sunrise hike",
      "Nusa Penida day trip",
    ],
    notes: "Scooter rentals lower transport costs.",
  },
  {
    country: "Turkey",
    currency: "TRY",
    dailyBudgets: { budget: 1200, mid: 2200, luxury: 4500 },
    highlights: [
      "Istanbul: Hagia Sophia, Grand Bazaar",
      "Bosphorus cruise",
      "Cappadocia balloon tours",
      "Ephesus day trip",
    ],
    notes: "Tours can be bundled for discounts.",
  },
  {
    country: "UAE",
    currency: "AED",
    dailyBudgets: { budget: 250, mid: 450, luxury: 1000 },
    highlights: [
      "Dubai: Burj Khalifa, Dubai Mall",
      "Desert safari and dune activities",
      "Abu Dhabi: Grand Mosque",
      "Beach clubs and marinas",
    ],
    notes: "Attraction tickets are the biggest swing cost.",
  },
  {
    country: "Australia",
    currency: "AUD",
    dailyBudgets: { budget: 130, mid: 230, luxury: 480 },
    highlights: [
      "Sydney Opera House and harbor",
      "Melbourne laneways",
      "Great Ocean Road day trip",
      "Great Barrier Reef tours",
    ],
    notes: "Domestic flights can raise totals quickly.",
  },
  {
    country: "Brazil",
    currency: "BRL",
    dailyBudgets: { budget: 220, mid: 420, luxury: 900 },
    highlights: [
      "Rio: Christ the Redeemer, Copacabana",
      "Sao Paulo food markets",
      "Iguazu Falls",
      "Salvador historic center",
    ],
    notes: "City transfers and tours drive variance.",
  },
  {
    country: "India",
    currency: "INR",
    dailyBudgets: { budget: 2500, mid: 4500, luxury: 10000 },
    highlights: [
      "Delhi: Red Fort and bazaars",
      "Agra: Taj Mahal",
      "Jaipur: forts and palaces",
      "Kerala backwaters",
    ],
    notes: "Trains are affordable but book early.",
  },
  {
    country: "China",
    currency: "CNY",
    dailyBudgets: { budget: 350, mid: 700, luxury: 1600 },
    highlights: [
      "Beijing: Great Wall and Forbidden City",
      "Shanghai: Bund and Pudong",
      "Xian: Terracotta Army",
      "Chengdu pandas",
    ],
    notes: "Domestic trains are efficient for long routes.",
  },
  {
    country: "South Africa",
    currency: "ZAR",
    dailyBudgets: { budget: 1200, mid: 2200, luxury: 4500 },
    highlights: [
      "Cape Town: Table Mountain, waterfront",
      "Winelands day tours",
      "Garden Route drives",
      "Safari lodges",
    ],
    notes: "Safari add-ons increase totals significantly.",
  },
  {
    country: "Russia",
    currency: "RUB",
    dailyBudgets: { budget: 3500, mid: 7000, luxury: 18000 },
    highlights: [
      "Moscow: Red Square, Zaryadye",
      "St Petersburg: Hermitage, canals",
      "Golden Ring day trip",
      "Sochi coastline",
    ],
    notes: "Intercity trains can save time on long routes.",
  },
  {
    country: "Belarus",
    currency: "BYN",
    dailyBudgets: { budget: 90, mid: 160, luxury: 320 },
    highlights: [
      "Minsk old town and museums",
      "Mir Castle",
      "Nesvizh Palace",
      "Brest Fortress",
    ],
    notes: "Public transport is affordable and reliable.",
  },
  {
    country: "Kazakhstan",
    currency: "KZT",
    dailyBudgets: { budget: 12000, mid: 22000, luxury: 50000 },
    highlights: [
      "Almaty: Medeu, Shymbulak",
      "Big Almaty Lake",
      "Astana: modern landmarks",
      "Charyn Canyon day trip",
    ],
    notes: "Domestic flights cover large distances efficiently.",
  },
  {
    country: "Uzbekistan",
    currency: "UZS",
    dailyBudgets: { budget: 350000, mid: 650000, luxury: 1500000 },
    highlights: [
      "Samarkand: Registan",
      "Bukhara: old town",
      "Khiva: Itchan Kala",
      "Tashkent metro tour",
    ],
    notes: "High-speed trains connect key cities.",
  },
  {
    country: "Kyrgyzstan",
    currency: "KGS",
    dailyBudgets: { budget: 2500, mid: 5000, luxury: 12000 },
    highlights: [
      "Bishkek city parks",
      "Issyk-Kul lake",
      "Ala-Archa National Park",
      "Song-Kul trekking",
    ],
    notes: "Shared taxis are common between regions.",
  },
  {
    country: "Tajikistan",
    currency: "TJS",
    dailyBudgets: { budget: 120, mid: 220, luxury: 500 },
    highlights: [
      "Dushanbe city center",
      "Pamir Highway viewpoints",
      "Iskanderkul lake",
      "Penjikent ruins",
    ],
    notes: "Road travel is the main way to reach remote areas.",
  },
  {
    country: "Turkmenistan",
    currency: "TMT",
    dailyBudgets: { budget: 350, mid: 650, luxury: 1400 },
    highlights: [
      "Ashgabat monuments",
      "Darvaza gas crater",
      "Merv historical site",
      "Yangykala canyon",
    ],
    notes: "Tours are often bundled with transport and guides.",
  },
  {
    country: "Armenia",
    currency: "AMD",
    dailyBudgets: { budget: 12000, mid: 22000, luxury: 50000 },
    highlights: [
      "Yerevan: Cascade, Republic Square",
      "Geghard Monastery",
      "Lake Sevan",
      "Dilijan day trip",
    ],
    notes: "Day trips are easy with local drivers.",
  },
  {
    country: "Azerbaijan",
    currency: "AZN",
    dailyBudgets: { budget: 60, mid: 120, luxury: 260 },
    highlights: [
      "Baku: Old City, Flame Towers",
      "Gobustan petroglyphs",
      "Mud volcanoes tour",
      "Sheki historic center",
    ],
    notes: "City costs stay moderate outside peak season.",
  },
  {
    country: "Moldova",
    currency: "MDL",
    dailyBudgets: { budget: 800, mid: 1500, luxury: 3200 },
    highlights: [
      "Chisinau parks",
      "Cricova wine cellars",
      "Orheiul Vechi",
      "Transnistria day trip",
    ],
    notes: "Winery tours are a major part of spend.",
  },
];
