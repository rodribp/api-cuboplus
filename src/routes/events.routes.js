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
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
})

const upload = multer ({ storage: storage, });

const router = Router();

router.get("/", eventsController.getEvents);
router.get("/:uuid", eventsController.getEvent);
router.post("/", verifyToken, upload.single('image'), eventsController.setEvent);

export default router;