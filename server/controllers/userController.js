const asyncHandler = require('express-async-handler')
const User = require('../model/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//@desc Auth user/set token
//route POST /api/users/auth
//@access Public
const authUser = asyncHandler(async(req,res) => {
    
    const { username, password } = req.body

    if(!username || !password) return res.status(400).json({
        'message' : 'Username and password required.'
    })

    const user = await User.findOne({ username })

    // if user found and passwords are correct
    if( user && ( await bcrypt.compare(password,user.password) )){
        const roles = Object.values(user.roles).filter(Boolean);
        //
        const accessToken  = jwt.sign(
            {
                "UserInfo": {
                    "username": user.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN,
            { expiresIn: '10s' }
        )
        const refreshToken = jwt.sign(
            { "username": user.username },
            process.env.REFRESH_TOKEN,
            { expiresIn: '1d' }
        );
        
        // Saving refreshToken with current user
        user.refreshToken = refreshToken
        await user.save()

        res.cookie('jwt',refreshToken,{
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 //1day
        })

        res.json({
            user: {
                _id : user._id,
                username : user.username,
                roles: user.roles,
            },
            accessToken 
        })
        // user is logged in at this point
    }else {
        res.status(401)
        throw new Error('Invalid username or password')
    }

});

//@desc Register a new user
//route POST /api/users/
//@access Public
const registerUser = asyncHandler(async(req,res) => {
    const { username, password } = req.body

    if(!username||!password){
        res.status(400)
        throw new Error('Username and password are required to register.')
    };

    const userExists = await User.findOne({username : username}).exec()
    if(userExists){
        res.status(409)
        throw new Error('Username allready exists, try something else.')
    };

    // password is auto-hashed in the model so no need to create it here
    const user = await User.create({
        username,
        password
    });

    if(user){
        res.status(201).json({
            _id : user._id,
            username : user.username
        })
    }else {
        res.status(400)
        throw new Error({message: 'Invalid user data'})
    }
});


//@desc Logout  user
//route POST /api/users/logout
//@access Public
const logoutUser = asyncHandler(async(req,res) => {
    
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    // Delete refreshToken in db
    foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);;
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
    
});

//@desc Get refesh token
//route GET /api/users/refresh
//@access Public
const handleRefreshToken = async (req, res) => {

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

    const foundUser = await User.findOne({ refreshToken }).exec();

    // Detected refresh token reuse!
    if (!foundUser) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN,
            async (err, decoded) => {
                if (err) return res.sendStatus(403); //Forbidden
                console.log('attempted refresh token reuse!')
                const hackedUser = await User.findOne({ username: decoded.username }).exec();
                hackedUser.refreshToken = [];
                const result = await hackedUser.save();
                console.log(result);
            }
        )
        return res.sendStatus(403); //Forbidden
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN,
        async (err, decoded) => {
            if (err) {
                console.log('expired refresh token')
                foundUser.refreshToken = [...newRefreshTokenArray];
                const result = await foundUser.save();
                console.log(result);
            }
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);

            // Refresh token was still valid
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN,
                { expiresIn: '10s' }
            );

            const newRefreshToken = jwt.sign(
                { "username": foundUser.username },
                process.env.REFRESH_TOKEN,
                { expiresIn: '5s' }
            );
            // Saving refreshToken with current user
            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            const result = await foundUser.save();

            // Creates Secure Cookie with refresh token
            res.cookie('jwt', newRefreshToken, { 
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                maxAge: 24 * 60 * 60 * 1000 
            });

            res.json({ roles, accessToken })
        }
    );
}

// @desc Get user profile
// route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async(req,res) => {
    
    const requestedID = req.body._id
    const user = await User.findOne({ 
        _id: requestedID
    }).exec();
    
    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json(user)
    
});

// @desc Update user profile
// route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async(req,res) => {

    if(!req.body.id) throw new Error('You need to provide an id of the user')
    const user = await User.findOne({ _id: req.body._id }).exec()

    if(user) {

        if(req.body?.username) user.username = req.body.username || user.username
        if(req.body?.password) user.password = req.body.password || user.password
    
        const updatedProfile = await user.save()

        res.json({
            _id: updatedProfile._id,
            username: updatedProfile.username,
            updatedAt: updatedProfile.updatedAt
        })

        
    }else {
        return res.status(204).json({
            'message' : `User not found!`
        })
    }

});

module.exports = {
    authUser,
    registerUser,
    logoutUser,
    handleRefreshToken,
    getUserProfile,
    updateUserProfile
};