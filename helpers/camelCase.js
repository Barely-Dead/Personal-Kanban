

export const toCamelCase = (str) => {
    let array = str.split(" ");
    array = array.map((element, index) => {
        //console.log(index);
        return index == 0 ? element.toLowerCase() : element.charAt(0).toUpperCase() + element.slice(1);
    });
    return array.join('');

}

export const fromCamelCase = (str) => {
    let str1 = '';
    try {
        str1 = str.replace(/[A-Z]/g, letter => ` ${letter.toLowerCase()}`);
    } catch {
        return str.replace(/[a-z]?/, letter => `${letter.toUpperCase()}`);
    } finally {
        return str1.replace(/[a-z]?/, letter => `${letter.toUpperCase()}`);
    }
}