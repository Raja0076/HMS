import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

app.use(bodyParser.json({limit:"30mb", extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb", extended:true}));
app.use(cors());


const CONNECTION_URL = "mongodb+srv://Raja:Raji2002@ecommerce.fhki0.mongodb.net/";
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL)
        .then(() => app.listen(PORT, () => console.log(`Server is listening on the port : ${PORT}`)))
        .catch((Error) => console.log(Error.message));

