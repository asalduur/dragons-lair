//top level middleware will send error response when an endpoint is hit that requires login

module.exports = {
    usersOnly: (req, res, next) => {
        if(!req.session.user) {
            return res.status(401).send('please login')
        }
        next()
    },
    adminsOnly: (req, res, next) => {
        if(!req.session.user.isAdmin) {
            return res.status(403).send('you are not an admin')
        }
        next()
    }
}