// MODELS
const Casino = require('../model/casinoModel')
const User = require('../model/userModel')
const asyncHandler = require('express-async-handler')

//@desc Add user to the casino
//route put /game/addUser
//@access Public
const addUser = asyncHandler(async(req,res) => {

    const { id }  = req.body
    if(!id) throw new Error('You need to provide the id from the casino!')

    const player = await User.findOne({_id: id}).exec()
    const getCasino = await Casino.find({})

    console.log(player._id)
    
    const addedPlayer = await Casino.updateOne(
        { _id : getCasino._id },
        { $push: { players: player._id} }
    )

    res.status(201).json(addedPlayer)

});





module.exports = {
    addUser,
};