const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = Schema({
  message: String
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
