const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middlewares/fetchuser");
const SECRET_KEY = "kaoe76920fngrjddu75jgbx98w53bif8v";

//Route 1: Create a user
router.post(
	"/createuser",
	[
		body("name", "Name must be atleast 3 characters").isLength({min: 3}),
		body("email", "Please Enter a valid email").isEmail(),
		body("password", "Password must be atleast 8 characters").isLength({min: 8}),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (errors.isEmpty()) {
			let userFound = await User.findOne({ email: req.body.email });
			if (userFound) {
				return res
					.status(400)
					.json({ errorOccured: "User with this email already exists" });
			} else {
				//password encrytpion using bcrypt library.
				// this genSalt() generates random salt which is later added to the passwords so that if two users have same password they will not have the same salt so will have unique identities in DB.
				// (Salt means additional random gibberish added to the password to increase security)
				// (then bcrypt.hash(password, salt) runs a one-way function to hash the passwords and then salt is added to hashed format passwords , so that they can't be decrypted even if a hacker gets access to the DB passwords(hashed format), because he can't decrypt it because the bcrypt runs one-way encryption function which can't be reversed.)
				// (note: salt is not hashed but just combined to the password after the password is hashed)
				// only bcrypt.compare() function can compare the hashed format and then lets user login. even bcrypt can not reverse the hashed format of password into plaintext. what it does is it takes the user entered password and hash the entered password and then matches the hashed format to the encrypted data in DB by extracting the salt from that. if both matches that means both passwords are same.
				// note: bcrypt.hash() adds salt tp the hashed passwords in a specific format that bcrypt.compare() knows which of the final password form is salt and what is the hashed password. and then bcrypt.compare() seperates the salt and hashed password from DB and then hashes the password entered by user, and then matches the both password hash.if both match that means user entered correct password.
				const salt = await bcrypt.genSalt(10);
				const encryptedPass = await bcrypt.hash(req.body.password, salt);
				let userCreated = await User.create({
					name: req.body.name,
					email: req.body.email,
					password: encryptedPass,
				});
				const payload = {
					user:{
						id: userCreated.id,
					}
				};
				//auth token described in comment below.
				const authToken = jwt.sign(payload, SECRET_KEY);
				res.json({
					result: "new user created successfully",
					name: userCreated.name,
					email: userCreated.email,
					password: "completely encrypted",
					authorizationKey: authToken,
				});
			}
		} else {
			return res.status(400).json({ errorOccured: errors.array() });
		}
	}
);

//Route 2: Login a user
router.post(
	"/login",
	[
		body("email", "Enter a valid Email").isEmail(),
		body("password", "Please enter a password").isLength({ min: 8 }),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (errors.isEmpty()) {
			const email = req.body.email;
			const password = req.body.password;
			let userFound = await User.findOne({ email });
			if (userFound) {
				const passwordMatched = await bcrypt.compare(password, userFound.password);
				if (passwordMatched) {
					const payload = {
						user:{
							id: userFound.id,
						}
					};
					// this authToken is saved in client side as metadata in localStorage
					// this can be accessed in middlewares by req.headers['authorization]
					const authToken = jwt.sign(payload, SECRET_KEY);
					// jwt.sign() authToken Generation
					// jwt.sign() will take the payload data and secret key and sign it with encoded signature and final product will be an authorization token which can be used to check if the current user is having same payload data as the one who logged in. means he is not pretending to be some other user by changing payload data , if payload data is tampered then the authorization Token also changes and thus when server tries to check if the user is the same who logged in, his token does not matches the token which server saved during logging in and thus provokes user access.
					//these security checks are conducted when a user tries to visit a protected route. i;e: in our app the notes route is protected for only loggedin users can see only their data so the server will check if the user trying to access the notes is logged in with same userId whose notes he's tring to access.
					res.json({
						result: "login successful",
						name: userFound.name,
						email: userFound.email,
						authorizationKey: authToken,
					});
				} else {
					res.status(400).json({
						errorOccured: "Sorry! password does not match",
					});
				}
			} else {
				res.status(400).json({
					errorOccured: "Sorry! user with this email does not exist",
				});
			}
		} else {
			return res.status(400).json({ errorOccured: errors.array() });
		}
	}
);

//Route 3: Authorization: Check if user info matches with login token //login required
router.post("/getuser", fetchuser, async (req, res) => {
	try {
		const userId = await req.id;
		const user = await User.findById(userId).select("_id name email");
		res.send(user);
	} catch (error) {
		res.status(500).send({ errorOccured: "Internal Server Error" });
	}
});

module.exports = router;
