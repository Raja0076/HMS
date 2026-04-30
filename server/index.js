import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { registerRoutes } from './routes/index.js';

dotenv.config();
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required in .env');
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

registerRoutes(app);
const CONNECTION_URL = "mongodb+srv://Raja:Raji2002@ecommerce.fhki0.mongodb.net/";
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL)
        .then(() => app.listen(PORT, () => console.log(`Server is listening on the port : ${PORT}`)))
        .catch((Error) => console.log(Error.message));

