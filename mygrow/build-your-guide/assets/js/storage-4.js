// Storage Service
const StorageService = {
  saveTable: (content) => {
    localStorage.setItem('page_html4', JSON.stringify(content));
  },

  loadTable: () => {
    return JSON.parse(localStorage.getItem('page_html4'));
  },

  getPlant4Strain: () => {
    return localStorage.plant4Strain;
  },

  getPlant4Height: () => {
    return localStorage.plant4Height;
  },

  getPlant4Grow: () => {
    return localStorage.plant4Grow;
  },

  getPlant4Watts: () => {
    return localStorage.plant4watts;
  },

  getPlant4Logo: () => {
    return localStorage.getItem('plant4Logo');
  },

  removeItem: (key) => {
    localStorage.removeItem(key);
  }
};
