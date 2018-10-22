const mongoose = require('../database/mongoose');
const Schema = mongoose.Schema;

let todoSchema = Schema({
    text: {
        type: String,
        required: [true, 'you need to specify the text'],
        minlength: 2,
        trim: true
    },
      isCompleted: {
        type: Boolean,
        default: false
    },
      completed_at: {
        type: Number,
        min: 0,
        default: null
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
});

module.exports = mongoose.model('Todo', todoSchema);