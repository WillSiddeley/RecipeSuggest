const openai = require("./services/openai");
const edemam = require("./services/edemam");

async function test() {

    const response = await edemam.queryEdemamRecipe("Creamy chicken alfredo");

    console.log(response);

    //response.hits.forEach(hit => {
    //    console.log(hit.recipe);
    //})

}

test();
