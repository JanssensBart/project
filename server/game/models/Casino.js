const Table = require('./Table')

class Casino {
    constructor(name,tables) {
        this.name = name;
        this.tables = []

        if (this.tables.length == 0){
            const newTable = new Table()
            this.tables.push(newTable)
        }
    }
}
module.exports = Casino