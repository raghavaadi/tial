const jwt = require('jsonwebtoken')


const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        console.log(token)
        const decoded = jwt.verify(token, 'shadowshurikenjutsu')
      console.log(decoded)

        if (!decoded.id) {
            throw new Error()
        }

      if(decoded.id === 'moo baa la la la')
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth