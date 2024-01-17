import { Router } from "express";
import * as eventsController from "../controllers/events.controller";

const router = Router();

router.get("/", eventsController.getEvents);
router.get("/:uuid", eventsController.getEvent);
router.post("/", eventsController.setEvent);

export default router;