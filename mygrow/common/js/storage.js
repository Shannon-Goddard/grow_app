// Storage Service for managing metadata in localStorage
const StorageService = {
  // Get the plant strain from localStorage
  getPlantStrain() {
    try {
      return localStorage.getItem('plantStrain') || '';
    } catch (error) {
      console.error('Error accessing plantStrain from localStorage:', error);
      return '';
    }
  },

  // Get the plant height from localStorage
  getPlantHeight() {
    try {
      return localStorage.getItem('plantHeight') || '';
    } catch (error) {
      console.error('Error accessing plantHeight from localStorage:', error);
      return '';
    }
  },

  // Get the plant grow (flowering weeks) from localStorage
  getPlantGrow(growId) {
    try {
      const grow = localStorage.getItem(`plantGrow_${growId}`);
      const parsedGrow = grow ? JSON.parse(grow) : {};
      console.log(`Loaded plantGrow for ${growId}:`, parsedGrow);
      return parsedGrow; // Returns { floweringWeeks: 8, ... }
    } catch (error) {
      console.error(`Error accessing plantGrow_${growId} from localStorage:`, error);
      return {};
    }
  },

  // Get the plant watts from localStorage
  getPlantWatts() {
    try {
      return localStorage.getItem('plantwatts') || '';
    } catch (error) {
      console.error('Error accessing plantwatts from localStorage:', error);
      return '';
    }
  },

  // Get the plant logo from localStorage
  getPlantLogo() {
    try {
      return localStorage.getItem('plantLogo') || '';
    } catch (error) {
      console.error('Error accessing plantLogo from localStorage:', error);
      return '';
    }
  },

  // Remove an item from localStorage
  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key} from localStorage:`, error);
    }
  }
};

// Define getPlantGrow as a standalone function
const getPlantGrow = StorageService.getPlantGrow;

// Export StorageService and getPlantGrow
export { StorageService, getPlantGrow };

// Make StorageService globally accessible
window.StorageService = StorageService;