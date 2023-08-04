const uuid = require('../utils/uuid')

class Table {
    constructor(maxplayers=9){
        this.id = uuid
        this.maxplayers = maxplayers
        this.activePlayers = []
        this.passivePlayers = []
        this.pot = []
        this.cards = []  
    }
}

module.exports = Table