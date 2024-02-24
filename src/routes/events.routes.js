import { Router } from "express";
import * as eventsController from "../controllers/events.controller";
import { verifyToken } from "../middlewares/authJwt";
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/img/events/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, "image" + '-' + uniqueSuffix + ".webp");
    }
})


const upload = multer ({ storage: storage, });

const router = Router();

router.get("/", eventsController.getEvents);
router.get("/:uuid", eventsController.getEvent);
router.get("/search/:input", eventsController.searchEvents);
router.post("/", verifyToken, upload.array('image', 10), eventsController.setEvent);
router.put("/:uuid", verifyToken, upload.array('image', 10), eventsController.editEvent);
router.delete("/:uuid", verifyToken, eventsController.deleteEvent);

export default router;