
const express = require('express')

const router = express.Router()


const { register, login, checkAuth } = require('../controllers/users');
const { addProduct, getProduct, getProducts, updateProduct, deleteProduct } = require('../controllers/product')
const { getTransactions, addTransaction, updateTransactions } = require('../controllers/transaction')
const { addProfile, getProfiles, getProfile, updateProfile, deleteProfile } = require('../controllers/profile');
const { auth } = require("../middlewares/auth")
const { addCart, deleteCart, getCart, updateCart, getCount } = require("../controllers/cart")
const { uploadFile } = require('../middlewares/upload-file')


router.post("/cart", auth, addCart)
router.delete('/cart/:id', auth, deleteCart)
router.get('/cart', auth, getCart)
router.patch('/cart', auth, updateCart)
router.get('/carts', auth, getCount)

router.post("/register", register)
router.post("/login", login)
router.get("/check-auth", auth, checkAuth)

router.post('/product', auth, uploadFile("image"), addProduct)
router.get('/products', auth, getProduct)
router.get('/product/:id', auth, getProducts)
router.patch('/product/:id', auth, uploadFile("image"), updateProduct)
router.delete('/product/:id', auth, deleteProduct)

router.post('/profile', auth, addProfile)
router.get('/profile', auth, getProfiles)
router.get('/profile/:id', auth, getProfile)
router.patch('/profile/:id', auth, updateProfile)
router.delete('/profile/:id', auth, deleteProfile)

router.post('/transaction', auth, addTransaction)
router.get('/transactions', auth, getTransactions)
router.patch('/transactions', auth, updateTransactions)
module.exports = router