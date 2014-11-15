var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var Article = new Schema({
	code: String,
	titre: String,
	auteur: String,
	date: Date
});

module.exports = mongoose.model('Article', Article);