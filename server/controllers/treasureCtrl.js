module.exports = {
    dragonTreasure: async (req, res) => {
        const db = req.app.get('db')
        const result = await db.get_dragon_treasure(1)
        res.status(200).send(result)
    },
    getUserTreasure: async (req, res) => {
        const {id} = req.session.user //user cannot login until this is defined
        const db = req.app.get('db')
        const result = await db.get_user_treasure(id)
        res.status(200).send(result)
    },
    addUserTreasure: async (req, res) => {
        const {treasureURL} = req.body 
        const {id} = req.session.user
        const db = req.app.get('db')
        const userTreasure = await db.add_user_treasure(treasureURL, id)
        res.status(200).send(userTreasure)

    },
    getAllTreasure: async (req, res) => {
        const db = req.app.get('db')
        const result = await db.get_all_treasure()
        res.status(200).send(result)
    }
}