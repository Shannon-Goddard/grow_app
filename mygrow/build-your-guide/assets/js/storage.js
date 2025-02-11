// Storage Service
const StorageService = {
  saveTable: (content) => {
    localStorage.setItem('page_html', JSON.stringify(content));
  },

  loadTable: () => {
    return JSON.parse(localStorage.getItem('page_html'));
  },

  getPlantStrain: () => {
    return localStorage.plantStrain;
  },

  getPlantHeight: () => {
    return localStorage.plantHeight;
  },

  getPlantGrow: () => {
    return localStorage.plantGrow;
  },

  getPlantWatts: () => {
    return localStorage.plantwatts;
  },

  getPlantLogo: () => {
    return localStorage.getItem('plantLogo');
  },

  removeItem: (key) => {
    localStorage.removeItem(key);
  }
};
