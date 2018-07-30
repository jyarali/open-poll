var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
    title: String,
    question: String,
    place: String,
    pdate: String,
    note: String,
    info: [{
        uid: String,
        vote: String
    }],
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    answers: [{
        content: String,
        vote: {
            type: Number,
            default: 0
        }
    }]
});

module.exports = mongoose.model('Poll', Poll);