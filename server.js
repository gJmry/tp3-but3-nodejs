import mongoose from 'mongoose';
import { app } from './app.js'

const connectString ="mongodb+srv://titouanandre38:mCJkui9xgDVgIA5F@clusternode.scblgod.mongodb.net/natours?retryWrites=true&w=majority&appName=ClusterNode"

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
