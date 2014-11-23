var Article = require('../models/db_Article');

module.exports = function(app, appData) {
    // GET - Accueil
    app.get('/', function (req, res) {
        // Récupérer les articles
        Article.find({}, function (err, articles) {
            res.render('index', { 'title': appData.title, articles: articles });
        });
    });

    app.get('/contact', function (req, res) {

    });    

    app.get('/cv', function (req, res) {

    });
};
