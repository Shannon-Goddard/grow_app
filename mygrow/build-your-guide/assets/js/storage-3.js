// Storage Service
const StorageService = {
  saveTable: (content) => {
    localStorage.setItem('page_html3', JSON.stringify(content));
  },

  loadTable: () => {
    return JSON.parse(localStorage.getItem('page_html3'));
  },

  getPlant3Strain: () => {
    return localStorage.plant3Strain;
  },

  getPlant3Height: () => {
    return localStorage.plant3Height;
  },

  getPlant3Grow: () => {
    return localStorage.plant3Grow;
  },

  getPlant3Watts: () => {
    return localStorage.plant3watts;
  },

  getPlant3Logo: () => {
    return localStorage.getItem('plant3Logo');
  },

  removeItem: (key) => {
    localStorage.removeItem(key);
  }
};
