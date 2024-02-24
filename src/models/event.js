const Validator = require("../helpers/validator");
const typeList = ["class", "meetup", "event", "organization"];

class Event extends Validator {
    constructor() {
        super();
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

    //method to validate and set uuid
    setUuid(uuid) {
        if (super.validateUuid(uuid)) {
            this.uuid = uuid;
            return true;
        }

        return false;
    }

    //method to validate and set title
    setTitle(title) {
        if (super.validateString(title, 50)) {
            this.title = title;
            return true;
        }

        return false;
    }

    //method to validate and set description
    setDescription(description) {
        if (super.validateString(description, 500)) {
            this.description = description;
            return true;
        }

        return false;
    }

    //method to validate and set location
    setlocation(location) {
        if (super.validateString(location, 50)) {
            this.location = location;
            return true;
        }

        return false;
    }

    //method to validate and set start
    setStart(start) {
        if (super.validateDate(start)) {
            this.start = start;
            return true;
        }

        return false;
    }

    //method to validate and set time start
    setTimeStart(timeStart) {
        if (super.validateTime(timeStart)) {
            this.timeStart = timeStart;
            return true;
        }

        return false;
    }

    //method to validate and set end
    setEnd(end) {
        if (super.validateDate(end)) {
            this.end = end;
            return true;
        }

        return false;
    }

    //method to validate and set time end
    setTimeEnd(timeEnd) {
        if (super.validateTime(timeEnd)) {
            this.timeEnd = timeEnd;
            return true;
        }

        return false;
    }

    //method to validate and set type of event
    setType(type) {
        if (super.validateListValue(typeList, type)) {
            this.type = type;
            return true;
        }

        return false;
    }

    //method to validate and set url
    setUrl(url) {
        if (super.validateUrl(url)) {
            this.url = url;
            return true;
        }

        return false;
    }

    //method to set files
    setFiles(files) {
        if (super.validateArray(files)) {
            this.files = files;
            return true;
        }

        return false;
    }
    
    //get method for uuid
    getUuid() {
        return this.uuid;
    }

    //get method for title
    getTitle() {
        return this.title;
    }

    //get method for description
    getDescription() {
        return this.description;
    }

    //get method for location
    getLocation() {
        return this.location;
    }

    //get method for start
    getStart() {
        return this.start;
    }

    //get method for time start
    getTimeStart() {
        return this.timeStart;
    }

    //get method for end
    getEnd() {
        return this.end;
    }

    //get method for time end
    getTimeEnd() {
        return this.timeEnd;
    }

    //get method for type
    getType() {
        return this.type;
    }

    //get method for url
    getUrl() {
        return this.url;
    }

    //get method for files
    getFiles() {
        return this.files;
    }
}

module.exports = Event;