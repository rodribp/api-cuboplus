import Validator from '../helpers/validator.js';

class Event extends Validator {
    constructor() {
        this.uuid = null;
        this.title = null;
        this.description = null;
        this.location = null;
        this.start = null;
        this.timeStart = null;
        this.end = null;
        this.timeEnd = null;
        this.type = null;
        this.url = null;
        this.files = null;
    }
}