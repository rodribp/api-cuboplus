const path = require("path");
const Validator = require("../helpers/validator");
const fs = require("fs");
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

        if (!description) {
            this.description = "";
            return true;
        } 

        if (super.validateString(description, 500)) {
            this.description = description;
            return true;
        }

        return false;
    }

    //method to validate and set location
    setLocation(location) {
        if (super.validateString(location, 50)) {
            this.location = location;
            return true;
        }

        return false;
    }

    //method to validate and set start
    setStart(start) {
        if (!super.validateDate(start)) {
            return false;
        }

        //we validate if this.end === null we just change this.start to param given
        if (this.end === null) {
            this.start = start;
            return true;
        }

        //if this.end !== null we validate this.end is more than start given
        const dateStart = new Date(start);
        const dateEnd = new Date(this.end);

        if (dateStart > dateEnd) {
            super.error = "Starting date can't be more than ending date";
            return false;
        }

        this.start = start;
        return true;
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
        if (!super.validateDate(end)) {
            return false;
        }

        //we validate if this.start === null we just change this.start to param given
        if (this.start === null) {
            this.end = end;
            return true;
        }

        //if this.start !== null we validate this.end is more than start given
        const dateStart = new Date(this.start);
        const dateEnd = new Date(end);

        if (dateStart > dateEnd) {
            super.error = "Ending date can't be less than starting date";
            return false;
        }

        this.end = end;
        return true;
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
        if (!url) {
            this.url = "";
            return true;
        }

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

    //method to get all events
    getEvents() {
        try {
            const jsonString = fs.readFileSync("./src/json/events.json", "utf-8");
            return JSON.parse(jsonString);
        } catch (err) {
            super.error = "Error reading file";
            return false;
        }
    }

    //method to get an event by uuid
    getEventByUuid(uuid) {
        try {
            //we read events.json file, convert it into js object and find if there's any event whose uuid matches param uuid
            const jsonString = fs.readFileSync("./src/json/events.json", "utf-8");
            const data = JSON.parse(jsonString);
            const foundEvent = data.find(event => event.uuid == uuid);

            if (!foundEvent) {
                super.error = "Event not found";
                return false;
            }

            return foundEvent;
        } catch (err) {
            super.error = "Error reading file";
            return false;
        }
    }

    //method to search events by title, location or type coincidences
    searchEvent(input) {
        try {
            const jsonString = fs.readFileSync("./src/json/events.json", "utf-8");
            const data = JSON.parse(jsonString);

            //we filter data from events obj where title, location or type includes input. We lower case everything to avoid uppercase letter bad filtering
            const foundEvents = data.filter(event => {
                const titleMatch = event.title.toLowerCase().includes(input);
                const locationMatch = event.location.toLowerCase().includes(input);
                const typeMatch = event.type.toLowerCase().includes(input);
    
                return titleMatch || locationMatch || typeMatch;
            });

            if (foundEvents.length == 0) {
                super.error = "Events not found";
                return false;
            }

            return foundEvents;
        } catch (err) {
            super.error = "Error reading file";
            return false;
        }
    }

    //method to create an event and write it on file
    createEvent() {
        try {
            //first we get the current events from the file
            const jsonString = fs.readFileSync("./src/json/events.json", "utf-8");
            const data = JSON.parse(jsonString);

            const event = {
                uuid: this.uuid,
                title: this.title,
                description: this.description,
                location: this.location,
                start: this.start,
                timeStart: this.timeStart,
                end: this.end,
                timeEnd: this.timeEnd,
                type: this.type,
                eventUrl: this.url,
                files: this.files
            }

            data.push(event);

            const updatedJsonString = JSON.stringify(data, null, 2);

            try {
                fs.writeFileSync("./src/json/events.json", updatedJsonString);
                return true;
            } catch (err) {
                super.error = "Error writing on file";
                return false;
            }
        } catch (err) {
            super.error = "Error reading file";
            return false;
        }
    }

    //method to edit an event and rewrite the event on the file
    editEvent(deleteIndicator, filesToUpload) {
        try {
            const jsonString = fs.readFileSync("./src/json/events.json", "utf-8");
            const data = JSON.parse(jsonString);
            const index = data.findIndex((event) => event.uuid === this.uuid);

            if (index === -1) {
                super.error = "Event not found";
                return false;
            }

            const event = data[index];
            const svImgArr = event.files;

            if (deleteIndicator !== undefined) {
                if ((svImgArr.length - deleteIndicator.length) + filesToUpload.length > 10) {
                    super.error = "Files cap to upload per event is 10";
                    return false;
                }

                if (typeof deleteIndicator !== "object") {
                    deleteIndicator = [deleteIndicator];
                }

                if (deleteIndicator.length > 0) {
                    //We sort the array from more to less to avoid the svImgArr to change positions on the img files
                    deleteIndicator.sort((a, b) => { return b - a });

                    deleteIndicator.map((indicator) => {
                        const imgPath = path.join("./src/img/events", svImgArr[indicator]);
                        svImgArr.splice(indicator, 1);
                        try {
                            fs.unlinkSync(imgPath);
                        } catch (err) {
                            super.error = "Error deleting image";
                            console.log(err);
                            return false;
                        }
                    });
                }
            }

            

            if (filesToUpload.length === 0) {
                filesToUpload = svImgArr;
            } else {
                filesToUpload = svImgArr.concat(filesToUpload);
            }
            
            const updatedEvent = {
                uuid: this.uuid,
                title: this.title,
                description: this.description,
                location: this.location,
                start: this.start,
                timeStart: this.timeStart,
                end: this.end,
                timeEnd: this.timeEnd,
                type: this.type,
                eventUrl: this.url,
                files: filesToUpload
            }
            
            data[index] = updatedEvent;

            const uptadedString = JSON.stringify(data, null, 2);

            try {
                fs.writeFileSync("./src/json/events.json", uptadedString);
                return true;
            } catch (err) {
                super.error = "Error writing on file";
                return false;
            }
        } catch (err) {
            super.error = "Error reading file";
            console.log(err);
            return false;
        }
    }

    //method to delete an event by uuid
    deleteEventByUuid(uuid) {
        try {
            const jsonString = fs.readFileSync("./src/json/events.json", "utf-8");
            const data = JSON.parse(jsonString);

            const event = data.find((event) => event.uuid === uuid);

            if (!event) {
                super.error = "Event not found";
                return false;
            }

            event.files.map((file) => {
                const imgPath = path.join("./src/img/events", file);

                try {
                    fs.unlinkSync(imgPath);
                } catch (err) {
                    super.error = "Error removing file";
                    return false;
                }
            })

            const index = data.indexOf(event);
            data.splice(index, 1);

            const updatedString = JSON.stringify(data, null, 2);

            fs.writeFileSync("./src/json/events.json", updatedString);

            return true;
        } catch (err) {
            super.error = "Error reading file";
            return false;
        }
    }
}

module.exports = Event;