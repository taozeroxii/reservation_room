const connection = require('../configs/database');
const configs = require("../configs")
const table = {
    bk: 'tb_bookings',
    bkeq: 'tb_bookings_has_tb_equipments'
}

module.exports = {
    findHistory(value){
        return new Promise((resolve, reject) => {
            const limitPage = configs.limitPage;
            const startpage = ((value.page || 1) - 1) * limitPage;//สูตรการแบ่งหน้า
            const sqls = {
                count: `SELECT COUNT(*) as 'rows' FROM ${table.bk} `,
                select: `SELECT * FROM ${table.bk}  `
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
            sqls.select += " ORDER BY bk_created DESC ";
            
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
    onCreate(value) {
        return new Promise((resolve, reject) => {
            // resolve(value)
            connection.beginTransaction(tsError => {
                if (tsError) return reject(tsError);

                //บันทึกข้อมูลเข้าสู่ตราราง tb_booking
                const bkmodel = {
                    bk_title: value.bk_title,
                    bk_detail: value.bk_detail,
                    bk_time_start: new Date(value.bk_time_start),
                    bk_time_end: new Date(value.bk_time_end),
                    tb_users_u_id: value.tb_users_u_id,
                    tb_rooms_r_id: value.tb_rooms_r_id
                }
                connection.query(`INSERT INTO ${table.bk} set ?`, bkmodel, (bkError, bkResult) => {
                    if (bkError) {
                        connection.rollback();
                        return reject(bkError);
                    }

                    //บันทึกข้อมูลเข้าสู่ตาราง tb_bookings_has_tb_equipments
                    const tb_bookings_bk_id = bkResult.insertId;
                    const bkeqModel = [];
                    value.equipments.forEach(tb_equipments_eq_id => { bkeqModel.push([tb_bookings_bk_id, tb_equipments_eq_id]); });
                    //console.log(bkeqModel);
                    connection.query(`INSERT INTO ${table.bkeq} (tb_bookings_bk_id,tb_equipments_eq_id) VALUE ?`, [bkeqModel], (bkeqError, bkeqResult) => {
                        if (bkError) {
                            connection.rollback();
                            return reject(bkError);
                        }
                        connection.commit(cmError =>{if(cmError){ connection.rollback(); return reject(cmError);} })//สั่งให้เพิ่มลงฐานข้อมูลหากไม่ commit จะยังไม่ insert ข้อมูลจะเป็น tempไม่เข้าฐาน
                        resolve(bkeqResult)
                    })
                })
            })
        })
    }
}