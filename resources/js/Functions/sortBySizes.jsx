const ORDER = ["one size", "xs", "s", "m", "l", "xl", "2xl", "3xl", "4xl",
    "5xl", "6xl", "7xl", "8xl", "9xl", "10xl", "1", "2", "3"];

export function sortBySizes(array) {


    array.sort((a, b) => {
        a = a.toLowerCase();
        b = b.toLowerCase();

        let nra = parseInt(a);
        let nrb = parseInt(b);

        if ((ORDER.indexOf(a) != -1)) nra = NaN;
        if ((ORDER.indexOf(b) != -1)) nrb = NaN;

        if (nrb === 0) return 1;
        if (nra && !nrb || nra === 0) return -1;
        if (!nra && nrb) return 1;
        if (nra && nrb) {
            if (nra == nrb) {
                return (a.substring(("" + nra).length)).localeCompare((a.substring(("" + nra).length)));
            } else {
                return nra - nrb;
            }
        } else {
            return ORDER.indexOf(a) - ORDER.indexOf(b);
        }
    });

    return array;
}

export function sortBySizesName(array) {

    let sortArray = [...array];

    sortArray.sort((a, b) => {
        a = a.name.toLowerCase();
        b = b.name.toLowerCase();
        // console.log(a, b)
        let nra = parseInt(a);
        let nrb = parseInt(b);
        // console.log(nra, nrb)

        if ((ORDER.indexOf(a) != -1)) nra = NaN;
        if ((ORDER.indexOf(b) != -1)) nrb = NaN;

        if (nrb === 0) return 1;
        if (nra && !nrb || nra === 0) return -1;
        if (!nra && nrb) return 1;
        if (nra && nrb) {
            if (nra == nrb) {
                return (a.substring(("" + nra).length)).localeCompare((a.substring(("" + nra).length)));
            } else {
                return nra - nrb;
            }
        } else {
            return ORDER.indexOf(a) - ORDER.indexOf(b);
        }
    });

    return sortArray;
}


export function sortBySizesModelColorObject(array) {

    let sortArray = [...array];

    sortArray.sort((a, b) => {
        a = a.size.name.toLowerCase();
        b = b.size.name.toLowerCase();
        // console.log(a, b)
        let nra = parseInt(a);
        let nrb = parseInt(b);
        // console.log(nra, nrb)

        if ((ORDER.indexOf(a) != -1)) nra = NaN;
        if ((ORDER.indexOf(b) != -1)) nrb = NaN;

        if (nrb === 0) return 1;
        if (nra && !nrb || nra === 0) return -1;
        if (!nra && nrb) return 1;
        if (nra && nrb) {
            if (nra == nrb) {
                return (a.substring(("" + nra).length)).localeCompare((a.substring(("" + nra).length)));
            } else {
                return nra - nrb;
            }
        } else {
            return ORDER.indexOf(a) - ORDER.indexOf(b);
        }
    });

    return sortArray;
}
