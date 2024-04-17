const express = require('express');
const router = express.Router();
const trashController=require("../controllers/trash"); 
router.get('/getT/:username',trashController.getT)   //add from compose  post   ✅
router.post('/addT/:username/:mailId',trashController.addTrash)   

module.exports = router;