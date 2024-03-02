export function sortByColorShortcut(a, b) {


    if (isNumber(a.shortcut) && isNumber(b.shortcut)) {
        return (Number(a.shortcut) > Number(b.shortcut)) ? 1 : ((Number(b.shortcut) > Number(a.shortcut)) ? -1 : 0)
    }

    if (a.shortcut === 'M' || a.shortcut === 'm') return 1;
    if (b.shortcut === 'M' || b.shortcut === 'm') return -1;

    return (a.shortcut > b.shortcut) ? 1 : ((b.shortcut > a.shortcut) ? -1 : 0)
}

function isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}
