$(function() {
  // Configuration for all plants
  const plants = [
    {
      logoKey: 'plantLogo',
      logoId: 'mylogo',
      textId: 'MyGrowText',
      addId: 'MyGrowAdd'
    },
    {
      logoKey: 'plant2Logo',
      logoId: 'my2logo',
      textId: 'MyGrow2Text',
      addId: 'MyGrow2Add'
    },
    {
      logoKey: 'plant3Logo',
      logoId: 'my3logo',
      textId: 'MyGrow3Text',
      addId: 'MyGrow3Add'
    },
    {
      logoKey: 'plant4Logo',
      logoId: 'my4logo',
      textId: 'MyGrow4Text',
      addId: 'MyGrow4Add'
    }
  ];

  // Process all plants
  const processPlants = () => {
    let hasAnyPlant = false;

    plants.forEach(plant => {
      const plantLogo = localStorage.getItem(plant.logoKey);
      
      if (plantLogo) {
        // Cache jQuery selectors
        const $logo = $(`#${plant.logoId}`);
        const $text = $(`#${plant.textId}`);
        const $add = $(`#${plant.addId}`);

        // Update elements
        $logo.attr('src', plantLogo);
        $text.show();
        $add.hide();
        
        hasAnyPlant = true;
      }
    });

    // Show task button if any plant exists
    if (hasAnyPlant) {
      $('#taskButton').show();
    }
  };

  // Initialize
  processPlants();
});
