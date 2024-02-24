import { readFile, writeFile, unlink } from "fs";
import { v4 as uuidv4 } from "uuid";
import path from 'path';
const Event = require("../models/event");

const titleLimit = 50;
const locationLimit = 50;
const descriptionLimit = 500;

export const getEvents = (req, res) => {
    const event = new Event();
    const result = {
        status: 0,
        error: ""
    }

    const events = event.getEvents();

    if (!events) {
        result.error = event.getError();
        res.status(500).json(result);
        return;
    }

    result.status = 1;
    result.data = events;

    res.json(result);
}

export const getEvent = (req, res) => {
    const event = new Event();
    const result = {
        status: 0,
        error: ""
    }

    const uuid = req.params.uuid;

    const eventFound = event.getEventByUuid(uuid);

    if (!eventFound) {
        result.error = event.getError();
        res.status(404).json(result);
        return;
    }

    result.status = 1;
    result.data = eventFound;
    res.json(result);
}

export const searchEvents = (req, res) => {
    const event = new Event();
    const result = {
        status: 0,
        error: ""
    }

    const input = req.params.input.toLowerCase();

    const eventsFound = event.searchEvent(input);

    if (!eventsFound) {
        result.error = event.getError();
        res.status(404).json(result);
        return;
    }

    result.status = 1;
    result.data = eventsFound;
    res.json(result);
}

// Función para validar el formato de fecha
const isValidDateFormat = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getDay());
}

export const setEvent = (req, res) => {
    const event = new Event();
    const result = {
        status: 0,
        error: ""
    }

    let fileNames = "";

    let { title, location, description, start, timeStart, end, timeEnd, type, eventUrl } = req.body;
    
    try {
        fileNames = req.files;
    } catch (err) {
        result.error = "Error receiving images";
        res.status(500).json(result);
        return;
    }

    let imgArray = fileNames.map((file) => {
        return file.filename;
    });

    const uuid = uuidv4();

    if (end === "") end = start;

    if (!event.setUuid(uuid)) {
        result.error = event.getError();
        res.status(500).json(result);
        return;
    }

    if (!event.setTitle(title)) {
        result.error = event.getError();
        res.status(400).json(result);
        return;
    }

    if (!event.setDescription(description) && description !== "") {
        result.error = event.getError();
        res.status(400).json(result);
        return;
    }

    if (!event.setLocation(location)) {
        result.error = event.getError();
        res.status(400).json(result);
        return;
    }

    if (!event.setStart(start)) {
        result.error = event.getError();
        res.status(400).json(result);
        return;
    }

    if (!event.setTimeStart(timeStart)) {
        result.error = event.getError();
        res.status(400).json(result);
        return;
    }

    if (!event.setEnd(end)) {
        result.error = event.getError();
        res.status(400).json(result);
        return;
    }

    if (!event.setTimeEnd(timeEnd)) {
        result.error = event.getError();
        res.status(400).json(result);
        return;
    }

    if (!event.setType(type)) {
        result.error = event.getError();
        res.status(400).json(result);
        return;
    }

    if (!event.setUrl(eventUrl)) {
        result.error = event.getError();
        res.status(400).json(result);
        return;
    }

    if (!event.setFiles(imgArray)) {
        result.error = event.getError();
        res.status(400).json(result);
        return;
    }

    if (!event.createEvent()) {
        result.error = event.getError();
        res.status(500).json(result);
        return;
    }

    result.status = 1;
    result.data = uuid;
    res.json(result);
}


