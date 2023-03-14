
const capitalize = (str) => {
    if (!str) {
        return null;
    }
    // Capitalizes the first character in a string
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const titleize = (str) => {
    if (!str) {
        return null;
    }
    // Capitalize each word in a string
    let words = str.split(" ");
    let capitalWords = [];
    words.forEach(word => {
        capitalWords.push(capitalize(word));
    })
    return capitalWords.join(" ");
}

const sentanceize = (str) => {
    if (!str) {
        return null;
    }
    // Capitalize first letter, everything else lowercase
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const decharacterize = (str) => {
    if (!str) {
        return null;
    }
    // Remove all non letter characters
    return str.replace(/[^a-zA-Z]/g, '');
}

module.exports = { capitalize, titleize, sentanceize, decharacterize };