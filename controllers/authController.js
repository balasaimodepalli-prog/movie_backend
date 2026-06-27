import bcrypt from 'bcryptjs';
import generateToken from '../utils/tokenGenerator.js';
import User from '../models/user.js';


const signUp = async (req, res) => {
    try {
        const requestedUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        const existingUser = await User.findOne({ email: requestedUser.email });
        if (existingUser) {
            return res.status(400).send('user alredy exists');
        }
        const hashedPassword = await bcrypt.hash(requestedUser.password, 10);


        const newUser = await User.create({
            name: requestedUser.name,
            email: requestedUser.email,
            password: hashedPassword
        })
        const token = generateToken(newUser._id);

        return res.status(201).json({ newUser, token })

    }
    catch (err) {
        return res.status(500).send("error:" + err.message)
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).send('user not found')
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send('Invalid credintials');
        }
        const token = generateToken(user._id);
        return res.json({ user, token })
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).send('user not found');
        }
        return res.json(user);
    }
    catch (err) {
        return res.status(500).send('error: ' + err.message);
    }
}

export { signUp, login, getMe };