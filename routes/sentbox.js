const express = require('express');
const router = express.Router();
const sentboxController=require("../controllers/sentbox");
router.post('/adds/:username',sentboxController.addSentbox)   //add from compose  post ✅
router.delete('/deletes/:username/:mailId',sentboxController.deleteSentbox)     //remove   delete   //${userName}/inbox/${mail.id}
router.get('/gets/:username',sentboxController.getSentbox)


  module.exports = router;