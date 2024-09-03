const jwt = require("jsonwebtoken");
const SECRET_KEY="kaoe76920fngrjddu75jgbx98w53bif8v";

//Authorization function
const fetchuser = async (req, res, next) => {
    // this "Authorization" contains the encoded final product of payload data and secret key and signature which was created duing logging in using jwt.sign() and was saved as authToken
    // it is like when you park your bike they give you a token and when later you try to access your bike they check if you have the same token they gave you if it matches they give you access. 
    // similarly when a user logs in the auth token is generated and saved to client local storage and when a user tries to access some protected data it matches the auth token before providing access.
	const token = req.header('Authorization');
	if(!token){
		return res.status(401).json({errorOccured: "Authorization error. Please Login"});
	}
    try {
        //this data is the data which was sent as payload
        const data = jwt.verify(token, SECRET_KEY);
        req.id = await data.user.id;
        next();
    } catch (error) {
        return res.status(401).json({errorOccured: "Authorization token mismatched. Please Login again"});
    }
}

module.exports = fetchuser;
