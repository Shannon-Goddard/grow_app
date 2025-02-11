$(function(){
  const table = $("#table2");
  const content = document.getElementById('table2');
  
  // Utility functions for flowering classes
  const numberToWord = (num) => {
    const words = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
                  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 
                  'eighteen', 'nineteen', 'twenty', 'twentyone', 'twentytwo', 'twentythree', 'twentyfour'];
    return words[num];
  };

  const createFloweringClasses = (start, end) => {
    const classes = [];
    for (let i = start; i <= end; i++) {
      classes.push(`.${numberToWord(i)}Flowering`);
    }
    return classes;
  };

  // Make table editable
  table.attr("contenteditable", "true");

  // Save function for table content
  const saveAllTables = () => {
    if (content) {
      $('.strain').each(function(){
        $(this).html(StorageService.getPlant2Strain());
      });
      StorageService.saveTable(content.innerHTML);
    }
  };

  // Auto-save before page unload
  window.addEventListener('beforeunload', saveAllTables);

  // Load saved content
  const savedContent = StorageService.loadTable();
  if (savedContent) {
    content.innerHTML = savedContent;
    $('.strain').each(function(){
      $(this).html(StorageService.getPlant2Strain());
    });
  }

  // Event Handlers
  $(".get-started-btn").click(function() {
    const startDate = new Date($('#start').val());
    DateService.updateTableDates('.datetime', startDate, 1);
    DateService.updateTableDates('.datetime2', startDate, 1);
    saveAllTables();
  });

  // Initialize UI
  const initializeUI = () => {
    $('table tr').show();
    $('.notes').hide();
    $('#tablePage').toggle(!!navigator.canShare);
    $("#start").click(() => $("#taskButton").show());
    
    // Display stored values
    $("#strain").html(StorageService.getPlant2Strain());
    $("#Grow").html(StorageService.getPlant2Height());
    $("#image").attr("src", StorageService.getPlant2Logo()).show();
    
    // Calculate total days using PlantConfig
    const plant2Height = StorageService.getPlant2Height();
    const plant2Grow = parseInt(StorageService.getPlant2Grow()) || 0;
    const vegWeeks = parseInt(PlantConfig.heightToVegWeeks[plant2Height] || "0");
    const totalDays = (plant2Grow * 7) + (vegWeeks * 7) + 18;
    
    if (document.getElementById("info")) {
      document.getElementById("info").innerHTML = `${totalDays} days`;
    }
    
    // Update light inches using PlantConfig
    const watts = StorageService.getPlant2Watts();
    if (PlantConfig.wattageToInches[watts]) {
      $(".lightInches").text(PlantConfig.wattageToInches[watts]);
    }

    // Remove classes based on plant2 height using PlantConfig
    const classesToRemove = PlantConfig.heightFilters[plant2Height] || [];
    classesToRemove.forEach(className => {
      $(className).remove();
      StorageService.removeItem(className.replace('.', ''));
    });

    // Handle flowering week classes
    const floweringWeek = parseInt(StorageService.getPlant2Grow());
    if (floweringWeek >= 4 && floweringWeek <= 11) {
      const floweringClassesToRemove = createFloweringClasses(floweringWeek + 1, 24);
      floweringClassesToRemove.forEach(className => {
        $(className).remove();  // Remove from DOM
        StorageService.removeItem(className.replace('.', '')); // Using StorageService instead of direct localStorage
      });
    }
  };

  initializeUI();
});

