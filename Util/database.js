const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

// mongodb+srv://deep:wLx96Hj65FGYiQpn@cluster0.rpjyrmi.mongodb.net/
const mongoConnect= MongoClient.connect('mongodb+srv://deep:wLx96Hj65FGYiQpn@cluster0.rpjyrmi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(client => {
    console.log('Connected!');
    _db = client.db();
    callback();
  })
  .catch(err => {
    console.log(err);
    throw err;
  });
  exports.MongoConnect = mongoConnect;