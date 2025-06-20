import mongoose from 'mongoose';


const tourSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'A tour must have a name'], unique: true, trim: true },
    duration: { type: Number, required: [true, 'A tour must have a duration'] },
    maxGroupSize: { type: Number, required: [true, 'A tour must have a maxGroup size'] },
    difficulty: { type: String, required: [true, 'A tour must have a maxGroup size'] },
    ratingsAverage: { type: Number, default: 4.5 },
    ratingsAverage: { type: Number, default: 0 },
    price: { type: Number, required: [true, 'A tour must have a price'] },
    priceDiscount: Number,
    summary: { type: String, trim: true, required: [true, 'A tour must have a description'] },
    description: { type: String, trim: true },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a ']
    },
    images: [String],
    createAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date]
})

/* const clientSchema = new mongoose.Schema({
    nom: String,
    prenom: String,
    adresse: String
})

const Client = mongoose.model("Client", clientSchema)

//const newClient = await Client.create({ nom: "Barack", prenom: "Obama", adresse: "Washington" })

const newClient = new Client({ nom: "Barack", prenom: "Obama", adresse: "Washington" })

newClient.save()

Client.find((err, clients) => {
    if (err) return console.error(err);
    console.log(clients)
}) */


const Tour = mongoose.model('Tour', tourSchema)

export { Tour }