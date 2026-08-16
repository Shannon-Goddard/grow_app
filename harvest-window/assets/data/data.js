// data.js

export const cannabisData = {
    growthStages: {
      seedling: {
        id: 'seedling-001.png',
        characteristics: {
          size: 'small',
          buds: false,
          leaves: 'cotyledons/early',
          color: 'green',
          features: ['small size', 'no buds', 'early leaves']
        }
      },
      vegetative: {
        id: 'vegetative-001.png',
        characteristics: {
          size: 'medium-large',
          buds: false,
          leaves: 'lush green',
          color: 'green',
          features: ['bushy', 'no buds', 'healthy growth']
        }
      },
      preflower: {
        id: 'preflower-001.png',
        characteristics: {
          size: 'medium',
          buds: 'early',
          leaves: 'green',
          color: 'green',
          features: ['small pistils', 'minimal trichomes', 'early buds']
        }
      },
      flower: {
        id: 'flower-001.png',
        characteristics: {
          size: 'large',
          buds: 'full',
          leaves: 'green',
          color: 'green',
          features: ['full buds', 'pistils', 'trichomes present'],
          trichomeRatios: { clear: 20, milky: 60, amber: 20 } // Middle flowering, assume white-amber-like
        }
      }
    },
    trichomeStages: {
      clear: {
        id: 'clear-001.png',
        ratios: { clear: 90, milky: 5, amber: 5 },
        features: ['mostly clear trichomes', 'minimal milky/amber']
      },
      clearWhite: {
        id: 'clear-white-001.png',
        ratios: { clear: 50, milky: 45, amber: 5 },
        features: ['half clear, half milky', 'few amber']
      },
      whiteAmber: {
        id: 'white-amber-001.png',
        ratios: { clear: 10, milky: 75, amber: 15 },
        features: ['mostly milky, some amber', 'few clear']
      },
      amber: {
        id: 'amber-001.png',
        ratios: { clear: 5, milky: 20, amber: 75 },
        features: ['mostly amber, some milky', 'few clear']
      }
    },
    nonCannabisExamples: [
      {
        id: 'non-cannabis-001.png',
        characteristics: {
          type: 'object',
          features: ['car', 'no plant features']
        }
      },
      {
        id: 'non-cannabis-002.png',
        characteristics: {
          type: 'object',
          features: ['cat', 'no plant features']
        }
      }
    ]
  };