// Import the mongoose module
//const mongoose = require("mongoose");
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs'
import path from 'path'
import { Tour } from './../../models/tour.model.js'

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();



const connectString ="mongodb+srv://titouanandre38:mCJkui9xgDVgIA5F@clusternode.scblgod.mongodb.net/natours?retryWrites=true&w=majority&appName=ClusterNode"
async function connectDB() {
    await mongoose.connect(connectString)
}
connectDB().catch((err) => {
    console.log("Connexion à MongoDB a échoué", err)
})


const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`))
console.log(tours)
const importData = async () => {
    try {
        await Tour.create(tours)
        console.log('Data successfully loaded')
        process.exit()
    }
    catch (err) {
        console.log(err)
    }
}

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data successfully deleted')
        process.exit()
    }
    catch (err) {
        console.log(err)
    }
}

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
