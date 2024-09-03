const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotesSchema = new Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
			required: true
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		tag: {
			type: String,
		},
		timestamp: {
			type: Date,
			default: Date.now,
		},
	},
	{ collection: "notes" }
);

const Note = mongoose.model("notes", NotesSchema);
Note.createIndexes();
module.exports = Note;
