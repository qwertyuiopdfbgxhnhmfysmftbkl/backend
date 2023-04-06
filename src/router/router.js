const express = require('express')
const { CreateUser, LoginUser } = require('../Controller/userController')
const { createData, getRestorent } = require('../Controller/restorentController')
const { createMenu, getFoodData } = require('../Controller/menuController')
const router = express.Router()

//_______________________________________________________userAPI'S__________________________________________

router.post('/register', CreateUser)
router.post('/login', LoginUser)

//_______________________________________________________Restorent API'S__________________________________________
router.post('/registerResto', createData)
router.get('/getRestorent', getRestorent)

//_______________________________________________________Menu API'S__________________________________________
router.post('/createFood', createMenu)
router.get('/getFood/:restorent', getFoodData)


router.all('/*', function (req, res) {
    res.status(400).send({ msg: "invalid Url request" })
})

module.exports = router