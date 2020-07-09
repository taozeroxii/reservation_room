const router = require('express').Router();
const { authenticated,isInRoles } = require('../configs/security');

//account router
router.use('/account',require('./account'));

//equipment
router.use('/equipment',authenticated,isInRoles(['admin']),require('./equipment'));

//room
router.use('/room',authenticated,isInRoles(['admin']),require('./room'));

//room
router.use('/booking',authenticated,require('./booking'));

module.exports = router;