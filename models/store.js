const moogoose = require('mongoose');
const Schema = moogoose.Schema;

const storeSchema = new Schema({
    name: String,
    likes: Number,
    description: String,
    reviews: []
});

module.exports = mongoose.model('Store', storeSchema);