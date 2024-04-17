const express = require('express');
const router = express.Router();
const inboxController=require("../controllers/inbox"); 
router.post('/addi/:username',inboxController.addInbox)   //add from compose  post   ✅
router.put('/update/:username/:mailId',inboxController.updateInbox)    //update   put     // `${userName}/inbox/${mail.id}`,
router.delete('/deletei/:username/:mailId',inboxController.deleteInbox)     //remove   delete   //${userName}/inbox/${mail.id}
router.get('/geti/:username',inboxController.getInbox)              //replace(latest )   get

//         `https://mailbox-d7010-default-rtdb.firebaseio.com/mail-box/${endPoint}.json`;
//  const receiverMessage = {
//     date : date,
//     time: time,
//     from: userName,
//     fromMail: userEmail,
//     subject: subject,
//     content: editorHtmlwithoutTags,
//     isRead: false,
//   };         endPoint : `${receiverName}/inbox`,

  module.exports = router;