const bcrypt = require('bcryptjs')

module.exports = {
    //register method is an async function that takes in request and response
    register:  async (req, res) => {
         // req.app.get is getting our database instance (can be named anything)
        //we save that to a a constant variable called db, which we refer to later in the code
        const db = req.app.get('db')
        //we destructure off the request body
        const {username, password, isAdmin} = req.body
        // we save our query call to 'result' variable and 
        //we use await to pause the asyn func until promise is fulfilled
        const result = await db.get_user(username) 
          // sql queries come back as arrays(bc we're using massive) in js
         //and this query is returning only one item
        // we are saving the result at index 0(only one item)
       // to the constant variable 'existingUser', for no reason but to make code easy to read
        const existingUser = result[0]
        //if the username exists, they cannot register with that username
        if(existingUser){
            return res.status(409).send('username is taken')
        }
        //using bcrypt, we're invoking a function called genSaltSync() that
        //that takes in a num as parameter(10 by default)
        //and generates 'salt'. we saved that to a const variable salt
        const salt = bcrypt.genSaltSync()
        //now we're mixing the generated 'salt' with the password
        //using hashSync which is another generator 
        // that generates 'hash' and saving that to variable hash
        const hash = bcrypt.hashSync(password, salt)
        //now we're running the register_user.sql query
        //passing in some parameters (what is required to 'register')
        //using await to pause while promise is fulfilled
        //and saving that to save to a variable 'registeredUser'
        const registeredUser = await db.register_user(isAdmin, username, hash)
        //bc queries come back as arrays, we save the first item as our user variable
        const user = registeredUser[0]
        //req.session is a key value object
        //when a new user session is started
        //it saves values from input in this session object
        req.session.user = {
            isAdmin: user.is_admin,
            id: user.id,
            username: user.username
        }
        //http 201 status stands for 'created'
        //we're sending our user session that was just created as promised
        res.status(201).send(req.session.user)       
    },
    login: async (req, res) => {
        const {username, password} = req.body
        const db = req.app.get('db')
        const foundUser = await db.get_user(username)
        const user = foundUser[0]
        if(!user){
            return res.status(401).send('user not found. please register as a new user before logging in')
        }
        //compareSync tests a string against a hash.
        //first parameter is string to be tested, second the hash
        //returns true if matched, otherwise false
        const isAuthenticated = bcrypt.compareSync(password, user.hash)
        if (!isAuthenticated) {
            return res.status(403).send('incorrect password')
        }
        req.session.user = {
            isAdmin: user.is_admin,
            id: user.id,
            username: user.username
        }
        return res.status(201).send(req.session.user)
    },
    logout: async (req, res) => {
        req.session.destroy()
        return res.sendStatus(200) //this is the same as sending res.status(200).send('ok')
    }
}