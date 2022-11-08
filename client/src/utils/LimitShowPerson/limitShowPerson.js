export const limitShowPerson = (arr = [], count = 1) => {
    const numberNeedToShow = 5 * count;
    const numberOfArr = arr.length;
    let newArr = [];
    if (numberNeedToShow <= numberOfArr) {
        for (let index = 0; index < numberNeedToShow; index++) {
            newArr.push(arr[index]);
        }
        return newArr;
    } else {
        return arr;
    }
};
