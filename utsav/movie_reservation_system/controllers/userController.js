const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail } = require("../models/user");
const signup =  async (req,res) => {
    const { name, email, password } = req.body;
    const existing = await getUserByEmail(email);
    if (existing) {
        return res.status(400).json({
            message:'email is alrady exist'
        })
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await createUser({
        name,
        email,
        password: hashed,
        role: "user"
    });
     res.status(201).json({ id: user.id, name: user.name, email: user.email });
}
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
        return res.status(400).json({ message: "Invalid credentions" })
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return res.status(400).json({ message: "Invalid credentions" });
    }
    const token = jwt.sign(
        {
            id: user.id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' },
    );
    res.json({token})

}
module.exports = {
    signup,login
}