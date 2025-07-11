// Plant Configuration Constants
const PlantConfig = {
  heightToVegWeeks: {
    "1-2 feet": "4",
    "3-4 feet": "8",
    "5+ feet": "8"
  },

  wattageToInches: {
    '125W': '12 Inches',
    '250W': '16 Inches',
    '400W': '20 Inches',
    '600W': '30 Inches',
    '1000W': '36 Inches'
  },

  heightFilters: {
    "1-2 feet": [".eightWeeks", ".twelveWeeks", ".sixteenWeeks"],
    "3-4 feet": [".twelveWeeks", ".sixteenWeeks"],
    "5-6 feet": [".sixteenWeeks"]
  }
};
