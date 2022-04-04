const userModel = require("../models/userModel");
const validator = require("../utils/validator");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
    let requestBody = req.body;
    if (Object.keys(requestBody).length === 0) {
      return res
        .status(400)
        .json({
          status: false,
          msg: `Invalid Request. Please input data in the body`,
        });
    }

    const { title, name, phone, email, password, address } = requestBody;

    if (!requestBody.title) {
      return res
        .status(400)
        .json({ status: false, msg: `title is mandatory field!` });
    }
    if (!validator.isValidTitle(title)) {
      return res
        .status(400)
        .json({ status: false, msg: `title must be Mr, Mrs or Miss!` });
    }

    if (!requestBody.name) {
      return res
        .status(400)
        .json({ status: false, msg: `name is mandatory field!` });
    }
    if (!validator.isValidString(name)) {
      return res
        .status(400)
        .json({ status: false, msg: `name is mandatory field!` });
    }
    if (!requestBody.phone) {
      return res
        .status(400)
        .json({ status: false, msg: `phone is mandatory field!` });
    }

    if (!validator.isValidString(phone)) {
      return res
        .status(400)
        .json({ status: false, msg: `phone is mandatory field!` });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res
        .status(400)
        .json({ status: false, msg: `Invalid Phone Number!` });
    }
    const isPhoneAlreadyUsed = await userModel.findOne({ phone: phone });
    if (isPhoneAlreadyUsed) {
      return res
        .status(400)
        .send({ status: false, message: `${phone} is already registered` });
    }

    if (!requestBody.email) {
      return res
        .status(400)
        .json({ status: false, msg: `email is mandatory field!` });
    }
    if (!validator.isValidString(email)) {
      return res
        .status(400)
        .json({ status: false, msg: `email is mandatory field!` });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json({ status: false, msg: `Invalid eMail Address!` });
    }
    const isEmailAlreadyUsed = await userModel.findOne({ email: email });
    //console.log(isEmailAlreadyUsed)
    if (isEmailAlreadyUsed) {
      return res
        .status(400)
        .send({ status: false, message: `${email} is already registered!` });
    }

    if (!requestBody.password) {
      return res
        .status(400)
        .json({ status: false, msg: `password is mandatory field!` });
    }
    if (!validator.isValidString(password)) {
      return res
        .status(400)
        .json({ status: false, msg: `password is mandatory field!` });
    }
    if (validator.isValidPassword(password)) {
      return res
        .status(400)
        .json({ status: false, msg: `password must be 8-15 characters long!` });
    }

    if (!requestBody.address) {
      return res
        .status(400)
        .json({ status: false, msg: `address is mandatory field!` });
    }
    if (!validator.isValidString(address)) {
      return res
        .status(400)
        .json({ status: false, msg: `address is mandatory field!` });
    }

    const users = await userModel.create(requestBody);
    return res
      .status(201)
      .json({
        status: true,
        msg: `User registered successfully!`,
        data: users,
      });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

const userLogin = async (req, res) => {
  try {
    let requestBody = req.body;
    if (Object.keys(requestBody).length === 0) {
      return res
        .status(400)
        .json({
          status: false,
          msg: `Invalid input. Please enter email and password!`,
        });
    }
    const { email, password } = requestBody;

    if (!requestBody.email) {
      return res
        .status(400)
        .json({ status: false, msg: `email is mandatory field!` });
    }
    if (!validator.isValidString(email)) {
      return res
        .status(400)
        .json({ status: false, msg: `email is mandatory field!` });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json({ status: false, msg: `Invalid eMail Address!` });
    }
    if (!requestBody.password) {
      return res
        .status(400)
        .json({ status: false, msg: `password is mandatory field!` });
    }
    if (!validator.isValidString(password)) {
      return res
        .status(400)
        .json({ status: false, msg: `password is mandatory field!` });
    }

    const findUser = await userModel.findOne({
      email: email,
      password: password,
    });
    if (!findUser) {
      return res
        .status(401)
        .json({ status: false, msg: `Invalid email or password!` });
    }

    const token = jwt.sign(
      {
        userId: findUser._id,
        iat : Math.floor(Date.now()/1000),
        exp:Math.floor(Date.now()/1000)+60*60*60
      },
      "thorium@group23", 
    );

    res.setHeader("x-api-key", token);
    res
      .status(201)
      .json({ status: true, msg: `user login successful`, data: token });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

module.exports = {
  createUser,
  userLogin,
};
