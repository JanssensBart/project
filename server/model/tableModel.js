const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tableSchema = new Schema({
    activePlayers: [],
    maxPlayers: Number,
    deck: [],
});

module.exports = mongoose.model('Table', tableSchema);

