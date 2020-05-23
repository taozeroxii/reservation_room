const router = require('express').Router();
const { check } = require("express-validator");
const { onRegister, onLogin } = require('../service/account');
const {authenticated} = require('../configs/security')

//registerpage

router.post('/register', [
    check('u_username', 'กรุณากรอกข้อมูล').not().isEmpty(),
    check('u_password').not().isEmpty(),
    check('u_firstname').not().isEmpty(),
    check('u_lastname').not().isEmpty()
], async (req, res) => {
    try {
        req.validate();
        const created = await onRegister(req.body);
        res.json(created);
    }
    catch (ex) {
        res.error(ex);
    }
});

//เข้าสู่ระบบ
router.post('/login', [
    check('u_username').not().isEmpty(),
    check('u_password').not().isEmpty()
], async (req, res) => {
    try {
        req.validate();
        const userLogin = await onLogin(req.body);
        req.session.userLogin = userLogin;//สร้าง session login ของ user
        res.json(userLogin)
    }
    catch (ex) {
        res.error(ex);
    }
});

// ตรวจสอบ userlogin
router.post('/getUserLogin',authenticated, (req, res) => {
    try {
        return res.json(req.session.userLogin);
    }
    catch (ex) {
        res.error(ex, 401);
    }
})

// ตรวจสอบ userlogout
router.post('/logout', (req, res) => {
    try {
        if (req.session.userLogin) {
            delete req.session.userLogin; // sesstion destroy 
            return res.json(req.session.userLogin);
        }
        throw new Error("Unauthorized");
    }
    catch (ex) {
        res.error(ex, 401);
    }
})

module.exports = router;