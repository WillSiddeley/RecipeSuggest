
const capitalize = (str) => {
    // Capitalizes the first character in a string
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const titleize = (str) => {
    // Capitalize each word in a string
    let words = str.split(" ");
    let capitalWords = [];
    words.forEach(word => {
        capitalWords.push(capitalize(word));
    })
    return capitalWords.join(" ");
}

const sentanceize = (str) => {
    // Capitalize first letter, everything else lowercase
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

module.exports = { capitalize, titleize, sentanceize };