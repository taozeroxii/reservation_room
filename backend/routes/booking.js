const router = require('express').Router();
const { check, query } = require("express-validator");
const roomservice = require(`../service/room`)
const bookingService = require('../service/booking')

router.get('/',[query('page').not().isEmpty().toInt().isInt()],async (req,res)=>{
    try{
        req.validate();
        res.json(await roomservice.find(req.query))
    }
    catch(ex){res.error(ex);}
    res.json({message:'message booking'})
})

//ประวัติการจอง
router.get('/history',[
    query('page').isInt()
],async (req,res)=>{
    try{
        res.json(await bookingService.findHistory(req.query))
    }
    catch(ex){
        res.error(ex)
    }

})

//แสดงรายละเอียดของห้องประชุม
router.get('/room/:id',async (req,res)=>{
    try{
        res.json(await roomservice.findDetailforBooking(req.params.id))
    }
    catch(ex){res.error(ex)}
})

router.post('/',[
    check('tb_rooms_r_id').isInt(),
    check('bk_title').notEmpty(),
    check('bk_detail').exists(),
    check('bk_time_start').custom(value =>{
        return !isNaN(Date.parse(value))  //เอาค่าในตัวแปรมา parse ดูว่าเป็น dateได้ไหม เช็คค่าที่เข้ามาเป็นวันที่ไหมถ้าใช้จะ return true ทำงานต่อ
    }),
    check('bk_time_end').custom(value =>{return !isNaN(Date.parse(value))}),
    check('equipments').custom(values =>{const isarray = Array.isArray(values); 
        if(isarray && values.length > 0){
            return values.filter(item => isNaN(item)).length == 0; //เช็คค่าในอาเรย์ว่ามีตัวอักษรไหมหากมาค่าที่ฟิลเตอร์ได้จะมากกว่า0
        }
        return isarray })
],async (req,res)=>{
    try{
        req.validate();
        req.body.tb_users_u_id = req.session.userLogin.u_id
        res.json(await bookingService.onCreate(req.body))
    }
    catch(ex){res.error(ex);}
})


module.exports = router;