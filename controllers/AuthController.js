const { generateToken } = require('../config/jwToken');
const User = require('../models/userModel');


class AuthController {
  // [POST] /auth/register
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
        throw new Error("Email Already Exists");
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // [POST] /auth/login
  async login(req, res) {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    if (findUser && await findUser.isPasswordMatched(password)) {
      res.status(200).json({
        _id: findUser?._id,
        firstname: findUser?.firstname,
        lastname: findUser?.lastname,
        email: findUser?.email,
        mobilename: findUser?.mobilename,
        token: generateToken(findUser?._id)
      })
    } else {
      throw new Error("Invalid Credentials")
    }
  }
}

module.exports = new AuthController();
