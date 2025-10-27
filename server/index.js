import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/AuthRoutes.js';
import contactRoutes from './routes/ContactRoutes.js';
import messageRoutes from './routes/MessagesRoutes.js';
import channelRoutes from './routes/ChannelRoutes.js';
import path from "path";
import setupSocket from './socket.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

app.use(cors( {
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE" ],
    credentials: true,
}));

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/channel", channelRoutes);

const server = app.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`);
});

setupSocket(server);

mongoose.connect(databaseURL,
     {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
      .then(() => {
       console.log("Mongo DB Connected");
      });