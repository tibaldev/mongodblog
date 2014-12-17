/** --- MODULES --- **/
var path           = require('path'),
    express        = require('express'), 
    http           = require('http'),
    formidable     = require('formidable'),
    fs             = require('fs'),
    bodyParser     = require('body-parser'),
    session        = require('express-session'),
    errorHandler   = require('errorhandler'),
    mongoose       = require('mongoose'),
    passport       = require('passport'),
    app            = express(),
    appData        = require('./config/config.js');


/** --- CONFIGURATION --- **/
app.set('port', process.env.PORT || appData.port);
app.set('views', __dirname + '/views');
app.set('public', __dirname + '/public');
app.set('view engine', 'jade');
app.set('env', appData.env);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({secret: 'abitbol', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));


/** --- PASSPORT --- **/
require('./script/passport')(passport);


/** --- MONGOOSE --- **/
mongoose.connect(appData.mongoconnect);


/** --- ROUTES --- **/
require('./routes/index.js')(app, appData);
require('./routes/admin.js')(app, appData);
require('./routes/article.js')(app, fs, formidable, appData);
app.get('*', function(req, res) { 
    res.status(404).render('404', { title: appData.title });
});

/** --- SERVEUR --- **/
if (app.get('env') == 'dev') {
    app.use(errorHandler());
}

app.listen(app.get('port'));
