import {dump} from "./debug.js";

export default class Serializer {
    /**
     * @param {Object|Array} object
     * @returns {Object|Array}
     */
    serialize(object) {
        if (!object) {
            return object;
        }

        if (Array.isArray(object)) {
            return this.serializeArray(object);
        }

        if (typeof object === 'object') {
            return this.serializeObject(object);
        }

        return object;
    }

    /**
     * @param {Array} array
     * @returns {Array}
     */
    serializeArray(array) {
        let serialized = [];

        for (let i = 0; i < array.length; i++) {
            if (!array[i]) {
                continue;
            }

            serialized[i] = this.serialize(array[i]);
        }

        return serialized;
    }

    /**
     * @param {Object} object
     * @returns {Object}
     */
    serializeObject(object) {
        let serialized = {
            class: object.constructor.name
        };

        for (const property in object) {
            serialized[property] = this.serialize(object[property]);
        }

        return serialized;
    }

    /**
     * @param {Object} serialized
     * @param {Object} classMap
     * @returns {Object}
     */
    unserialize(serialized, classMap) {
        if (!serialized) {
            return serialized;
        }

        if (Array.isArray(serialized)) {
            return this.unserializeArray(serialized, classMap);
        }

        if (typeof serialized === 'object') {
            return this.unserializeObject(serialized, classMap);
        }

        return serialized;
    }

    /**
     * @param {Array} serialized
     * @param {Object} classMap
     * @returns {Array}
     */
    unserializeArray(serialized, classMap) {
        let array = [];

        for (let i = 0; i < serialized.length; i++) {
            if (serialized[i] === null) {
                continue;
            }

            array[i] = this.unserialize(serialized[i], classMap);
        }

        return array;
    }

    /**
     * @param {Object} serialized
     * @param {String} serialized.class
     * @param {Object} classMap
     * @returns {Object}
     */
    unserializeObject(serialized, classMap) {
        let properties = {};

        for (const property in serialized) {
            if (property === 'class') {
                continue;
            }

            properties[property] = this.unserialize(serialized[property], classMap);
        }

        if (!classMap[serialized.class]) {
            dump('Class not found: ' + serialized.class);
        }

        let target = classMap[serialized.class]();

        Object.assign(target, properties);

        return target;
    }
}
