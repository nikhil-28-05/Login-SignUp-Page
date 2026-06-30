const bcrypt = require("bcrypt");
const saltRound = 10;
const secretKey = process.env.JWT_SECRET || "acharya";
// console.log(secretKey)
const jwt = require("jsonwebtoken");
// const auth = require('../Middleware/auth')

let arr = []; //database

const register = (req, res) => {
  const data = req.body;

  const account = arr.find((item) => item.email === data.email);
  if (account) {
    return res.status(400).json({ msg: "This email already exists" });
  }

  //encrypt the password by hashing the password
  data.password = bcrypt.hashSync(data.password, saltRound);

  arr.push(data);

  const token = jwt.sign({ user: data.email }, secretKey); //jwt token generation

  res.status(201).json({ msg: "user Registered successfully", token: token });
};

const login = async (req, res) => {
  const data = req.body;

  const account = arr.find((item) => item.email === data.email);

  if (account) {
    const login = await bcrypt.compare(data.password, account.password);
    if (login) {
      const token = jwt.sign({ user: data.email }, secretKey, {
        expiresIn: "365d",
      });
      return res.json({ msg: "User Logged in successfully", token: token });
    } else {
      return res.status(400).json({ msg: "Password is incorrect" });
    }
  } else {
    return res.status(400).json({ msg: "user is not registered" });
  }
};

const home = (req, res) => {
  res.json({
    message: "This is Home page",
  });
};

const dashboard = (req, res) => {
  res.json({ msg: "Welcome to Dashboard" });
};

module.exports = { login, register, home, dashboard };



// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWJjQGdtYWlsLmNvbSIsImlhdCI6MTc4MjQ0ODAzOSwiZXhwIjoxODEzOTg0MDM5fQ.2F2F8gTtkZEbMOt55vO7yYvsRzcDh9VnzI_RB9cWEfE

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWJjQGdtYWlsLmNvbSIsImlhdCI6MTc4MjQ0ODA2NH0.uPiauSkMc280XG4pSJi5JnAG-tsYl0NBzC2m000s3xs