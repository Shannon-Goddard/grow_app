// Load TensorFlow.js for Teachable Machine
const tf = window.tf;
if (tf) {
    tf.ready().then(() => {
        tf.setBackend('cpu').then(() => {
            tf.ENV.set('WEBGL_CPU_FORWARD', false);
            tf.ENV.set('WEBGL_SIZE_UPLOAD_UNIFORM', 0);
            if (tf.getBackend() === 'cpu') {
                setup();
            }
        });
    });
}

// Teachable Machine model and state variables
let model, maxPredictions;

// Initialize the model when the page loads
async function setup() {
    // Check if we're running locally or on the production site
    const isLocal = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' ||
                   window.location.protocol === 'file:';
    
    // Use relative paths for local development, absolute paths for production
    const baseUrl = isLocal ? 'assets/js/' : 'https://www.loyal9.app/tools/harvest-window/assets/js/';
    const modelUrl = baseUrl + 'model.json';
    const metadataUrl = baseUrl + 'metadata.json';
    
    try {
        model = await tmImage.load(modelUrl, metadataUrl);
        maxPredictions = model.getTotalClasses();
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Error loading model:', error);
        document.getElementById('result').innerHTML = 
            '<strong>Model loading error:</strong><br>The AI model could not be loaded. ' +
            'This feature requires an internet connection and may not work in local development. ' +
            'The model will work correctly when deployed to www.loyal9.app.';
    }
}

// Handle file upload (store image but don’t classify immediately)
document.getElementById('imageUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        document.getElementById('fileName').textContent = file.name;
        const img = new Image();
        const reader = new FileReader();

        reader.onload = function(e) {
            img.src = e.target.result;
            img.onload = function() {
                const imageDisplay = document.getElementById('uploadedImage');
                imageDisplay.src = img.src;
                imageDisplay.style.display = 'block';
                imageDisplay.style.maxWidth = '300px';
                imageDisplay.style.margin = '20px auto';
                sessionStorage.setItem('uploadedImage', img.src);
            };
        };
        reader.readAsDataURL(file);
    }
});

// Classify the image using Teachable Machine with enhanced preprocessing
async function classifyImage(img) {
    if (!model) {
        document.getElementById('result').innerHTML = '<strong>Model not loaded</strong><br>The AI model is not available. ' +
            'This feature will work correctly when deployed to www.loyal9.app.';
        const loadingSpinner = document.getElementById('loadingSpinner');
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        return;
    }

    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingSpinner) loadingSpinner.style.display = 'block';
    document.getElementById('result').textContent = '';

    try {
        const resizedCanvas = document.createElement('canvas');
        resizedCanvas.width = 224;
        resizedCanvas.height = 224;
        const ctx = resizedCanvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, 224, 224);
        ctx.filter = 'contrast(110%) brightness(110%)';

        const prediction = await model.predict(resizedCanvas);
        let maxProbability = 0;
        let predictionLabel = 'unknown';
        for (let i = 0; i < prediction.length; i++) {
            const prob = prediction[i].probability;
            const label = prediction[i].className.toLowerCase();
            console.log(`Class: ${label}, Probability: ${prob.toFixed(2)}`);
            if (prob > maxProbability) {
                maxProbability = prob;
                predictionLabel = label;
            }
        }
        console.log(`Top prediction: ${predictionLabel} with probability ${maxProbability.toFixed(2)}`);

        const confidenceThreshold = 0.75; // Adjusted for higher confidence
        const minProbabilityDifference = 0.25; // Adjusted for a balanced distinction
        const secondMaxProbability = prediction[1]?.probability || 0;
        const probabilityDifference = maxProbability - secondMaxProbability;
        console.log(`Difference from second-highest: ${probabilityDifference.toFixed(2)}`);

        const classMapping = {
            'amber': getRandomFunnyResponse('amber'),
            'clear': getRandomFunnyResponse('clear'),
            'clear-white': getRandomFunnyResponse('clear-white'),
            'white': getRandomFunnyResponse('white'),
            'white-amber': getRandomFunnyResponse('white-amber'),
            'flower': getRandomFunnyResponse('flower'),
            'preflower': getRandomFunnyResponse('preflower'),
            'seedling': getRandomFunnyResponse('seedling'),
            'vegetative': getRandomFunnyResponse('vegetative'),
            'non-cannabis': getRandomNonCannabisResponse()
        };

        let resultText;
        if (maxProbability >= 0.99) { // Handle perfect or near-perfect predictions
            const funnyResponse = classMapping[predictionLabel] || "Hmm, I’m not sure—try a sharper pic!";
            resultText = `
                <strong>Prediction:</strong> ${predictionLabel}<br>
                <strong>Advice:</strong> ${funnyResponse}
            `;
        } else if (
            maxProbability >= confidenceThreshold &&
            probabilityDifference >= minProbabilityDifference
        ) {
            const funnyResponse = classMapping[predictionLabel] || "Hmm, I’m not sure—try a sharper pic!";
            resultText = `
                <strong>Prediction:</strong> ${predictionLabel}<br>
                <strong>Advice:</strong> ${funnyResponse}
            `;
        } else {
            const fallbackResponse = classMapping['non-cannabis'] || "Dude, I’m stumped—upload a crisper image!";
            resultText = `
                <strong>Prediction:</strong> Uncertain<br>
                <strong>Yo:</strong> ${fallbackResponse}
            `;
        }

        document.getElementById('result').innerHTML = resultText;
        
        // Track successful prediction in Google Analytics
        if (typeof gtag === 'function') {
            gtag('event', 'prediction_complete', {
                'event_category': 'Harvest Window',
                'event_label': predictionLabel,
                'value': Math.round(maxProbability * 100)
            });
        }
    } catch (error) {
        document.getElementById('result').textContent = 'Error processing image.';
    } finally {
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    }
}

