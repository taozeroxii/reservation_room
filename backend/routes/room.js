const router = require('express').Router();
const service = require('../service/room');
const { check, query } = require("express-validator");

const base64Img = require('base64-img');
const fs = require('fs');//Method is used to read files on your computer.
const path = require('path');//The syntax for including the Path module in your application
const uploadDir = path.resolve('uploads');
const roomDir = path.join(uploadDir, 'rooms');// รวมpath กับ uploadDirเข้าด้วยกัน

//แสดงข้อมูล
router.get('/', [
    query('page').not().isEmpty().toInt().isInt()
], async (req, res) => {
    try {
        req.validate();
        res.json(await service.find(req.query));
    }
    catch (ex) {
        res.error(ex);
    }
})

//แสดงข้อมูลแค่ 1 rowเพื่อแก้ไข
router.get('/:id',async (req,res)=>{
    try{
        const model =await service.findOne({ r_id:req.params.id })
        if(!model) throw new Error('Not Found Item !!!');
        model.r_image = base64Img.base64Sync(path.join(roomDir,model.r_image));
        res.json(model);
    }
    catch(ex){res.error(ex)}
})


//เพิ่มข้อมูลห้องประชุม
router.post('/', [
    check('r_image').not().isEmpty(),
    check('r_name').not().isEmpty(),
    check('r_capacity').isInt(),
    check('r_detail').exists()
], async (req, res) => {
    try {
        req.validate();

        // ตรวจสอบ folder หากไม่มีให้ทำการสร้างfolder อันแรกให้สร้างโฟลเดอร์ upload และ2สร้าง equipments ในupload
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        if (!fs.existsSync(roomDir)) fs.mkdirSync(roomDir);

        //แปลงข้อมูลรูปภาพ    
        req.body.r_image = base64Img
            .imgSync(req.body.r_image, roomDir, `room-${Date.now()}`)
            .replace(roomDir, '').replace('\\', '');
            
        res.json({ message: await service.onCreate(req.body) })
    }
    catch (ex) {
        // หาก insert ข้อมูลไม่เข้าให้ลบรูปภาพที่เข้ามาออกไป
        const delImg = path.join(roomDir, req.body.r_image || '');
        if (fs.existsSync(delImg)) fs.unlinkSync(delImg, () => null);
        res.error(ex);
    }
})

//ลบข้อมูล
router.delete('/:id', async (req, res) => {
    try {
        const Item = await service.findOne({ r_id: req.params.id })//หาข้อมูลในตาราง
        if (!Item) throw new Error('Not found item');
        const deleteItem = await service.onDelete(Item.r_id)//รับ id มาและเอาไปเช็คว่าตรงกับ idไหนในตารางและลบออกไป
        const deleteImg = path.join(roomDir, Item.r_image);// ตัวแปร deleteImg เก็บค่าพาร์ทที่อยู่ไฟล์รูปภาพและชื่อภาพว่าเป็นภาพไหน Item.eq_image คือชื่อไฟล์นั้น
        if (fs.existsSync(deleteImg)) fs.unlink(deleteImg, () => null);// ถ้าหากเจอภาพให้ลบอออกไปใส่ callback กับerror
        res.send(deleteItem);
    }
    catch (ex) {
        res.error(ex);
    }
})
 
//แก้ไขข้อมูล
router.put('/:id', [
    check('r_image').not().isEmpty(),
    check('r_name').not().isEmpty(),
    check('r_capacity').isInt(),
    check('r_detail').exists()
], async (req, res) => {
    try {
        req.validate();

        // หาข้อมูลที่จะแก้ไข
        const Item = await service.findOne({ r_id: req.params.id })//หาข้อมูลในตาราง
        if (!Item) throw new Error('Not found item');

        // ตรวจสอบ folder หากไม่มีให้ทำการสร้างfolder อันแรกให้สร้างโฟลเดอร์ upload และ2สร้าง equipments ในupload
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        if (!fs.existsSync(roomDir)) fs.mkdirSync(roomDir);

        //แปลงข้อมูลbase64เป็นรูปภาพ  
        req.body.r_image = base64Img
            .imgSync(req.body.r_image, roomDir, `room-${Date.now()}`)
            .replace(roomDir, '').replace('\\', '');

        const updateItem = await service.onUpdate(req.params.id, req.body);
        //ตรวจสอบหากมีการเปลี่ยนแปลงข้อมูลตัว affectedRows จะไม่ใช่ 0 และสั่งลบภาพเดิมออก
        if (updateItem.affectedRows > 0) {
            const deleteImg = path.join(roomDir, Item.r_image);
            if (fs.existsSync(deleteImg)) fs.unlink(deleteImg, () => null);
        }
        res.json(updateItem)
    }
    catch (ex) {
           // หาก insert ข้อมูลไม่เข้าให้ลบรูปภาพที่เข้ามาออกไป
           const delImg = path.join(roomDir, req.body.r_image || '');
           if (fs.existsSync(delImg)) fs.unlinkSync(delImg, () => null);
        res.error(ex);
    }
})

module.exports = router;