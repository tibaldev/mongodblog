// Gestion des articles (ajout / suppression / modification) + vue
var Article = require('../models/db_Article');

module.exports = function(app, appData) {

    // GET - gestion du test (ajout dans le fichier article/test.jade)
    app.get('/admin/addtest?:data', function(req, res) {

        if (req.query['data'] && req.user) {
            var text = JSON.parse(req.query['data']);

            var fs = require('fs');
            fs.writeFile(app.get('views') + '/article/test.jade', text);

            // delay pour prise en compte du fichier (200 marche, 500 securité)
            setTimeout(function(){ res.render('article/test') }, 500);
        
        } else {
            res.redirect('/admin');
        }
    });

    // POST - ajout d'un article
    app.post('/admin/article/add', function (req, res) {
        if (req.body.textvalue && req.body.titre && req.user && req.body.urljade) {
            var titre = req.body.titre;
            var urljade = req.body.urljade;
            var text = JSON.parse(req.body.textvalue);

            var id = Date.now() + '-' + urljade;
            var date = convertDate(new Date());

            var fs = require('fs');
            // Ajout de l'article (pour la vue article)
            fs.writeFile(app.get('views') + '/article/' + id + '.jade', text);

            var article = new Article ({
                id: id,
                urljade: urljade,
                titre: titre,
                auteur: req.user.username,
                date: date,
                datemodif: date
            });

            article.save(function (err, article) {
                if (err) return console.error(err);
            });
        }
        res.redirect('/admin');
    });

    // GET - suppression d'un article
    app.get('/admin/article/remove/:id', function (req, res) {
    	if (req.user && req.params.id) {

    		var id = req.params.id;
    		var fs = require('fs');
    		fs.unlink(app.get('views') + '/article/' + id + '.jade');

			Article.find({ id : id }).remove().exec();
    	}
    	res.redirect('/admin');
    });

    // GET - page de modification d'un article
    app.get('/admin/article/edit/:id', function (req, res) {
        if (req.user && req.params.id) {
            var id = req.params.id;
            
            fs = require('fs');
            fs.readFile(app.get('views') + '/article/' + id + '.jade', 'utf8', function (err, data) {
                Article.findOne({ id : id }, function (err, article) {
                    res.render('admin/edit', { user: req.user, article: article, contenu: data });
                });
            });

        }
    });

    // POST - modification d'un article
    app.post('/admin/article/edit', function (req, res) {
        if (req.user && req.body.id) {
            var exid = req.body.id;

            if (req.body.textvalue && req.body.titre && req.user) {
                
                // traitement nouvel article
                var titre = req.body.titre;
                var urljade = req.body.urljade;
                var text = JSON.parse(req.body.textvalue);

                var id = exid.split('-')[0] + '-' + urljade;
                var date = req.body.date;
                var datemodif = convertDate(new Date());


                // suppression de l'ancien
                var fs = require('fs');
                fs.unlink(app.get('views') + '/article/' + exid + '.jade');

                Article.find({ id : exid }).remove().exec();

                // ajout du modifié
                var fs = require('fs');
                fs.writeFile(app.get('views') + '/article/' + id + '.jade', text);

                var article = new Article ({
                    id: id,
                    urljade: urljade,
                    titre: titre,
                    auteur: req.user.username,
                    date: date,
                    datemodif: datemodif
                });

                article.save(function (err, article) {
                    if (err) return console.error(err);
                });
            }
        }
        res.redirect('/admin');
    });
};

// format dd/MM/yyyy
function convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
}
