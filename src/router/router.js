const express = require('express')
const { CreateUser, LoginUser,GetuserData } = require('../Controller/userController')
const { createData, getRestorent,getRestorentByname } = require('../Controller/restorentController')
const { createMenu, getFoodData, getFoodName } = require('../Controller/menuController')
const { createCart, getCart, updateCart, deleteCart } = require('../Controller/cartController')
const { createOrder, getOrder } =require('../Controller/orderController')
const {Authentication} = require('../Middleware/auth')
const router = express.Router()

//_______________________________________________________userAPI'S__________________________________________

router.post('/register', CreateUser)
router.post('/login', LoginUser)
router.get('/getUser',GetuserData)

//_______________________________________________________Restorent API'S__________________________________________
router.post('/registerResto', createData)
router.get('/getRestorent', getRestorent)
router.get('/getRestorentByname/:name',getRestorentByname)

//_______________________________________________________Menu API'S__________________________________________
router.post('/createFood',createMenu)
router.get('/getFood/:restorent', getFoodData)
router.get('/getfoodByname/:name',getFoodName)

//_______________________________________________________Cart API'S__________________________________________
router.post('/addInCart/:userId', createCart)
router.get('/getCart/:userId', getCart)
router.post('/updateCart/:userId', updateCart)
router.post('/deleteCart/:userId', deleteCart)

//_______________________________________________________Order API'S__________________________________________
router.post('/placeOrder/:userId', createOrder)
router.get('/getOrder/:userId', getOrder)


router.all('/*', function (req, res) {
    res.status(400).send({ msg: "invalid Url request" })
})

module.exports = router