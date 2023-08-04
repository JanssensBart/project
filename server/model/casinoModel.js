const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./userModel')
const Table = require('./tableModel')



const casinoSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    players: [] ,
    tables: [{ type: Schema.Types.ObjectId, ref: 'Table' }]  
})


module.exports = mongoose.model('Casino', casinoSchema);
