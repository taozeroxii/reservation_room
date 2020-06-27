const connection = require('../configs/database');
const configs = require("../configs/index");
const table = 'tb_equipments';
module.exports = {

    //แสดงข้อมูลทั้งหมดเอาไปทำ list check box หน้าการจอง
    findAll(){
        return new Promise((resolve,reject)=>{
            connection.query(` SELECT eq_id,eq_name,eq_image FROM ${table}`,(error,result)=>{
                if(error) return reject(error);
                resolve(result)
            })
        })
    },

    find(value) {
        return new Promise((resolve, reject) => {
            const limitPage = configs.limitPage;
            const startpage = ((value.page || 1) - 1) * limitPage;//สูตรการแบ่งหน้า
            const sqls = {
                count: `SELECT COUNT(*) as 'rows' FROM tb_equipments `,
                select: 'SELECT * FROM tb_equipments '
            }
            

            //แสดงข้อมูลเมื่อมีการค้นหา
            if (value.search_key && value.search_text) {
                const key = value.search_key;
                const txt = value.search_text;
                const sqlSerch = ` WHERE ${connection.escapeId(key)} LIKE ${connection.escape(`%${txt}%`)}`;
                sqls.count += sqlSerch;
                sqls.select += sqlSerch;
            }

            //เรียงจากวันล่าสุดย้อนมา
            sqls.select += " ORDER BY eq_updated DESC ";
            
            //หาจำนวนแถว
            connection.query(sqls.count, (error, result) => {
                if (error) return reject(error);
                const items = { result: [], rows: result[0].rows, limit: limitPage };
                //แบ่งหน้า
                sqls.select += `LIMIT ${connection.escape(startpage)},${limitPage}`
                connection.query(sqls.select, (err, result2) => {
                    if (err) return reject(err);
                    items.result = result2 //ให้ค่า result ที่เป็น array แรกเก็บค่า result 2 ที่ดึงข้อมูลมาใหม่
                    resolve(items);
                })
            })
        })
    },
    findOne(column) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM tb_equipments WHERE ?', column, (error, result) => {
                if (error) return reject(error)
                resolve(result.length > 0 ? result[0] : null);
            })
        })
    },
    onCreate(value) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO tb_equipments SET ?', value, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })
    },
    onDelete(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM tb_equipments WHERE eq_id=?', [id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })
    },
    onUpdate(id, value) {
        return new Promise((resolve, reject) => {
            const $query = `
            UPDATE tb_equipments SET 
                eq_name   = ?,
                eq_detail = ?,
                eq_image  = ?,
                eq_updated = NOW()
            WHERE eq_id   = ?
            `;
            connection.query($query, [
                value.eq_name,
                value.eq_detail,
                value.eq_image,
                id
            ], (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        })
    }
};