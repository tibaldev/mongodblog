var Article = require('../models/db_Article');

module.exports = function(app, appData) {
    
    app.route('/')
        // GET - Accueil
        .get(function (req, res) {

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


    app.route('/article/:id')
        // GET - Vue d'un article 
        .get(function (req, res) {
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

    app.route('/cv-thibaud-tallon')
        // GET - Page du profil / CV
        .get(function (req, res) {
            res.render('profil', {});
        });
};
