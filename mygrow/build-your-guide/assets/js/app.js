$(function(){
  const table = $("#table1");
  const content = document.getElementById('table1');
  
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
        $(this).html(StorageService.getPlantStrain());
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
      $(this).html(StorageService.getPlantStrain());
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
    $("#strain").html(StorageService.getPlantStrain());
    $("#Grow").html(StorageService.getPlantHeight());
    $("#image").attr("src", StorageService.getPlantLogo()).show();
    
    // Calculate total days using PlantConfig
    const plantHeight = StorageService.getPlantHeight();
    const plantGrow = parseInt(StorageService.getPlantGrow()) || 0;
    const vegWeeks = parseInt(PlantConfig.heightToVegWeeks[plantHeight] || "0");
    const totalDays = (plantGrow * 7) + (vegWeeks * 7) + 18;
    
    if (document.getElementById("info")) {
      document.getElementById("info").innerHTML = `${totalDays} days`;
    }
    
    // Update light inches using PlantConfig
    const watts = StorageService.getPlantWatts();
    if (PlantConfig.wattageToInches[watts]) {
      $(".lightInches").text(PlantConfig.wattageToInches[watts]);
    }

    // Remove classes based on plant height using PlantConfig
    const classesToRemove = PlantConfig.heightFilters[plantHeight] || [];
    classesToRemove.forEach(className => {
      $(className).remove();
      StorageService.removeItem(className.replace('.', ''));
    });

    // Handle flowering week classes
    const floweringWeek = parseInt(StorageService.getPlantGrow());
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

