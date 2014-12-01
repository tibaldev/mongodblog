// Gestion des articles (ajout / suppression / modification) + vue
var Article = require('../models/db_Article');

module.exports = function(app, fs, formidable, appData) {

    // POST - ajout d'un article (textarea jade)
    app.post('/admin/article/add', function (req, res) {
        if (req.body.textvalue && req.body.titre && req.user && req.body.urljade) {
            var titre = req.body.titre;
            var urljade = req.body.urljade;
            var text = JSON.parse(req.body.textvalue);

            var id = Date.now() + '-' + urljade;
            var date = convertDate(new Date());

            fs.writeFile(app.get('views') + '/article/' + id + '.jade', text);

            var article = new Article ({
                id: id,
                urljade: urljade,
                titre: titre,
                auteur: req.user.username,
                date: date,
                datemodif: date,
                enligne: false
            });

            article.save(function (err, article) {
                if (err) return console.error(err);
            });
        }
        res.redirect('/admin');
    });

    // POST - ajout d'un article (file upload)
    app.post('/admin/article/addfile', function (req, res) {
        if (req.user) {
            // formidable nécessaire pour parser forms mêlants file et text 
            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                if (!err) {
                    // récupération du contenu du fichier
                    fs.readFile(files.jadefile.path, 'utf8', function (err, data) {

                        // créer un fichier formaté et y ajouter le contenu
                        console.log(fields);
                        var titre = fields.titre;
                        var urljade = fields.urljade;
                        var id = Date.now() + '-' + urljade;
                        var date = convertDate(new Date());
                        fs.writeFile(app.get('views') + '/article/' + id + '.jade', data);

                        // ajouter les data en bd
                        var article = new Article ({
                            id: id,
                            urljade: urljade,
                            titre: titre,
                            auteur: req.user.username,
                            date: date,
                            datemodif: date,
                            enligne: false
                        });
                        article.save(function (err, article) {
                            if (err) return console.error(err);
                        });
                    });


                } else {
                    console.log(err);
                    res.redirect('/admin');
                }
            });
        }   
        res.redirect('/admin');
    });
    
    // GET - suppression d'un article
    app.get('/admin/article/remove/:id', function (req, res) {
    	if (req.user && req.params.id) {

    		var id = req.params.id;
    		
    		fs.unlink(app.get('views') + '/article/' + id + '.jade');

			Article.find({ id : id }).remove().exec();
    	}
        res.redirect('/admin');
    });

    // GET - vue d'un article hors-ligne
    app.get('/admin/article/:id', function (req, res) {
        if (req.params.id) { 
            var id = req.params.id;
            Article.findOne({ id : id, enligne: true }, function (err, article) {
                res.render('article/' + id, {
                    'title': appData.title, 
                    'h1': appData.title, 
                    article: article
                });
            });
        }
    });

    // GET - page de modification d'un article
    app.get('/admin/article/edit/:id', function (req, res) {
        if (req.user && req.params.id) {
            var id = req.params.id;

            fs.readFile(app.get('views') + '/article/' + id + '.jade', 'utf8', function (err, data) {
                Article.findOne({ id : id }, function (err, article) {
                    res.render('admin/edit', { user: req.user, article: article, contenu: data });
                });
            });
        } else {
    	   res.redirect('/admin');
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

                // suppression de l'ancien si différent
                fs.unlink(app.get('views') + '/article/' + exid + '.jade');
                Article.find({ id : exid }).remove().exec();

                // ajout du modifié
                fs.writeFile(app.get('views') + '/article/' + id + '.jade', text);

                var article = new Article ({
                    id: id,
                    urljade: urljade,
                    titre: titre,
                    auteur: req.user.username,
                    date: date,
                    datemodif: datemodif,
                    enligne: false
                });

                article.save(function (err, article) {
                    if (err) return console.error(err);
                });
            }
        }
        res.redirect('/admin');
    });

    // GET - mise en ligne d'un article
    app.get('/admin/article/online/:id', function (req, res) {
        if (req.user && req.params.id) {
            var id = req.params.id;

            Article.findOne({ id : id }, function (err, article) {
                
                article.enligne = true;
                article.save(function (err, article) {
                    if (err) return console.error(err);
                });
            });
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
