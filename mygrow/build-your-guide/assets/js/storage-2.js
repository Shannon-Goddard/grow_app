// Storage Service
const StorageService = {
  saveTable: (content) => {
    localStorage.setItem('page_html2', JSON.stringify(content));
  },

  loadTable: () => {
    return JSON.parse(localStorage.getItem('page_html2'));
  },

  getPlant2Strain: () => {
    return localStorage.plant2Strain;
  },

  getPlant2Height: () => {
    return localStorage.plant2Height;
  },

  getPlant2Grow: () => {
    return localStorage.plant2Grow;
  },

  getPlant2Watts: () => {
    return localStorage.plant2watts;
  },

  getPlant2Logo: () => {
    return localStorage.getItem('plant2Logo');
  },

  removeItem: (key) => {
    localStorage.removeItem(key);
  }
};
