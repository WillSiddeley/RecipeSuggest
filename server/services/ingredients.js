const fs = require("fs")

const getCommon = () => {

    return fs.readFileSync("./assets/commonIngredients.txt").toString().split("\n");

}

const getAll = () => {

    return fs.readFileSync("./assets/allIngredients.txt").toString().split("\n");

}

module.exports = { getCommon, getAll };

    