const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, USER_NAME, PASSWORD } = require("../keys");
const requiredLogin = require("../middelware/requiredLogin");
var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: USER_NAME,
    pass: PASSWORD,
  },
});

router.post("/signup", (req, res) => {
  const { name, email, password, username } = req.body;
  if (!email || !name || !password || !username) {
    return res.status(422).json({ error: "Pelase providee valid details" });
  } else {
    User.findOne({ email: email })
      .then((savedUser) => {
        if (savedUser)
          return res.status(422).json({ error: "User already exists" });

        bcrypt.hash(password, 12).then((hashedPassword) => {
          const user = new User({
            email,
            password: hashedPassword,
            name,
            username,
          });
          user
            .save()
            .then((user) => {
              res.json({ message: "Signed up successfully" });
            })
            .catch((err) => {
              console.log(err);
            });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({ error: "Please provide all details" });
  }
  User.findOne({ email: email }).then((savedSUer) => {
    if (!savedSUer) {
      res.status(422).json({ error: "Please providee valid details" });
    }
    bcrypt
      .compare(password, savedSUer.password)
      .then((doMatch) => {
        if (doMatch) {
          //  res.json({message:'Successfully Signed in'})
          const token = jwt.sign({ _id: savedSUer._id }, JWT_SECRET);
          const { _id, name, email, followers, following, pic } = savedSUer;
          res.json({
            token,
            user: { _id, name, email, followers, following, pic },
          });
        } else {
          res.status(422).json({ error: "Please provide valid details" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

router.post("/reset-password", (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res
          .status(422)
          .json({ error: "User dont exists with that email" });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      user.save().then((result) => {
        transporter.sendMail({
          to: user.email,
          from: "YOUR_MAILID",
          subject: "password reset",
          html: `
                    <p>You requested for password reset</p>
                    <h5>click in this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5>
                    `,
        });
        res.json({ message: "check your email" });
      });
    });
  });
});

router.post("/new-password", (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  //Expire token date must be greater than current date
  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: "Try again session expired" });
      }
      bcrypt.hash(newPassword, 12).then((hashedpassword) => {
        user.password = hashedpassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((saveduser) => {
          res.json({ message: "password updated success" });
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
