require("dotenv").config()
// imports
const Express = require('express')
const app = Express()
const dbConnection = require('./db')
const middleware = require('./middlewares');

// Middleware
app.use(middleware.CORS);
app.use(Express.json())

// Controller Endpoints
const controllers = require('./controllers')
app.use('/user', controllers.userController)
app.use('/bug', controllers.bugController)
app.use('/reply', controllers.replyController)
app.use(middleware.validateSession)

// Database Sync
dbConnection.authenticate()
    .then(async () =>await dbConnection.sync()) // {force: true} will drop all tables in pgAdmin and resync them. This is necessary after you make a change to a model, and need to sync any new table headers to the database.
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`[Server]: App is listening on ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log(`[Server]: Server Crashed. Error = ${err}`)
    })