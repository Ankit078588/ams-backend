const User = require('../models/users');
const { generateToken, verifyTokenMiddleware } = require('../middlewares/jwt');



// 1. Register user
async function handleRegisterUser(req, res) {
    try {
        const { 
            email,
            password
        } = req.body;

        console.log('Rcvd...');
        console.log(email);
        console.log(password);
        
        

        // Check all parameters are recieved or not 
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        // Check if email is already registered
        let userFound = await User.findOne({ email: email });
        if (userFound) { return res.status(404).json({ message: 'Email is already registered' }); }

        // Create new user
        const newUser = await User.create({
            email,
            password
        });

        return res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// 2. Login user
async function handleLoginUser(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) { return res.status(400).json({ message: 'Please enter both email and password' }); }

        // Check user exists OR not
        let user = await User.findOne({ email: email });
        if (!user) { return res.status(404).json({ message: 'User not found' }); }

        const isPasswordMatch = await user.comparePassword(password);
        if (isPasswordMatch) {
            const payload = { email: user.email, id: user._id, role: 'user' };
            const token = generateToken(payload);
            return res.status(200).json({ token, userId: user._id, name: user.name });
        } else {
            return res.status(404).json({ message: 'Incorrect sponsorId OR password.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// 3. Get user details
async function handleGetUserDetails(req, res) {
    try {
        const { email } = req.userPayload;
        // console.log(req.userPayload.email);
        
        if (!email) { return res.status(400).json({ message: 'Email is missing.' }); }

        // Check user exists OR not
        let user = await User.findOne({ email: email });
        if (!user) { return res.status(404).json({ message: 'User not found' }); }

        return res.status(200).json({ user: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



module.exports = {
    handleRegisterUser,
    handleLoginUser,
    handleGetUserDetails
}
