// MODELS

const Table = require('../model/tableModel')


const createTable = asyncHandler(async(req,res) => {

    const { maxPlayers,id }  = req.body

    const createdTable = await Table.create({maxPlayers: maxPlayers})

    res.status(200).json(createTable)
     
});

//@desc Delete all tables
//route DELETE /game/newCasino
//@access Public
const deleteTables = asyncHandler(async(req,res) => {

    const tables  = await Table.deleteMany({})
    const foundTables = await Table.find({})

    console.log(tables)

    res.status(202).json({
        succes: tables.acknowledged,
        tablesDeleted: tables.deletedCount,
        tablesFound: foundTables
    })
})



module.exports = {
    createTable
};