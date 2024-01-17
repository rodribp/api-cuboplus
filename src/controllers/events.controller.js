import { readFile, writeFile } from "fs";
import { v4 as uuidv4 } from "uuid";

export const getEvents = (req, res) => {
    const result = {
        status: 0,
        error: ""
    }

    readFile("./src/json/events.json", "utf-8", (err, jsonString) => {
        if (err) {
            result.error = err;
            res.status(400).json(result);
            return;
        }
        result.status = 1;
        result.data = JSON.parse(jsonString);

        res.json(result);
    });
}

export const getEvent = (req, res) => {
    const result = {
        status: 0,
        error: ""
    }

    const uuid = req.params.uuid;

    readFile("./src/json/events.json", "utf-8", (err, jsonString) => {
        if (err) {
            result.error = err;
            res.status(400).json(result);
            return;
        }

        const data = JSON.parse(jsonString);

        const foundEvent = data.find(event => event.uuid == uuid);

        console.log(foundEvent);

        if (!foundEvent) {
            result.error = "Evento no encontrado";
            res.status(404).json(result);
            
        } else {
            result.status = 1;
            result.data = foundEvent;

            res.json(result);
        }
    })
}

export const setEvent = (req, res) => {
    const result = {
        status: 0,
        error: ""
    }

    const { title, location, start, timeStart, end, timeEnd, type, eventUrl } = req.body;
    const uuid = uuidv4();


    readFile("./src/json/events.json", "utf-8", (err, jsonString) => {
        if (err) {
            throw err;
        }

        const data = JSON.parse(jsonString);

        const newEvent = {
            uuid: uuid,
            title: title,
            location: location,
            start: start,
            timeStart: timeStart,
            end: end,
            timeEnd: timeEnd,
            type: type,
            eventUrl: eventUrl
        }

        data.push(newEvent);

        const updatedJsonString = JSON.stringify(data, null, 2);

        writeFile("./src/json/events.json", updatedJsonString, err => {
            if (err) {
                result.error = err;
                res.status(400).json(result);
                return;
            }

            result.data = newEvent;

            res.json(result)
        })
    });
}