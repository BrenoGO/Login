const router = require('express').Router()

const authMiddleware = require('./middlewares/auth')
const UserController = require('./controllers/UserController')

router.post('/login/email', UserController.loginTestEmail)
router.post('/login', UserController.login)
router.post('/register', UserController.register)
router.post('/recover/request', UserController.recoverReq)
router.post('/recover/code', UserController.recoverTestCode)

router.use(authMiddleware)
router.post('/recover/update', UserController.recoverUpdatePassWord)
router.get('/private', UserController.private)

module.exports = router
