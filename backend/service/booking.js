const connection = require('../configs/database');
const configs = require("../configs");
const { connect } = require('../configs/database');
const table = {
    bk: 'tb_bookings',
    bkeq: 'tb_bookings_has_tb_equipments'
}

module.exports = {
    findByCheckDateTime({bk_time_start,bk_time_end,tb_rooms_r_id}) {
        return new Promise ((resolve,reject) => {
            const start    = new Date(bk_time_start);
            const end      = new Date(bk_time_end);
            connection.query(`
                 SELECT COUNT(*) as bk_count 
                 FROM ${table.bk}
                 WHERE
                     bk_time_start BETWEEN ${connection.escape(start)} AND ${connection.escape(end)}
                 OR
                     bk_time_end BETWEEN ${connection.escape(start)} AND ${connection.escape(end)}
                 AND 
                     tb_rooms_r_id = ${tb_rooms_r_id}`,(error,result)=>{
                     if(error) return reject(error)
                     //console.log(result.length )
                     console.log(result[0].bk_count)
                     resolve(result.length > 0 ? result[0].bk_count > 0 : false);
                })
        });
    },
    findById(id){
        return new Promise ((resolve,reject)=>{
            connection.query(`SELECT * FROM ${table.bk} WHERE bk_id = ?`,[id],(error,result)=>{
                if(error) return reject(error)
                resolve(result.length > 0 ? result[0] : null)
            } )
        })
    },
    findByroomId(roomId){
        return new Promise((resolve,reject)=>{
            connection.query(`
                SELECT * FROM ${table.bk} 
                WHERE tb_rooms_r_id=? AND bk_status <> 'not allowed'`,roomId,(error,result) => {
                if(error) return reject(error);
                resolve(result);
            })
        })

    },
    findHistory(value,tb_users_u_id){
        return new Promise((resolve, reject) => {
            const limitPage = configs.limitPage;
            const startpage = ((value.page || 1) - 1) * limitPage;//สูตรการแบ่งหน้า
            const sqls = {
                count: `SELECT COUNT(*) as 'rows' FROM ${table.bk} WHERE tb_users_u_id = ${tb_users_u_id}`,
                select: `SELECT * FROM ${table.bk} WHERE tb_users_u_id = ${connection.escape(tb_users_u_id) }`
            }
            

            //แสดงข้อมูลเมื่อมีการค้นหา
            if (value.search_key && value.search_text) {
                const key = value.search_key;
                const txt = value.search_text;
                const sqlSerch = ` AND ${connection.escapeId(key)} LIKE ${connection.escape(`%${txt}%`)}`;
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
    find(value){
        return new Promise((resolve, reject) => {
            const limitPage = configs.limitPage;
            const startpage = ((value.page || 1) - 1) * limitPage;//สูตรการแบ่งหน้า
            const sqls = {
                count: `SELECT COUNT(*) as 'rows' FROM ${table.bk} `,
                select: `SELECT * FROM ${table.bk} `
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

            //ตรวจสอบวันว่ามีการเลือกไปแล้วไหมในระบบ
            this.findByCheckDateTime(value)
            .then(bk_count => {
                console.log(bk_count);
            })
            .catch(reject)


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

                //ตรวจสอบวันที่จองและวันสิ้นสุด
                if(bkmodel.bk_time_start >= bkmodel.bk_time_end ){
                    return reject(new Error('วันเวลาจองไม่ถูกต้อง'))
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
    },
    onUpdate(id,value){
        return new Promise((resolve,reject)=>{
            connection.query(`
            UPDATE ${table.bk} 
            SET ? ,
            bk_updated = NOW()
            WHERE bk_id = ${connection.escape(id)}`,value,(error,result)=>{
                if(error) return reject(error)
                resolve(result)
            })
        })
    },
    onDelete(id,value){
        return new Promise((resolve,reject)=>{
            connection.query(` DELETE FROM ${table.bk}  WHERE bk_id = ${connection.escape(id)}`,value,(error,result)=>{
                if(error) return reject(error)
                resolve(result)
            })
        })
    }
}