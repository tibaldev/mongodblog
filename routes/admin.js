var passport = require('passport');
var Account = require('../models/db_Account');
var Article = require('../models/db_Article');

module.exports = function(app, appData) {
    
    // GET - accueil admin
    app.get('/admin', function (req, res) {
        if (req.user) {
            // Récupérer les articles
            Article.find({}, function (err, articles) {
                res.render('admin/', { user: req.user, articles: articles });
            });
        } else {
            res.render('admin/login');
        }
    });


    // GET - formulaire de connexion back-end
    app.get('/admin/login', function (req, res) {
        res.render('admin/login');
    });
    
    // GET - formulaire d'ajout d'admin 
    app.get('/admin/register', function (req, res) {
        res.render('admin/register');
    });

    // GET - déconnexion back-end
    app.get('/admin/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    // POST - login (authentification)
    app.post('/admin/login', passport.authenticate('local'), function (req, res) {
        res.redirect('/admin');
    });

    // POST - register (ajout du compte)
    app.post('/admin/register', function (req, res) {
        Account.register(
            new Account({ username : req.body.username }), req.body.password, function(err, account) {
            if (err) {
	            return res.render('admin/register', { account: account });
	        }

	        passport.authenticate('local')(req, res, function () {
	        	res.redirect('/admin');
	        });
	    });
	});
};
