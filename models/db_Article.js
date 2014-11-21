var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var Article = new Schema({
	id: String,
	titre: String,
	auteur: String,
	date: String,
    datemodif: String
});

module.exports = mongoose.model('Article', Article);