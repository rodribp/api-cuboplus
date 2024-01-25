import express, { urlencoded } from 'express';
import config from './config';
import morgan from 'morgan';
import cors from 'cors';
import pkg from '../package.json';
import eventsRoutes from './routes/events.routes';
import authRoutes from './routes/auth.routes';

const app = express();
app.set("pkg", pkg);
app.use(express.json());
app.use(morgan("dev"));
app.use(urlencoded({extended: false}));
app.use(cors());
app.get("/", (req, res) => {
    res.json({
        name: app.get("pkg").name,
        version: app.get("pkg").version,
        description: app.get("pkg").description
    })
});
app.use("/auth", authRoutes);
app.use("/events", eventsRoutes);

app.set("port", config.port);

export default app;