const User = require('../models/userModel');

class AuthController {
  // [POST] /register
  async register(req, res) {
    const { email } = req.body;
    const findUser = await User.findOne({ email });
    const newUser = await new User(req.body);

    try {
      if (!findUser) {
        // Create a new user
        const user = await newUser.save();
        res.status(200).json({ user });
      } else {
        res.status(400).json('Email Already Exists');
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new AuthController();
