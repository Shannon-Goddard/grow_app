// Date Utilities
const DateService = {
  formatDate: (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  },

  updateTableDates: (selector, startDate, daysToAdd) => {
    $(selector).each(function(index) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + daysToAdd + index);
      $(this).text(DateService.formatDate(date));
    });
  }
};
