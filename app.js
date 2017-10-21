
/**
 * Module dependencies
 */

var express 	      = require('express'),
  	routes 		      = require('./routes'),
  	msgapi 		      = require('./routes/msgapi'),
    proapi 		      = require('./routes/proapi'),
    facapi          = require('./routes/facapi'),
    adminapi        = require('./routes/adminapi'),
  	http 		        = require('http'),
    hash            = require('bcrypt-nodejs'),
  	path 		        = require('path'),
    cookieParser    = require('cookie-parser'),
    bodyParser      = require('body-parser'),
    //expressSession  = require('express-session'),
    passport        = require('passport'),
    localStrategy   = require('passport-local' ).Strategy;
    mongoose        = require('mongoose');
const session       = require('express-session'),
    MongoStore      = require('connect-mongo')(session);

//mongoose.connect('mongodb://127.0.0.1/whatif:27017');
if(process.env.mongostring){
  console.log(process.env.mongostring);
  mongoose.connect(process.env.mongostring, { useMongoClient : true });
}
else {
  var config = require('./config/config.js');
  mongoose.connect(config.mongostring, { useMongoClient : true });
}

var Profile = require('./models/profiles');

var app = module.exports = express();

/**
* Configuration
*/

// configure express-session
// app.use(require('express-session')({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: false
// }));

// configure connect-mongo
app.use(session({
    secret: 'vleesmes',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
//app.use(express.bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// configure passport
passport.use(new localStrategy(Profile.authenticate()));
passport.serializeUser(Profile.serializeUser());
passport.deserializeUser(Profile.deserializeUser());

// development only
if (app.get('env') === 'development') {
   app.use(express.errorHandler());
};

// production only
if (app.get('env') === 'production') {
  // TODO
};

// Routes
app.get('/', routes.index);
app.get('/partials/:sub/:name', routes.partial);

// JSON API
app.get('/api/admin/msgstats', adminapi.msgstats);
app.get('/api/admin/prostats', adminapi.prostats);

app.get('/api/factories', facapi.getall);
app.get('/api/factories/:id', facapi.single);
app.get('/api/members/:val', proapi.members);
app.post('/api/factories', facapi.postfactory);
app.delete('/api/factories/:id', facapi.deletefactory);
app.put('/api/factories/:id', facapi.updatefactory);

//app.get('/api/name', api.name);
app.get('/api/frontpage', msgapi.frontpage);
app.get('/api/messages/:page.:limit', msgapi.getall);
//app.get('/api/messages', msgapi.getall);
//app.get('api/messages/search/:prop/:value', msgapi.getsearch);
app.post('/api/messages/search/:page.:limit', msgapi.search);
app.get('/api/messages/:entity/:id', msgapi.single);
app.post('/api/messages', msgapi.postmessage);
app.put('/api/messages/:id', msgapi.updatemessage);
app.delete('/api/messages/:id', msgapi.deletemessage);
app.post('/api/comments/:id', msgapi.postcomment);
app.post('/api/comments/single/:id', msgapi.postcommentsingle);
app.delete('/api/comments/:id', msgapi.deletecomment);
app.delete('/api/comments/single/:id', msgapi.deletecommentsingle);
app.put('/api/comments/:id', msgapi.updatecomment);

app.get('/api/profiles', proapi.getall);
app.get('/api/profiles/:id', proapi.single);
app.post('/api/profiles', proapi.postprofile);
app.put('/api/profiles/:id', proapi.updateprofile);
app.delete('/api/profiles/:id', proapi.deleteprofile);
app.get('/api/profiles/search_skill/:skill',proapi.search_skill);

app.post('/register', routes.register);
app.post('/login', routes.login);
app.get('/logout', routes.logout);
app.get('/status', routes.status);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

/**
* Start Server
*/

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
