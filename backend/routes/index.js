const router = require('express').Router();
const { authenticated } = require('../configs/security');

//account router
router.use('/account',require('./account'));

//equipment
router.use('/equipment',authenticated,require('./equipment'));

//room
router.use('/room',authenticated,require('./room'));

//room
router.use('/booking',authenticated,require('./booking'));

module.exports = router;