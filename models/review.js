const moogoose = require('mongoose');
const Schema = moogoose.Schema;

const reviewSchema = new Schema({
    content: String,
    creator: String,
    createdTime: String
});

module.exports = mongoose.model('Review', reviewSchema);