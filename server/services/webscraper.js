const { JSDOM } = require('jsdom');
const jsdom = require('jsdom');
const virtualConsole = new jsdom.VirtualConsole();

virtualConsole.on("error", () => {
  // No-op to skip console errors.
});

const checkLink = async (recipeUrl, timeout, recipe) => {
    // Function to check if the HTML of the page is retrievable
    // Resolves true if link is alive, false if dead

    // Timeout promise so that we don't wait so long
    const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error(`Request timed out after ${timeout} ms`));
        }, timeout);
    });

    // Normal fetch to the URL
    const fetchPromise = fetch(recipeUrl);
    
    // Helper variables
    let resOk = false;
    let jsonLdHtml = null;
    let jsonLd = null;
    let stringArray = [];

    // Race the promises so that if the fetch takes too long, we reject
    return Promise.race([fetchPromise, timeoutPromise]).then(res => {
        console.log(`Fetched ${recipeUrl}`);
        // Guard clause
        if (!res.ok) {
            return false;
        }
        // Get webpage raw HTML
        return res.text();
    }).then(res => {
        // Guard clause
        if (!res) { 
            return false;
        }
        // Get Json LD document selector
        jsonLdHtml = (new JSDOM(res, { virtualConsole })).window.document.querySelector('script[type="application/ld+json"]');
        // If there is no jsonLd, return false
        if (!jsonLdHtml) {
            return false;
        }
        jsonLd = JSON.parse(jsonLdHtml.innerHTML);
        // If the JSON LD is in an array, find the one with the recipeInstructions
        if (Array.isArray(jsonLd)) {
            let recipeIndex = 0;
            jsonLd.forEach((obj, index) => {
                if (obj.recipeInstructions) {
                    recipeIndex = index;
                }
            });
            jsonLd = jsonLd[recipeIndex];
        }
        // Look through recipe instructions
        if (jsonLd.recipeInstructions) {
            let recipeInstructions = jsonLd.recipeInstructions.flat(1);
            recipeInstructions.forEach(obj => {
                stringArray.push(obj.text)
            });
        }
        // If there is a string array, attach it to the recipe object
        if (stringArray.length > 0) {
            recipe["directions"] = stringArray;
        }
        // Return true
        return true;
    }).catch(_ => {
        console.log(`Could not fetch ${recipeUrl}`);
        return false;
    });
}

module.exports = { checkLink }

//// DEAD LINK
//checkLink("https://www.averiecooks.com/ham-cheese-sliders/", 3000)
//
//// INSTRUCTIONS OUTSIDE OF JSON LD
//addDirections("https://www.thedailymeal.com/recipes/grilled-steak-eggs-and-home-fries-recipe");
//
//// NON NESTED JSON ARRAY
//addDirections("https://www.delish.com/cooking/recipe-ideas/a30433895/steak-and-eggs-recipe/");
//
//// GOOD JSON LD, ONE JSON OBJECT, NO NESTING
//addDirections("https://www.delish.com/cooking/recipe-ideas/recipes/a50191/steak-eggs-hash-recipe/");
//
//// GOOD JSON LD, ONE JSON OBJECT, WITH NESTING
//addDirections("https://food52.com/recipes/25866-extraordinary-marinated-and-roasted-chicken-potatoes-and-chickpeas")
//
//// GOOD JSON LD, ARRAY JSON OBJECT, NO NESTING
//addDirections("https://www.realsimple.com/food-recipes/browse-all-recipes/slow-roasted-lemon-and-herb-chicken")
//
//// GOOD JSON LD, ARRAY JSON OBJECT, WITH NESTING
// addDirections("")
