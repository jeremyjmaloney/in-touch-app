const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = Schema({
  name: String,
  message: {type:String, required:true}
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
