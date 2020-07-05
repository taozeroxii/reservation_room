const crypto = require('crypto');

const security = {
    password_hash(password) {
        return crypto.createHash('sha1').update(password).digest('hex');
    },
    password_valify(password, password_hash) {
        return security.password_hash(password) === password_hash;
    },
    
    authenticated(req, res, next) {

      /*  req.session.userLogin = {
            "u_id": 1,
            "u_username": "admin",
            "u_firstname": "admin",
            "u_lastname": "tao",
            "u_role": "admin"
        }*/

        try {
            if (req.session.userLogin) { return next(); }
            throw new Error('Unauthorized');

        }
        catch (ex) {
            res.error(ex, 401);
        }
    }
};

module.exports = security;