export const editEvent = (req, res) => {
    const result = {
        status: 0,
        error: ""
    }

    let fileNames = "";

    const { title, location, description, start, timeStart, end, timeEnd, type, eventUrl, deleteIndicator } = req.body;
    
    try {
        fileNames = req.files;
    } catch (err) {
        result.error = "Error receiving files";
        res.status(500).json(result);
        return;
    }

    let imgArray = fileNames.map((file) => {
        return file.filename;
    })

    const uuid = req.params.uuid;

    readFile("./src/json/events.json", "utf-8", (err, jsonString) => {
        if (err) {
            result.error = "Error reading file";
            res.status(500).json(result);
            return;
        }

        const data = JSON.parse(jsonString);

        const foundIndex = data.findIndex((event) => event.uuid === uuid);

        if (foundIndex === -1) {
            result.error = "Event not found";
            res.status(404).json(result);
            return;
        }

        if ( !title ) {
            result.error = "Title is missing";
            res.status(400).json(result);
            return;
        }

        if ( title.length > titleLimit ) {
            result.error = "Title can't be more than 20 characters long";
            res.status(400).json(result);
            return;
        }

        if ( !location ) {
            result.error = "Location is missing";
            res.status(400).json(result);
            return;
        }

        if ( location.length > locationLimit ) {
            result.error = "Location can't be more than 20 characters long";
            res.status(400).json(result);
            return;
        }

        if ( description.length > descriptionLimit ) {
            result.error = "Description can't be more than 500 characters long";
            res.status(400).json(result);
            return;
        }

        if ( !start ) {
            result.error = "Starting Date is missing";
            res.status(400).json(result);
            return;
        }

        if ( !isValidDateFormat(start) || !isValidDateFormat(end) ) {
            result.error = "Dates formats are not valid";
            res.status(400).json(result);
            return;
        }

        if ( !timeStart ) {
            result.error = "Starting Time is missing";
            res.status(400).json(result);
            return;
        }

        if ( !end ) {
            result.error = "Ending Date is missing";
            res.status(400).json(result);
            return;
        }

        if ( !timeEnd ) {
            result.error = "Ending Time is missing";
            res.status(400).json(result);
            return;
        }

        if ( type !== "class" && type !== "meetup" && type !== "organization" ) {
            result.error = "The type of the event is not valid (class, meetup or organization)";
            res.status(400).json(result);
            return;
        }

        if ( !type ) {
            result.error = "Type is missing";
            res.status(400).json(result);
            return;
        }
        
        let svImgArr = data[foundIndex].files;

        if (deleteIndicator !== undefined) {
            if ((imgArray.length - deleteIndicator.length) + data[foundIndex].files.length > 10) {
                result.error = "Files cap for each event is settled to 10";
                res.status(500).json(result);
                return;
            }
            
            if ( deleteIndicator.length > 1 ) {
                deleteIndicator.map((indicator, index) => {
                    const imgPath = path.join('./src/img/events', svImgArr[indicator]);

                    svImgArr.splice(indicator, 1);
                    unlink(imgPath, (err) => {
                        if (err) {
                            result.error = "Error deleting image file";
                            res.status(500).json(result);
                            return;
                        }
                    });
                });
            }

            if (deleteIndicator.length === 1) {
                const imgPath = path.join('./src/img/events', svImgArr[deleteIndicator]);

                    svImgArr.splice(deleteIndicator, 1);
                    unlink(imgPath, (err) => {
                        if (err) {
                            result.error = "Error deleting image file";
                            res.status(500).json(result);
                            return;
                        }
                    });
            }
        }

        if ( imgArray.length == 0 ) {
            imgArray = svImgArr;
        } else {
            imgArray = svImgArr.concat(imgArray);
        }

        const date1 = new Date(start);
        const date2 = new Date(end);

        if (date1 > date2) {
            result.error = "Starting date can't be more than the ending date of the event";
            res.status(500).json(result);
            return;
        }

        const updatedEvent = {
            ...data[foundIndex],
            title: title,
            description: description,
            location: location,
            start: start,
            timeStart: timeStart,
            end: end,
            timeEnd: timeEnd,
            type: type,
            eventUrl: eventUrl,
            files: imgArray
        }

        const updatedData = [...data];

        updatedData[foundIndex] = updatedEvent;

        const updatedJsonString = JSON.stringify(updatedData, null, 2);

        writeFile("./src/json/events.json", updatedJsonString, err => {
            if (err) {
                result.error = "Error writing to the events file";
                res.status(500).json(result);
                return;
            }

            result.status = 1;
            result.data = updatedEvent;

            res.json(result);
        })
    });
}

export const deleteEvent = (req, res) => {
    const result = {
        status: 0,
        error: ""
    }

    const uuid = req.params.uuid;

    readFile("./src/json/events.json", (err, jsonString) => {
        if (err) {
            result.error = "Error reading file";
            res.status(500).json(result);
            return;
        }

        const data = JSON.parse(jsonString);

        const foundEvent = data.find((event) => event.uuid === uuid);

        if (!foundEvent) {
            result.error = "Event not found";
            res.status(404).json(result);
            return;
        }

        foundEvent.files.map((file) => {
            const imgPath = path.join('./src/img/events', file);

            unlink(imgPath, (err) => {
                if (err) {
                    result.error = "Error deleting image file";
                    res.status(500).json(result);
                    return;
                }
            })
        })

        const foundIndex = data.indexOf(foundEvent);
        
        data.splice(foundIndex, 1);

        const updatedJsonString = JSON.stringify(data, null, 2);

        writeFile("./src/json/events.json", updatedJsonString, (err) => {
            if (err) {
                result.error = "Error writing to the events file";
                res.status(500).json(result);
                return;
            }

            result.status = 1;
            res.json(result);
        });

        
    });
}