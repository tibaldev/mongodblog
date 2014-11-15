/** --- MODULES --- **/
var path           = require('path'),
	express        = require('express'), 
    http           = require('http'), 
    bodyParser     = require('body-parser'),
    session        = require('express-session'),
    methodOverride = require('method-override'),
    errorHandler   = require('errorhandler'),
    mongoose       = require('mongoose'),
    passport       = require('passport'),
    app            = express(),
    appData        = require('./config/config.js');


/** --- CONFIGURATION --- **/
app.set('port', process.env.PORT || appData.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('env', 'development');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
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
//app.get('*', function(req, res) { res.send('Cette page n\'existe pas :)', 404) });


/** --- SERVEUR --- **/
if ('development' == app.get('env')) {
 	app.use(errorHandler());
}
app.listen(app.get('port'));
