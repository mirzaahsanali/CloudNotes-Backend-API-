const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/cloud-notes"; //link for the database

const connectToMongo = async () => {
	try {
        // mongoose.connect is a method to connect to mongoDB
		await mongoose.connect(mongoURI);
		console.log("Connected to MongoDB successfully");
	} catch (error) {
		console.error("Error connecting to MongoDB:", error);
	}
};

module.exports = connectToMongo;
