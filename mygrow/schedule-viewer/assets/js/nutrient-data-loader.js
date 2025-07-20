// nutrient-data-loader.js
export async function loadNutrientData() {
    try {
        const response = await fetch('../../mygrow/build-your-guide/nutrient-data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading nutrient data:', error);
        return [];
    }
}

export function getNutrientValue(nutrientData, nutrientName, stage, week) {
    // Convert week format from "week 1" to "1"
    const weekNum = parseInt(week.replace('week ', '')) || 1;
    
    // Find matching nutrient data
    const match = nutrientData.find(item => 
        item['nutrient-name'] === nutrientName && 
        item.stage === stage.toLowerCase() && 
        item.week === String(weekNum)
    );
    
    if (match) {
        // Format the value with unit and per
        return match.amount > 0 ? `${match.amount}${match.unit}/${match.per}` : '0ml/L';
    }
    
    // Default value if no match found
    return '2ml/L';
}