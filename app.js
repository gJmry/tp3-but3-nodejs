
import express from 'express'

import { tourRouter } from './routes/tour.routes.js'
import { userRouter } from './routes/user.routes.js'
import { Tour } from './models/tour.model.js'
//process.env.LOCAL_DATABASE

const app = express()


// 1) MIDDLEWARES 

app.use(express.json())
app.use(express.static(`${process.cwd()}/public`))

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});



// 3) ROUTES 

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter)


export { app }
