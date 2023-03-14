const { json } = require('express');
const { JSDOM } = require('jsdom');
const { flatten } = require('jsonld');

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
    
    let resOk = false;

    // Race the promises so that if the fetch takes too long, we reject
    return Promise.race([fetchPromise, timeoutPromise]).then(res => {
        resOk = res.ok;
        if (!resOk) {
            return false;
        }
        return res.text();
    }).then(res => {
        if (res === false) {
            return false;
        }
        const script = (new JSDOM(res)).window.document.querySelector('script[type="application/ld+json"]');
        return (script && resOk)
    }).catch(err => {
        console.log(err);
        return false;
    });
}

const addDirections = async (recipeUrl) => {
    // Function to scrape the HTML of the page for recipe directions
    // returns string array with directions of the recipe step by step

    try {
        const response = await fetch(recipeUrl)
        const html = await response.text()
        const dom = new JSDOM(html)
        const script = dom.window.document.querySelector('script[type="application/ld+json"]');
        let stringArray = []
        let jsonLD = JSON.parse(script.innerHTML);
        //console.log(jsonLD)
        // If the JSON LD is in an array, find the one with the recipeInstructions
        if (Array.isArray(jsonLD)) {
            let recipeIndex = 0;
            jsonLD.forEach((obj, index) => {
                if (obj.recipeInstructions) {
                    recipeIndex = index;
                }
            });
            jsonLD = jsonLD[recipeIndex];
        }
        // Look through recipe instructions
        if (jsonLD.recipeInstructions) {
            let recipeInstructions = jsonLD.recipeInstructions.flat(1);
            recipeInstructions.forEach(obj => {
                stringArray.push(obj.text)
            });
            console.log(stringArray);
        }

        //
        //console.log(script.innerHTML)
        //if (script) {
        //    const jsonLD = JSON.parse(script.innerHTML)
        //    console.log(jsonLD)
        //    if (Array.isArray(jsonLD)) {
        //        for (let i = 0; i < jsonLD.length; i++){
        //            if (jsonLD[i]["recipeInstructions"]){
        //                let flattenedArray = (jsonLD[i]["recipeInstructions"]).flat(1)
        //                //console.log(jsonLD[i]["recipeInstructions"])
        //                //console.log(flattenedArray)
        //                for (let j = 0; j < jsonLD[i]["recipeInstructions"].length; j++){
        //                    //console.log(jsonLD[i]["recipeInstructions"].length)
        //                    //console.log(jsonLD[i]["recipeInstructions"][j]["text"])
        //                    stringArray.push(jsonLD[i]["recipeInstructions"][j]["text"])
        //                }
        //            }
        //        }                    
        //        
        //    } else {
        //        //console.log(jsonLD["recipeInstructions"].flat(1))
        //        //console.log("is a dict")
        //        stringArray = traverseObject(jsonLD, stringArray)
        //        
        //    }
        //}
        //console.log(stringArray)

    }catch (error){
        console.error(error)
    }
}

function traverseObject(obj, stringArray) {
    console.log("gets here")
    for (let key in obj) {
        if (typeof obj[key] === 'object') {
            traverseObject(obj[key], stringArray);
      } else if (key === 'recipeInstructions') {
            if (Array.isArray(obj[key])) {
                console.log("gets here")
                for (let i = 0; i < obj[key].length; i++) {
                    stringArray.push(obj[key][i]['text']);
            }
        } else if (typeof obj[key] === 'object' && obj[key]['text']) {
            stringArray.push(obj[key]['text']);
        }
      }
    }
    return stringArray;
}

    //return ["step1", "step2", "step3"]
    //console.log(recipeUrl);

module.exports = { checkLink, addDirections }

// DEAD LINK
//Promise.all([checkLink("https://www.averiecooks.com/ham-cheese-sliders/", 3000)]).then(res => {
//    console.log(res);
//})

// INSTRUCTIONS OUTSIDE OF JSON LD
addDirections("https://www.thedailymeal.com/recipes/grilled-steak-eggs-and-home-fries-recipe");

// NON NESTED JSON ARRAY
addDirections("https://www.delish.com/cooking/recipe-ideas/a30433895/steak-and-eggs-recipe/");

// GOOD JSON LD, ONE JSON OBJECT, NO NESTING
addDirections("https://www.delish.com/cooking/recipe-ideas/recipes/a50191/steak-eggs-hash-recipe/");

// GOOD JSON LD, ONE JSON OBJECT, WITH NESTING
addDirections("https://food52.com/recipes/25866-extraordinary-marinated-and-roasted-chicken-potatoes-and-chickpeas")

// GOOD JSON LD, ARRAY JSON OBJECT, NO NESTING
addDirections("https://www.realsimple.com/food-recipes/browse-all-recipes/slow-roasted-lemon-and-herb-chicken")

// GOOD JSON LD, ARRAY JSON OBJECT, WITH NESTING
// addDirections("")



//checkLink("https://www.averiecooks.com/ham-cheese-sliders/", 3000)