var Article = require('../models/db_Article');

module.exports = function(app, appData) {
    // GET - Accueil
    app.get('/', function (req, res) {

        // Récupérer les articles (pour la liste de gauche)
        Article.find({ enligne: true}).sort({id: 'desc'}).exec(function (err, articles) {
            // Article le plus récent pour la page d'accueil
            Article.findOne({ enligne: true }).sort({id: 'desc'}).exec(function (err, article) {
                if (article && !err) {
                    res.render('article/' + article.id, { 
                        'title': appData.title,
                        articles: articles,
                        article: article
                    });
                } else {
                    res.render('article/aucun', { 'title': appData.title, articles: articles });
                }
            });
        });
    });

    // GET - Vue d'un article 
    app.get('/article/:id', function (req, res) {
        if (req.params.id) { 
            var id = req.params.id;
            Article.findOne({ id : id, enligne: true }, function (err, article) {
                if (article) {
                    Article.find({ enligne: true }).sort({id: 'desc'}).exec(function(err, articles) {
                        res.render('article/' + id, {
                            'title': appData.title + ' - ' + article.titre, 
                            articles: articles,
                            article: article
                        });
                    });
                } else {
                    res.status(404).render('404', { title: appData.title });
                }
            });
        }
    });

    // GET - Page du profil / CV
    app.get('/profil', function (req, res) {
        res.render('profil', {});
    });
};
