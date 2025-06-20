import mongoose from 'mongoose';
import { app } from './app.js'

const connectString ="YOURCLUSTERURLHERE"

async function connectDB() {
    await mongoose.connect(connectString)
    console.log("Connexion à MongoDB réussie")
}
connectDB().catch((err) => {
    console.log("Connexion à MongoDB a échoué", err)
})



const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`App running on port ${port}`)
})
