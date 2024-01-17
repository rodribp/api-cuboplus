import express from 'express';
import config from './config';
import morgan from 'morgan';
import pkg from '../package.json';
import eventsRoutes from './routes/events.routes';

const app = express();
app.set("pkg", pkg);
app.use(express.json());
app.use(morgan("dev"));
app.get("/", (req, res) => {
    res.json({
        name: app.get("pkg").name,
        version: app.get("pkg").version,
        description: app.get("pkg").description
    })
});

app.use("/events", eventsRoutes);

app.set("port", config.port);

export default app;