// Handle the "Check My Bud" button click (trigger classification)
document.getElementById('checkBud').addEventListener('click', () => {
    const uploadedImage = sessionStorage.getItem('uploadedImage');
    if (uploadedImage) {
        const img = new Image();
        img.src = uploadedImage;
        img.onload = () => classifyImage(img);
    } else {
        document.getElementById('result').textContent = 'Please upload an image first!';
        const loadingSpinner = document.getElementById('loadingSpinner');
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    }
});

// Function to get a random funny response for each class
function getRandomFunnyResponse(className) {
    const responses = {
        'amber': [
            "Perfect timing, dude—your plant’s ready to chop for that sweet, relaxing high!",
            "Dude, it’s harvest o’clock—time to chop those amber trichomes for max chill!",
            "Golden hour, man—your buds are prime for chopping with those amber trichomes!",
            "Yo, your plant’s screaming ‘harvest me!’ with those amber trichomes—chop away!",
            "Amber alert, dude—your plant’s ready to harvest for that smooth, mellow vibe!"
        ],
        'clear': [
            "Way too early, dude—wait until those trichomes turn cloudy or amber before chopping!",
            "Whoa, hold up—those clear trichomes mean it’s not time to chop yet, chill!",
            "Too soon, man—let those trichomes get cloudy or amber before you harvest!",
            "Patience, dude—clear trichomes say your buds need more time before chopping!",
            "Not ready yet, bro—wait for cloudy or amber trichomes before harvesting!"
        ],
        'clear-white': [
            "Too early, dude—wait until those trichomes turn cloudy or amber.",
            "Hang tight, man—those clear-white trichomes need to mature before harvest.",
            "Not quite there, bro—let those trichomes cloud up or amber out before chopping!",
            "Easy, dude—clear-white means wait for cloudy or amber trichomes to harvest.",
            "Hold off, man—those clear-white trichomes aren’t ready, wait for amber or cloudy!"
        ],
        'white': [
            "Hmm, still developing—watch for more amber trichomes before harvest.",
            "Chill, dude—those white trichomes need to turn amber before you chop.",
            "Almost there, but not yet—wait for amber trichomes to peak for harvest.",
            "Patience, man—white trichomes mean hold off until you see more amber.",
            "Not ready, bro—those white trichomes need to amber up before harvesting!"
        ],
        'white-amber': [
            "Transitioning nicely—wait a bit longer for more amber for peak harvest.",
            "Getting close, dude—those white-amber trichomes need more amber before chopping!",
            "Almost prime time, man—wait for more amber trichomes to harvest perfectly.",
            "On the verge, bro—let those white-amber trichomes turn more amber for the best harvest.",
            "Nearly there, dude—hold off until those white-amber trichomes are mostly amber!"
        ],
        'flower': [
            "Your buds are flowering, but not ready to chop—patience, man!",
            "Flowering’s happening, dude—wait for trichomes to mature before chopping!",
            "Nice flowers, but hold off—let the trichomes get cloudy or amber before harvest.",
            "Buds are blooming, bro—don’t chop yet, wait for ripe trichomes!",
            "Flowering’s underway, man—patience until trichomes signal harvest time!"
        ],
        'preflower': [
            "Almost there, but not quite—check back in a couple weeks for harvest vibes.",
            "Getting close, dude—preflower stage means wait a few weeks for harvest readiness.",
            "Not ready yet, man—preflowers need time, check back in a couple weeks for chopping.",
            "Preflower vibes, bro—hang tight for a couple weeks before harvesting.",
            "Nearly harvest time, but not yet—wait a couple weeks for those preflowers to mature!"
        ],
        'seedling': [
            "Dude, we'll see you back in a few weeks—your plant’s just a baby!",
            "Baby plant alert, man—seedlings need weeks before you can even think of harvest!",
            "Way too young, dude—seedlings need time, check back in a few weeks for harvest.",
            "Just a seedling, bro—give it a few weeks before dreaming of chopping!",
            "Tiny seedling, man—patience, it’ll be harvest-ready in a few weeks!"
        ],
        'vegetative': [
            "Whoa, hold up—your plant’s still vegging out, give it some time to flower.",
            "Vegging hard, dude—wait for flowering before thinking about harvest!",
            "Not flowering yet, man—your plant’s vegging, so chill until it blooms.",
            "Still in veggie mode, bro—let it flower before you harvest those buds.",
            "Vegetative stage, dude—patience, wait for flowers before chopping time!"
        ]
    };
    const responsesForClass = responses[className] || ["Hmm, I’m not sure—try a sharper pic of those trichomes!"];
    const randomIndex = Math.floor(Math.random() * responsesForClass.length);
    return responsesForClass[randomIndex];
}

// Function to get a random smartass response for non-cannabis images
function getRandomNonCannabisResponse() {
    const responses = [
        "I wouldn’t smoke that, dude—looks like a bad trip waiting to happen!",
        "Bruh, that’s not a cannabis plant.",
        "Dude, huh-what? That’s not even close to a bud!",
        "Nice try, man—that’s not weed, that’s just... weird.",
        "Yo, what is this...?",
        "Seriously, bro? That’s not a plant, that’s a cry for help!",
        "Really? This is how you want to spend our time?",
        "C’mon, man—that’s not cannabis, that’s a science experiment gone wrong!",
        "What the hell, dude? That’s not bud, that’s just... nope!",
        "Hey, genius—that’s not a cannabis plant! Try again."
    ];
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
}

// Clear sessionStorage when the user leaves or refreshes
window.onunload = () => {
    sessionStorage.removeItem('uploadedImage');
};

// Ensure setup runs when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', setup);