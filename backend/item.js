const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Item = new Schema({
    itemName: {
        type: String
    },
    cost: {
        type: Number
    },
    address: {
        type: String
    },
    owner: {
        type: String
    },
    state:{
        type: String
    },
    transactionHash:{
        type: String
    },
    date: { type: Date, default: Date.now },
}, {
    collection: 'item'
});

module.exports = mongoose.model('item', Item);