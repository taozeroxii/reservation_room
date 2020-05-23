const connection = require('../configs/database');
const configs = require("../configs/index")


module.exports = {
    findDetailforBooking(id){
        return new Promise((resolve,reject)=>{
            connection.query(`
                SELECT r_id,r_image,r_name,r_capacity,
                    (SELECT count(*) FROM tb_bookings WHERE tb_rooms_r_id = r_id and bk_status = 'pending')as r_booking
                ,r_detail
                FROM tb_rooms where r_id = ?
            `,[id],(error,results)=>{
                if(error) return reject(error)
                resolve(results.length == 0 ? null : results[0])
            })
        });
    },
    
    find(value) {
        return new Promise((resolve, reject) => {
            const limitPage = configs.limitPage;
            const startpage = ((value.page || 1) - 1) * limitPage;//สูตรการแบ่งหน้า
            const sqls = {
                count: `SELECT COUNT(*) as 'rows' FROM tb_rooms `,
                select: 'SELECT * FROM tb_rooms '
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
            sqls.select += " ORDER BY r_updated DESC ";
            
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
            connection.query('INSERT INTO tb_rooms SET ?', value, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })
    },
    findOne(column) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM tb_rooms WHERE ?', column, (error, result) => {
                if (error) return reject(error)
                resolve(result.length > 0 ? result[0] : null);
            })
        })
    },
    onDelete(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM tb_rooms WHERE r_id=?', [id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })
    },
    onUpdate(id, value) {
        return new Promise((resolve, reject) => {
            const $query = `
            UPDATE tb_rooms SET 
                r_name   = ?,
                r_capacity = ?,
                r_image  = ?,
                r_detail  = ?,
                r_updated = NOW()
            WHERE r_id   = ?
            `;
            connection.query($query, [
                value.r_name,
                value.r_capacity,
                value.r_image,
                value.r_detail,
                id
            ], (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        })
    }
};