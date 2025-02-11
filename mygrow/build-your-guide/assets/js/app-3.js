$(function(){
  const table = $("#table3");
  const content = document.getElementById('table3');
  
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
        $(this).html(StorageService.getPlant3Strain());
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
      $(this).html(StorageService.getPlant3Strain());
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
    $("#strain").html(StorageService.getPlant3Strain());
    $("#Grow").html(StorageService.getPlant3Height());
    $("#image").attr("src", StorageService.getPlant3Logo()).show();
    
    // Calculate total days using PlantConfig
    const plant3Height = StorageService.getPlant3Height();
    const plant3Grow = parseInt(StorageService.getPlant3Grow()) || 0;
    const vegWeeks = parseInt(PlantConfig.heightToVegWeeks[plant3Height] || "0");
    const totalDays = (plant3Grow * 7) + (vegWeeks * 7) + 18;
    
    if (document.getElementById("info")) {
      document.getElementById("info").innerHTML = `${totalDays} days`;
    }
    
    // Update light inches using PlantConfig
    const watts = StorageService.getPlant3Watts();
    if (PlantConfig.wattageToInches[watts]) {
      $(".lightInches").text(PlantConfig.wattageToInches[watts]);
    }

    // Remove classes based on plant3 height using PlantConfig
    const classesToRemove = PlantConfig.heightFilters[plant3Height] || [];
    classesToRemove.forEach(className => {
      $(className).remove();
      StorageService.removeItem(className.replace('.', ''));
    });

    // Handle flowering week classes
    const floweringWeek = parseInt(StorageService.getPlant3Grow());
    if (floweringWeek >= 4 && floweringWeek <= 11) {
      const floweringClassesToRemove = createFloweringClasses(floweringWeek + 1, 34);
      floweringClassesToRemove.forEach(className => {
        $(className).remove();  // Remove from DOM
        StorageService.removeItem(className.replace('.', '')); // Using StorageService instead of direct localStorage
      });
    }
  };

  initializeUI();
});

