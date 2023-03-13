const { JSDOM } = require('jsdom');

const checkLink = async (recipeUrl, timeout) => {
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

    // Race the promises so that if the fetch takes too long, we reject
    return Promise.race([fetchPromise, timeoutPromise]).then(res => {
        return res.ok;
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
        const stringArray = []
        //let jsonLD = JSON.parse(script.innerHTML);
        //console.log(script.innerHTML)
        if (script) {
            const jsonLD = JSON.parse(script.innerHTML)
            //console.log(jsonLD.length)
            if (Array.isArray(jsonLD)) {
                for (let i = 0; i < jsonLD.length; i++){
                    if (jsonLD[i]["recipeInstructions"]){
                        for (let j = 0; j < jsonLD[i]["recipeInstructions"].length; j++){
                            //console.log(jsonLD[i]["recipeInstructions"].length)
                            //console.log(jsonLD[i]["recipeInstructions"][j]["text"])
                            stringArray.push(jsonLD[i]["recipeInstructions"][j]["text"])
                        }
                    }
                }                    
                
            } else {
                console.log(jsonLD["recipeInstructions"])
            }
        }
        console.log(stringArray)
    }
     catch (error){
        console.error(error)
    }
}

    //return ["step1", "step2", "step3"]
    //console.log(recipeUrl);

module.exports = { checkLink, addDirections }

//checkLink("https://www.seriouseats.com/recipes/2011/10/cook-the-book-carroty-mac-and-cheese.html")

//addDirections("https://www.marthastewart.com/326792/beef-ragu-with-pasta")

addDirections("https://food52.com/recipes/25866-extraordinary-marinated-and-roasted-chicken-potatoes-and-chickpeas")