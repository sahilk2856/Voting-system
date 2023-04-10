const mongoose = require('mongoose');


const voteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId
    },
    voteable: {
        type: mongoose.Schema.ObjectId,
        require: true,
        refPath: 'onModel'
    },
    onModel: {
        type: String,
        required: true,
        enum: ['Candidate']
    }
}, {
    timestamps: true
});

const Vote = mongoose.model('Vote', voteSchema);
module.exports = Vote;