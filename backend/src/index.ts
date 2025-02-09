// Main entry point - Initializes and starts the express server
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import someRoute from './routes/someRoute';
import basenameRoute from './routes/getBasename';
import chatRoute from './routes/chatRoute';
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json())

// Middleware to parse JSON
app.use(express.json());

// Enable CORS for all origins
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Route handling
app.use('/api', someRoute);
app.use('/api', basenameRoute);
app.use('/api', chatRoute);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});