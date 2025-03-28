if (typeof window.askGusUsed === 'undefined') {
  window.askGusUsed = false;
}

function getGusHint(column, stage) {
  const hints = {
    "Beastie Bloomz®": {
      "GERMINATION": "Beastie Bloomz® is not used during germination. It’s for later stages like flowering.",
      "VEGETATIVE": "Beastie Bloomz® is typically not used in the vegetative stage. It’s more common in flowering.",
      "FLOWERING": "Beastie Bloomz® is often used in the flowering stage to boost bud development, around 0.5-1 tsp per gallon."
    },
    "Cal-Mag® Plus": {
      "GERMINATION": "Cal-Mag® Plus is usually not needed during germination, but a small amount like 0.5mL might be used if starting in a medium.",
      "VEGETATIVE": "Cal-Mag® Plus is often used in vegetative growth to support leaf development, usually around 5-10mL.",
      "FLOWERING": "Cal-Mag® Plus might still be used in flowering, but the amount could decrease. Check the day."
    },
    "Bio·Bloom": {
      "GERMINATION": "Bio·Bloom is not used during germination. It’s for later stages like flowering.",
      "VEGETATIVE": "Bio·Bloom is often used in small amounts during vegetative stage, around 5mL.",
      "FLOWERING": "Bio·Bloom is more common in flowering, often around 10-15mL."
    },
    "Tiger Bloom®": {
      "GERMINATION": "Tiger Bloom® is not used during germination. It’s for flowering stages.",
      "VEGETATIVE": "Tiger Bloom® is typically not used in vegetative stage. It’s for flowering.",
      "FLOWERING": "Tiger Bloom® is often used in flowering to enhance blooms, around 2-3 tsp per gallon."
    },
    "Big Bloom®": {
      "GERMINATION": "Big Bloom® can be used lightly during germination, around 1-2 Tbsp per gallon, to support early growth.",
      "VEGETATIVE": "Big Bloom® can be used in vegetative stage for organic growth, often around 2-4 Tbsp per gallon.",
      "FLOWERING": "Big Bloom® is great in flowering to enhance blooms, often around 2-4 Tbsp per gallon."
    },
    "Grow Big®": {
      "GERMINATION": "Grow Big® is not typically used during germination. It’s for vegetative growth.",
      "VEGETATIVE": "Grow Big® is ideal for vegetative growth, usually around 2-3 tsp per gallon.",
      "FLOWERING": "Grow Big® is typically reduced or stopped in flowering to focus on bloom nutrients."
    },
    "Boomerang®": {
      "GERMINATION": "Boomerang® is not used during germination. It’s for stressed plants in later stages.",
      "VEGETATIVE": "Boomerang® can be used in vegetative stage to help stressed plants recover, around 1-2 tsp per gallon.",
      "FLOWERING": "Boomerang® can help flowering plants recover from stress, around 1-2 tsp per gallon."
    },
    "Kangaroots®": {
      "GERMINATION": "Kangaroots® can be used during germination to enhance root development, around 0.5-1 tsp per gallon.",
      "VEGETATIVE": "Kangaroots® supports root growth in vegetative stage, often around 1-2 tsp per gallon.",
      "FLOWERING": "Kangaroots® can still be used in flowering to maintain healthy roots, around 1 tsp per gallon."
    },
    "Microbe Brew®": {
      "GERMINATION": "Microbe Brew® can be used lightly during germination to establish microbial life, around 0.5 tsp per gallon.",
      "VEGETATIVE": "Microbe Brew® enhances microbial activity in vegetative stage, around 1 tsp per gallon.",
      "FLOWERING": "Microbe Brew® supports root health in flowering, around 1 tsp per gallon."
    },
    "Wholly Mackerel®": {
      "GERMINATION": "Wholly Mackerel® can be used lightly during germination for organic nutrients, around 0.5 tsp per gallon.",
      "VEGETATIVE": "Wholly Mackerel® provides organic nutrients in vegetative stage, around 1-2 tsp per gallon.",
      "FLOWERING": "Wholly Mackerel® can be used in flowering for additional organic support, around 1 tsp per gallon."
    },
    "Kelp Me Kelp You®": {
      "GERMINATION": "Kelp Me Kelp You® can be used during germination to boost early growth, around 0.5 tsp per gallon.",
      "VEGETATIVE": "Kelp Me Kelp You® supports vegetative growth with kelp extracts, around 1-2 tsp per gallon.",
      "FLOWERING": "Kelp Me Kelp You® can enhance flowering with kelp benefits, around 1 tsp per gallon."
    },
    "Bembé®": {
      "GERMINATION": "Bembé® is not typically used during germination. It’s for flowering stages.",
      "VEGETATIVE": "Bembé® can be used sparingly in vegetative stage, around 0.5 tsp per gallon.",
      "FLOWERING": "Bembé® enhances flowering with sweet nutrients, around 1-2 tsp per gallon."
    },
    "Open Sesame®": {
      "GERMINATION": "Open Sesame® is not used during germination. It’s for early flowering.",
      "VEGETATIVE": "Open Sesame® is typically not used in vegetative stage. It’s for early flowering.",
      "FLOWERING": "Open Sesame® is used in early flowering to trigger blooms, around 0.5-1 tsp per gallon."
    },
    "Cha Ching®": {
      "GERMINATION": "Cha Ching® is not used during germination. It’s for late flowering.",
      "VEGETATIVE": "Cha Ching® is typically not used in vegetative stage. It’s for late flowering.",
      "FLOWERING": "Cha Ching® is used in late flowering to maximize production, around 0.5-1 tsp per gallon."
    },
    "FloraGro®": {
      "GERMINATION": "FloraGro® is not typically used during germination. It’s for vegetative growth.",
      "VEGETATIVE": "FloraGro® is used in vegetative stage for structural growth, often around 1-2 tsp per gallon.",
      "FLOWERING": "FloraGro® is reduced in flowering, often around 0.5-1 tsp per gallon."
    },
    "FloraBloom®": {
      "GERMINATION": "FloraBloom® is not used during germination. It’s for flowering stages.",
      "VEGETATIVE": "FloraBloom® is used sparingly in vegetative stage, around 0.5-1 tsp per gallon.",
      "FLOWERING": "FloraBloom® is key in flowering for bloom development, often around 2-3 tsp per gallon."
    },
    "FloraMicro®": {
      "GERMINATION": "FloraMicro® can be used lightly during germination for micronutrients, around 0.5 tsp per gallon.",
      "VEGETATIVE": "FloraMicro® provides essential micronutrients in vegetative stage, around 1-2 tsp per gallon.",
      "FLOWERING": "FloraMicro® continues in flowering for micronutrient support, around 1-2 tsp per gallon."
    },
    "FloraNova Grow": {
      "GERMINATION": "FloraNova Grow is not typically used during germination. It’s for vegetative growth.",
      "VEGETATIVE": "FloraNova Grow is ideal for vegetative growth, around 1-2 tsp per gallon.",
      "FLOWERING": "FloraNova Grow is typically reduced in flowering to focus on bloom nutrients."
    },
    "FloraNova Bloom": {
      "GERMINATION": "FloraNova Bloom is not used during germination. It’s for flowering stages.",
      "VEGETATIVE": "FloraNova Bloom is used sparingly in vegetative stage, around 0.5 tsp per gallon.",
      "FLOWERING": "FloraNova Bloom is key in flowering for bloom development, around 1-2 tsp per gallon."
    },
    "VooDoo Juice": {
      "GERMINATION": "VooDoo Juice can be used during germination to boost root microbes, around 2mL per liter.",
      "VEGETATIVE": "VooDoo Juice enhances root development in vegetative stage, around 2mL per liter.",
      "FLOWERING": "VooDoo Juice can still be used in flowering for root health, around 2mL per liter."
    },
    "Big Bud": {
      "GERMINATION": "Big Bud is not used during germination. It’s for flowering stages.",
      "VEGETATIVE": "Big Bud is typically not used in vegetative stage. It’s for flowering.",
      "FLOWERING": "Big Bud enhances bud development in flowering, around 2mL per liter."
    },
    "B-52": {
      "GERMINATION": "B-52 can be used lightly during germination for B-vitamins, around 1mL per liter.",
      "VEGETATIVE": "B-52 provides B-vitamins for vegetative growth, around 2mL per liter.",
      "FLOWERING": "B-52 supports flowering with B-vitamins, around 2mL per liter."
    },
    "Overdrive": {
      "GERMINATION": "Overdrive is not used during germination. It’s for late flowering.",
      "VEGETATIVE": "Overdrive is typically not used in vegetative stage. It’s for late flowering.",
      "FLOWERING": "Overdrive boosts late flowering for bigger yields, around 2mL per liter."
    },
    "Piranha": {
      "GERMINATION": "Piranha can be used during germination to establish beneficial fungi, around 2mL per liter.",
      "VEGETATIVE": "Piranha enhances root fungi in vegetative stage, around 2mL per liter.",
      "FLOWERING": "Piranha supports root health in flowering, around 2mL per liter."
    },
    "Bud Candy": {
      "GERMINATION": "Bud Candy is not typically used during germination. It’s for flowering.",
      "VEGETATIVE": "Bud Candy can be used sparingly in vegetative stage, around 1mL per liter.",
      "FLOWERING": "Bud Candy enhances flavor and aroma in flowering, around 2mL per liter."
    },
    "Final Phaze": {
      "GERMINATION": "Final Phaze is not used during germination. It’s for flushing at the end.",
      "VEGETATIVE": "Final Phaze is not used in vegetative stage. It’s for flushing.",
      "FLOWERING": "Final Phaze is used at the end of flowering to flush, around 2mL per liter."
    },
    "Tarantula": {
      "GERMINATION": "Tarantula can be used during germination to establish beneficial bacteria, around 2mL per liter.",
      "VEGETATIVE": "Tarantula enhances root bacteria in vegetative stage, around 2mL per liter.",
      "FLOWERING": "Tarantula supports root health in flowering, around 2mL per liter."
    },
    "Nirvana": {
      "GERMINATION": "Nirvana can be used lightly during germination for organic nutrients, around 1mL per liter.",
      "VEGETATIVE": "Nirvana provides organic nutrients in vegetative stage, around 2mL per liter.",
      "FLOWERING": "Nirvana enhances flowering with organic support, around 2mL per liter."
    },
    "Sensizym": {
      "GERMINATION": "Sensizym can be used during germination to break down dead roots, around 1mL per liter.",
      "VEGETATIVE": "Sensizym helps break down dead roots in vegetative stage, around 2mL per liter.",
      "FLOWERING": "Sensizym supports root health in flowering, around 2mL per liter."
    },
    "Bud Ignitor": {
      "GERMINATION": "Bud Ignitor is not used during germination. It’s for early flowering.",
      "VEGETATIVE": "Bud Ignitor is typically not used in vegetative stage. It’s for early flowering.",
      "FLOWERING": "Bud Ignitor triggers early flowering for more bud sites, around 2mL per liter."
    },
    "Rhino Skin": {
      "GERMINATION": "Rhino Skin is not typically used during germination. It’s for later stages.",
      "VEGETATIVE": "Rhino Skin strengthens plant structure in vegetative stage, around 2mL per liter.",
      "FLOWERING": "Rhino Skin enhances plant strength in flowering, around 2mL per liter."
    },
    "Bud Factor X": {
      "GERMINATION": "Bud Factor X is not typically used during germination. It’s for flowering.",
      "VEGETATIVE": "Bud Factor X can be used sparingly in vegetative stage, around 1mL per liter.",
      "FLOWERING": "Bud Factor X enhances resin and aroma in flowering, around 2mL per liter."
    },
    "pH Perfect® Grow": {
      "GERMINATION": "pH Perfect® Grow is not typically used during germination. It’s for vegetative growth.",
      "VEGETATIVE": "pH Perfect® Grow is ideal for vegetative growth, around 4mL per liter.",
      "FLOWERING": "pH Perfect® Grow is typically reduced in flowering to focus on bloom nutrients."
    },
    "pH Perfect® Micro": {
      "GERMINATION": "pH Perfect® Micro can be used lightly during germination for micronutrients, around 1mL per liter.",
      "VEGETATIVE": "pH Perfect® Micro provides micronutrients in vegetative stage, around 4mL per liter.",
      "FLOWERING": "pH Perfect® Micro continues in flowering for micronutrient support, around 4mL per liter."
    },
    "pH Perfect® Bloom": {
      "GERMINATION": "pH Perfect® Bloom is not used during germination. It’s for flowering stages.",
      "VEGETATIVE": "pH Perfect® Bloom is used sparingly in vegetative stage, around 1mL per liter.",
      "FLOWERING": "pH Perfect® Bloom is key in flowering for bloom development, around 4mL per liter."
    }
  };
  return hints[column]?.[stage] || "'Check the stage of growth for this nutrient.'";
}

document.getElementById('ask-gus').addEventListener('click', () => {
  try {
    if (window.askGusUsed) return;
    window.askGusUsed = true;
    document.getElementById('ask-gus').disabled = true;
    if (window.isSoundOn && !window.lifelineSoundPlaying) {
      window.askGusSound.play();
      window.lifelineSoundPlaying = true;
    }
    const hint = getGusHint(window.currentQuestion.column, window.currentQuestion.stage);
    showSmokeMessage(hint);
  } catch (error) {
    console.error("Error in Ask Gus lifeline:", error);
  }
});