require('dotenv').config()
const express = require('express')
const session = require('express-session')
const massive = require('massive')
//controllers
const authCtrl = require('./controllers/authCtrl')
const treasureCrtl = require('./controllers/treasureCtrl')

const auth = require('./middleware/authMiddleware')

const app = express()
app.use(express.json())

const { CONNECTION_STRING, SESSION_SECRET } = process.env
const PORT = 4000

app.use(
    session({
        secret: SESSION_SECRET,
        resave: true, //active sessions saved if no changes made
        saveUninitialized: false //new session will not be saved unless changed
    })
)

massive({
    connectionString: CONNECTION_STRING,
    ssl: {rejectUnauthorized: false}
})
.then(db => {
    app.set('db', db)
})

app.listen(PORT, () => {
    console.log(`you are listening to dalso${PORT}`)
})


app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.get('/auth/logout', authCtrl.logout)

app.get('/api/treasure/dragon', treasureCrtl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureCrtl.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasureCrtl.addUserTreasure)
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCrtl.getAllTreasure)