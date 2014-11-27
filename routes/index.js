var Article = require('../models/db_Article');

module.exports = function(app, appData) {
    // GET - Accueil
    app.get('/', function (req, res) {
        // Récupérer les articles
        Article.find({}, function (err, articles) {
            Article.findOne({}).sort({id: 'desc'}).exec(function(err, article) {
                console.log(err)
                if (article && !err) {
                    res.render('article/' + article.id, { 'title': appData.title, articles: articles });
                } else {
                    res.render('article/aucun', { 'title': appData.title, articles: articles });
                }
            });
        });
    });

    app.get('/article/:id', function (req, res) {
        if (req.params.id) { 
            var id = req.params.id;
            Article.findOne({ id : id }, function (err, article) {
                if (article) {
                    Article.find({}, function (err, articles) {
                        res.render('article/' + id, { 'title': appData.title, articles: articles });
                    });
                } else {
                    res.status(404).render('404', { title: appData.title });
                }
            });
        }
    });

    app.get('/contact', function (req, res) {

    });    

    app.get('/cv', function (req, res) {

    });
};
