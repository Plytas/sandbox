import {config} from "./config.js";

export default class Camera {
    move() {
        if (keyIsDown(LEFT_ARROW) || keyIsDown(config.keyCodes.a)) {
            this.performMove(new p5.Vector(-config.scrollStep, 0));
        }

        if (keyIsDown(RIGHT_ARROW) || keyIsDown(config.keyCodes.d)) {
            this.performMove(new p5.Vector(config.scrollStep, 0));
        }

        if (keyIsDown(UP_ARROW) || keyIsDown(config.keyCodes.w)) {
            this.performMove(new p5.Vector(0, -config.scrollStep));
        }

        if (keyIsDown(DOWN_ARROW) || keyIsDown(config.keyCodes.s)) {
            this.performMove(new p5.Vector(0, config.scrollStep));
        }

        translate(-config.origin.x, -config.origin.y);
        scale(config.zoom.scale);
    }

    /**
     * @param {p5.Vector} position
     */
    performMove(position) {
        config.origin.x += position.x;
        config.origin.y += position.y;

        this.constrainOrigin();
    }

    performZoom(point, out = false) {
        let step = out ? -config.zoom.step : +config.zoom.step;
        let newScale = max(config.zoom.min, min(config.zoom.max, config.zoom.scale + step));

        if (newScale === config.zoom.scale) {
            return;
        }

        config.origin.x = (point.x + config.origin.x) * (newScale / config.zoom.scale) - point.x;
        config.origin.y = (point.y + config.origin.y) * (newScale / config.zoom.scale) - point.y;

        config.zoom.scale = newScale;

        this.constrainOrigin();
    }

    constrainOrigin() {
        if (config.origin.x < this.minX()) {
            config.origin.x = this.minX();
        }

        if (config.origin.x > this.maxX()) {
            config.origin.x = this.maxX();
        }

        if (config.origin.y < this.minY()) {
            config.origin.y = this.minY();
        }

        if (config.origin.y > this.maxY()) {
            config.origin.y = this.maxY();
        }
    }

    minX() {
        return (config.gridSize * config.zoom.scale) / 2 - config.canvasSize.x / 2;
    }

    minY() {
        return (config.gridSize * config.zoom.scale) / 2 - config.canvasSize.y / 2;
    }

    maxX() {
        return config.mapSize.x * config.zoom.scale - (config.gridSize * config.zoom.scale) / 2 - config.canvasSize.x / 2;
    }

    maxY() {
        return config.mapSize.y * config.zoom.scale - (config.gridSize * config.zoom.scale) / 2 - config.canvasSize.y / 2;
    }
}
