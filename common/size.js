export default class Size {
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {Size}
     */
    relativeSize(x, y) {
        return new Size(this.x + x, this.y + y);
    }
}
