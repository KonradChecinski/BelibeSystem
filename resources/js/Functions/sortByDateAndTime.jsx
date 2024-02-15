import moment from "moment";

export function sortByDateAndTimeObject(array) {
    if (array.length <= 1) return array;


    let sortArray = [...array];
    sortArray.sort((a, b) => {
        let aMoment = moment(a.date + " " + a.time)
        let bMoment = moment(b.date + " " + b.time)
        return bMoment.diff(aMoment)
    })

    return sortArray;
}
