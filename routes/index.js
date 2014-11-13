module.exports = function(app, appData) {
    // GET - Accueil
    app.get('/', function (req, res) {
        res.render('index', { 'title': appData.title });
    });
};
