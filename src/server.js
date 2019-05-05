import sirv from 'sirv';
const express = require('express')
import compression from 'compression';
import * as sapper from '../__sapper__/server.js';
const app = express()
const port = 3000
const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var flash = require('express-flash');
const ejs = require('ejs')
var session = require('express-session');
// file store for SESSIONS
var MemoryStore = require('session-memory-store')(session);
var db = require('./_sequelize/config/db.js');

app.use(
	session({
  	secret: 'csu-enrollment-project',
		store: new MemoryStore(),
  	resave: false,
  	saveUninitialized: false
	})
);

app.use(passport.initialize());
app.use(passport.session());
// template engine and flash support
app.use(flash());
app.engine('.ejs', ejs.renderFile);

passport.use(new Strategy(
  function(username, password, done) {
		db.User.findOne({ where: {csuid: username}}).then((user) => {
			if (user) {
				if (user.password == password) {
					return done(null, {'id': username, 'password' : password, 'type': user.user_type});
				}
			} else {
				console.log("Invalid user name / password");
				return done(null, false, { message : 'invalid e-mail address or password' });
			}
		})
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	db.User.findOne({ where: {csuid: id}}).then((user) => {
		done(null, {'id': user.csuid, 'password' : user.password, 'type': user.user_type });
	})
});

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(fileUpload());

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });


app.post('/api/addNewUser', (req, res,next) => {
	passport.authenticate('local', {failureFlash: true}, function(err, user) {
		req.login({ id: 'admin', password: 'admin' },{ session: false }, function(err) {
				if(err) {return next(err)}
				next()
		})
	})(req, res, next)
});

// intercept Basic auth in case the api is being used without client cookies.
app.all('/api/auth_req/*', (req,res,next) => {
	if(req.isAuthenticated()){
    next();
  } else {
    console.log(new Date() + ` not yet authenticated for: ${req.path}`);
    passport.authenticate('local', {failureFlash: true}, function(err, user) {
			db.User.findOne({ where: {csuid: user}}).then((user) => {
				if(user) {

					req.login({ id: user.csuid, password: user.password },{ session: false }, function(err) {
							if(err) {return next(err)}
							next()
					})
				}
			})
    })(req, res, next)
  }
});

// render login page with any flash error messages
app.get('/login', (req,res) => {
	let flashMsg = req.flash();
	res.render(path.join(process.cwd(), 'src', 'components','login.ejs'),{flash: flashMsg});
});

app.get('/new_user', (req,res) => {
	let flashMsg = req.flash();
	res.render(path.join(process.cwd(), 'src', 'components','new_user.ejs'),{flash: flashMsg});
});

// after passport serializes user object
app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login',  failureFlash: true }),
  function(req, res) {
		if(req.user.type == 'student') {
			res.redirect('selectProjects');
		} else if (req.user.type == 'admin') {
			res.redirect('viewProjects')
		}
  });


app.get('/logout', (req,res) => {
	  req.logout();
	  res.redirect('/');
});


// main route, handle sapper stuff after checking authentication.
// app.use(check, sapper({ manifest }));

app.use(
	function(req, res, next){
			if(req.isAuthenticated()){
				next();
			} else {
				res.redirect("/login");
			}
		},
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware()
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
