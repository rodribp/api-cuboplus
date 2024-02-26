import { v4 as uuidv4 } from "uuid";
const Event = require("../models/event");

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

    if (!event.setDescription(description)) {
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
    const event = new Event();
    const result = {
        status: 0,
        error: ""
    }

    let fileNames = "";

    let { title, location, description, start, timeStart, end, timeEnd, type, eventUrl, deleteIndicator } = req.body;

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

    if (!event.setDescription(description)) {
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

    if (!event.editEvent(deleteIndicator, imgArray)) {
        result.error = event.getError();
        res.status(500).json(result);
        return;
    }

    result.status = 1;
    result.data = uuid;
    res.json(result);
}

export const deleteEvent = (req, res) => {
    const event = new Event();
    const result = {
        status: 0,
        error: ""
    }

    const uuid = req.params.uuid;

    if (!event.deleteEventByUuid(uuid)) {
        result.error = event.getError();
        res.status(500).json(result);
        return;
    }

    result.status = 1;
    res.json(result);
}