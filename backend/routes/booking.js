const router = require('express').Router();
const { check, query ,param} = require("express-validator");
const roomservice = require(`../service/room`)
const bookingService = require('../service/booking')
const equipmentsService = require('../service/equipment');
const booking = require('../service/booking');

router.get('/', [query('page').not().isEmpty().toInt().isInt()], async (req, res) => {
    try {
        req.validate();
        res.json(await roomservice.find(req.query))
    }
    catch (ex) { res.error(ex); }
    res.json({ message: 'message booking' })
})


//แสดงข้อมูลอุปกรณ์ห้องประชุม
router.get('/equipments', async (req, res) => {
    try {
        res.json(await equipmentsService.findAll());
    }
    catch (ex) { res.error(ex) }
})

//ประวัติการจอง
router.get('/history', [
    query('page').isInt()
], async (req, res) => {
    try {
        res.json(await bookingService.findHistory(req.query, req.session.userLogin.u_id))
    }
    catch (ex) {
        res.error(ex)
    }

})

//แสดงรายละเอียดของห้องประชุม
router.get('/room/:id', async (req, res) => {
    try {
        const model = await roomservice.findDetailforBooking(req.params.id);
        if (!model) throw new Error('ไม่พบข้อมูลห้อง');
        res.json(model)
    }
    catch (ex) { res.error(ex) }
})

// เพิ่มการจองห้อง
router.post('/', [
    check('tb_rooms_r_id').isInt(),
    check('bk_title').notEmpty(),
    check('bk_detail').exists(),
    check('bk_time_start').custom(value => {
        return !isNaN(Date.parse(value))  //เอาค่าในตัวแปรมา parse ดูว่าเป็น dateได้ไหม เช็คค่าที่เข้ามาเป็นวันที่ไหมถ้าใช้จะ return true ทำงานต่อ
    }),
    check('bk_time_end').custom(value => { return !isNaN(Date.parse(value)) }),
    check('equipments').custom(values => {
        const isarray = Array.isArray(values);
        if (isarray && values.length > 0) {
            return values.filter(item => isNaN(item)).length == 0; //เช็คค่าในอาเรย์ว่ามีตัวอักษรไหมหากมาค่าที่ฟิลเตอร์ได้จะมากกว่า0
        }
        return isarray
    })
], async (req, res) => {
    try {
        req.validate();
        req.body.tb_users_u_id = req.session.userLogin.u_id
        res.json(await bookingService.onCreate(req.body))
    }
    catch (ex) { res.error(ex); }
})



//#region สำหรับผู้ดูแลระบบ
//ดึงข้อมูลห้องประชุมมาทำ select 
router.get('/rooms/select', async (req, res) => {
    try {
        res.json(await roomservice.findSelect())
    }
    catch (ex) { res.error(ex); }
})

//ดึงข้อมูลการจองห้องประชุมมาจาก roomid มาใส่ใน calendar
router.get('/calendar/room/:id',[
    param('id').isInt()
],async (req,res)=>{
    try{
        req.validate();
        res.json(await bookingService.findByroomId(req.params.id))
    }
    catch(ex){res.error(ex)}
})

//แสดงรายการจองห้องประชุมทั้งหมด
router.get('/manage', [query('page').isInt()],async (req,res) => {
    try{
        req.validate();
        res.json(await bookingService.find(req.query))
    }
    catch(ex){res.error(ex)}
})

//แก้ไขสถานะการจองอนุมัติไม่อนุมัติ
router.put('/manage/:id',[
    param('id').isInt(),
    check('bk_status').not().isEmpty().isIn(['allowed','not allowed'])
],async  (req,res) => {
    try{
        req.validate();
        const finditem = await bookingService.findById(req.params.id)
        if(!finditem) throw new Error('ไม่พบข้อมูลการจอง')
        res.json(await bookingService.onUpdate(finditem.bk_id,req.body))
        //res.json({mseeage:'update status',body:req.body});
    }
    catch(ex){res.error(ex)}
})

//ลบข้อมูลการจองที่ไม่ได้อนุมัติ
router.delete('/manage/:id',[
    param('id').isInt(),
    check('bk_status').not().isEmpty().isIn(['allowed','not allowed'])
],async  (req,res) => {
    try{
        req.validate();
        const finditem = await bookingService.findById(req.params.id)
        if(!finditem) throw new Error('ไม่พบข้อมูลการจอง')
        res.json(await bookingService.onDelete(finditem.bk_id,req.body))
        //res.json({mseeage:'update status',body:req.body});
    }
    catch(ex){res.error(ex)}
})


//#endregion



module.exports = router;