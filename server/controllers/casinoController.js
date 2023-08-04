// MODELS
const Casino = require('../model/casinoModel')

const asyncHandler = require('express-async-handler')

//@desc Create casino
//route POST /game/newCasino
//@access Private
const createCasino = asyncHandler(async(req,res) => {

    const { name}  = req.body
    if(!name) throw new Error('You need to provide a name for the casino!')
    const findCasino = await Casino.findOne({name: name}).exec()
    
    if(findCasino) {
        res.status(409)
        throw new Error ('Casinoname must be unique !')
    }
    
    const newCasino = await Casino.create({
        name: name
    })
    
    res.status(201).json(newCasino)
    
});

//@desc Get all casinos
//route GET /game/getAll
//@access Private
const getCasinos = asyncHandler(async(req,res) => {

    const casinos = await Casino.find({})

    res.status(200).json(casinos)
    
});


//@desc Update casino
//route PUT /game/newCasino
//@access Private
const updateCasino = asyncHandler(async(req,res) => {
    
    if(!req.body.id) throw new Error('You need to provide an id of the user')
    const casino = await Casino.findOne({ _id : id }).exec()

    if(casino){
        if(req.body?.name) casino.name = req.body.name || casino.name
        const updatedCasino = await casino.save()

        res.status(200).json({
            _id: updatedCasino._id,
            name: updatedCasino.name
        })
    }else {
        res.status(204).json({ 'message' : `Casino with id: ${id} not found.`})
    }
    

})


//@desc Delete casino by id
//route POST /game/deleteCasinoById
//@access Private
const deleteCasinoById = asyncHandler(async(req,res) => {
    const { id }  = req.body
    if(!id) throw new Error('You need to provide the id from the casino!')
    const findCasino = await Casino.findOne({_id: id}).exec()
    
    if(!findCasino) {
        res.status(204)
        throw new Error ('Requested casino not found !')
    }

    const casino = await Casino.deleteOne({_id : findCasino._id})

    res.status(201).json(casino)
    
});



module.exports = {
    createCasino,
    deleteCasinoById,
    updateCasino,
    getCasinos
};