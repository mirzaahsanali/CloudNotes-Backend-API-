const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middlewares/fetchuser");
const Note = require("../models/NotesSchema");

// Route 1: fetch notes of logged in user. //login required
router.get("/fetchusernotes", fetchuser, async (req, res) => {
	const notes = await Note.find({ userId: req.id });
	return res.status(200).json(notes);
});

// Route 2: add a note with logged in user id. //login required
router.post(
	"/addnote",
	fetchuser,
	[
		body("title", "Please enter a title").isLength({ min: 1 }),
		body("description", "Please enter a description").isLength({ min: 1 }),
		body("tag", "Please choose a valid tag").isIn([
			"General",
			"Todo",
			"Academic",
			"Personal",
			"Others",
		])
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (errors.isEmpty()) {
			const noteCreated = await Note.create({
				userId: req.id,
				title: req.body.title,
				description: req.body.description,
				tag: req.body.tag,
			});
			return res.status(200).json(noteCreated);
		} else {
			return res.status(400).json({ errorOccured: errors.array() });
		}
	}
);

// Route 3: update a note with logged in user id. //login required
router.put(
	"/updateusernote/:id",
	fetchuser,
	[
		body("title", "Please choose a title").isLength({ min: 1 }),
		body("description", "Please enter a description").isLength({ min: 1 }),
		body("tag", "Please choose a valid tag").isIn([
			"General",
			"Todo",
			"Academic",
			"Personal",
			"Others",
		])
	],
	async (req, res) => {
		const errors = validationResult(req);
		const { title, description, tag } = req.body;
		if (errors.isEmpty()) {
			let newNote = {};
			if (title && description && tag) {
				newNote = {
					title: title,
					description: description,
					tag: tag,
				};
			}else{
				return res.status(400).json({errorOccured: "Enter new note data"})
			}
			let noteFound = await Note.findById(req.params.id); //passed in the url params
			if (noteFound) {
				if (noteFound.userId.toString() === req.id) {
					noteFound = await Note.findByIdAndUpdate(req.params.id, {$set: newNote});
					const updatedNote = await Note.findById(noteFound.id)
					return res.status(200).json({ result: "Note Updated", updatedNote });
				}else{
					return res.status(401).json({errorOccured: "Note access not allowed"})
				}
			} else {
				return res.status(404).json({ errorOccured: "Note not found" });
			}
		} else {
			return res.status(400).json({ errorOccured: errors.array() });
		}
	}
);

// Route 4: delete a note with logged in user id. //login required
router.delete("/deleteusernote/:id", fetchuser, async (req, res) => {
	const deleteNote = await Note.findByIdAndDelete(req.params.id);
	if(deleteNote){
		if (deleteNote.userId.toString() === req.id) {
			return res.status(200).json({ result: "Note deleted Successfully", deleteNote });
		}else{
			return res.status(401).json({errorOccured: "Note access not allowed"})
		}
	}else{
		return res.status(404).json({ errorOccured: "Note not found" });
	}
});

module.exports = router;
