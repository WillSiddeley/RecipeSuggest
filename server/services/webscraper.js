const { JSDOM } = require('jsdom');

const checkLink = async (recipeUrl) => {
    // Function to check if the HTML of the page is retrievable
    // Resolves true if link is alive, false if dead
    return fetch(recipeUrl).then(res => {
        return (res.status !== 404);
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
        const script = dom.window.document.querySelector('script[type="application/ld+json"]')
        const jsonLD = JSON.parse(script.innerHTML)
        console.log(jsonLD[0])
    } catch (error){
        console.error(error)
    }
}

    //return ["step1", "step2", "step3"]
    //console.log(recipeUrl);

module.exports = { checkLink, addDirections }

//checkLink("https://www.seriouseats.com/recipes/2011/10/cook-the-book-carroty-mac-and-cheese.html")

//addDirections("https://www.marthastewart.com/326792/beef-ragu-with-pasta")

addDirections("https://food52.com/recipes/25866-extraordinary-marinated-and-roasted-chicken-potatoes-and-chickpeas")