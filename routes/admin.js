var passport = require('passport');
var Account = require('../models/db_Account');
var Article = require('../models/db_Article');

module.exports = function(app, appData) {
    
    app.route('/admin')
        // GET - accueil admin
        .get(connected, function (req, res) {
            // Récupérer les articles
            Article.find({}).sort({id: 'desc'}).exec(function (err, articles) {
                res.render('admin/', { user: req.user, articles: articles });
            });
        });


    app.route('/admin/login')
        // GET - formulaire de connexion back-end
        .get(function (req, res) {
            res.render('admin/login');
        })
        // POST - login (authentification)
        .post(passport.authenticate('local'), function (req, res) {
            res.redirect('/admin');
        });
    

    app.route('/admin/pass')
        // GET - formulaire du changement de mdp 
        .get(connected, function (req, res) {
            res.render('admin/pass', { user: req.user });
        })
        // POST - changement du pass
        .post(passport.authenticate('local', { 
                failureRedirect: '/admin/pass',
            }), function (req, res) {
                if (req.body.newpassword) {
                    Account.findByUsername(req.user.username, function (err, account) {
                        account.setPassword(req.body.newpassword, function (err) {
                            if (err) {
                                console.log(err);
                            } else {
                                account.save();
                            }
                        })
                    });
                } else {
                    return res.render('admin/pass', { user: req.user });
                }
                res.redirect('/admin');
            });
    

    app.route('/admin/logout')
        // GET - déconnexion back-end
        .get(function (req, res) {
            req.logout();
            res.redirect('/admin');
        });
};

var connected = function (req, res, next) {
    if (req.user) {
        return next();
    } else {
        res.redirect('/admin/login');
    }
}
