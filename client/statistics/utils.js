/**
 * Return icon position according to the amount of other icons displayed next to him
 * @param position
 * @param fontSize
 * @param totalNumber
 * @param currentNumber
 * @returns {*}
 */
export const getIconPosition = (position, fontSize, totalNumber, currentNumber) => {
    fontSize *= 1.5

    if (totalNumber === 2) {
        if (currentNumber === 1) {
            position.x -= fontSize / 2
        } else {
            position.x += fontSize / 2
        }
    }

    if (totalNumber === 3) {
        if (currentNumber === 1) {
            position.x -= fontSize / 2
        } else if (currentNumber === 2) {
            position.x += fontSize / 2
        } else {
            position.y -= fontSize - (fontSize / 6)
        }
    }

    if (totalNumber === 4) {
        if (currentNumber === 1) {
            position.x -= fontSize / 2
        } else if (currentNumber === 2) {
            position.x += fontSize / 2
        } else if (currentNumber === 3) {
            position.x -= fontSize / 2
            position.y -= fontSize
        } else {
            position.x += fontSize / 2
            position.y -= fontSize
        }
    }

    if (totalNumber > 4 && currentNumber === 1) {
        console.error(`Trying to display a chart with too many icons (${currentNumber}) on the same date`)
    }

    return position
}
