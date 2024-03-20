import express from 'express'
// import cabsRoutes from './routes/cabsRoutes.js'
import bookingsRoutes from './routes/bookingsRoute.js'
import cabRoutes from './routes/cabsRoute.js'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const port = process.env.PORT;


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const connectToDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("Database Connected");

    }
    catch(error){
        console.error(`Error: ${error.message}`);
        process.exit(1);

    }
}

connectToDB();
app.get('/', (req, res) => {
    res.send('API is running')
})


app.use('/api/bookings',bookingsRoutes);
app.use('/api/cabs',cabRoutes);



app.listen(port, () => {
    console.log(`Server is running at ${port}`)
})