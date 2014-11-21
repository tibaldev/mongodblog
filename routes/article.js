// Gestion des articles (ajout / suppression / modification) + vue
var Article = require('../models/db_Article');

module.exports = function(app, appData) {

    // GET - gestion du test (ajout dans le fichier articles/test.jade)
    app.get('/admin/addtest?:data', function(req, res) {

        if (req.query['data'] && req.user) {
            var text = JSON.parse(req.query['data']);

            var fs = require('fs');
            fs.writeFile(app.get('views') + '/articles/test.jade', text);

            // delay pour prise en compte du fichier (200 marche, 500 securité)
            setTimeout(function(){ res.render('articles/test') }, 500);
        
        } else {
            res.redirect('/admin');
        }
    });

    // POST - ajout d'un article
    app.post('/admin/article/add', function (req, res) {
        if (req.body.textvalue && req.body.titre && req.user) {
            var titre = req.body.titre;
            var text = JSON.parse(req.body.textvalue);

            var id = Date.now() + '-' + titre.split(' ').join('-');
            var date = convertDate(new Date());

            var fs = require('fs');
            fs.writeFile(app.get('views') + '/articles/' + id, text);

            var article = new Article ({
                id: id,
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
    		fs.unlink(app.get('views') + '/articles/' + id);

			Article.find({ id : req.params.id }).remove().exec();
    	}
    	res.redirect('/admin');
    });

    // GET - page de modification d'un article
    app.get('/admin/article/edit/:id', function (req, res) {
        if (req.user && req.params.id) {
            var id = req.params.id;
            
            fs = require('fs');
            fs.readFile(app.get('views') + '/articles/' + id, 'utf8', function (err, data) {
                Article.findOne({ id : id }, function (err, article) {
                    res.render('admin/edit', { user: req.user, article: article, contenu: data });
                });
            });

        }
    });

    // POST - modification d'un article
    // TODO - réutiliser les fonctionnalités existantes (suppression et ajout)
    app.post('/admin/article/edit', function (req, res) {
        if (req.user && req.body.articleid) {
            var exid = req.body.articleid;

            // suppression de l'article
            var fs = require('fs');
            fs.unlink(app.get('views') + '/articles/' + exid);

            Article.find({ id : exid }).remove().exec();
          
            // ajout du nouvel article
            if (req.body.textvalue && req.body.titre && req.user) {
                var titre = req.body.titre;
                var text = JSON.parse(req.body.textvalue);

                // nouvel id : on garde le timestamp de création, et on change la partie titre
                var id = exid.split('-')[0] + '-' + titre.split(' ').join('-');
                var date = req.body.articledate;
                var datemodif = convertDate(new Date());

                var fs = require('fs');
                fs.writeFile(app.get('views') + '/articles/' + id, text);

                var article = new Article ({
                    id: id,
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