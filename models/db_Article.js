var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var Article = new Schema({
	id: String,
    urljade: String,
    titre: String,
	auteur: String,
	date: String,
    datemodif: String,
    enligne: Boolean
});

module.exports = mongoose.model('Article', Article);