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
    if (username == 'admin' && password == 'admin') {
			return done(null, {'id': 'admin', 'password' : 'admin'});
		}
		else if (username == 'student' && password == 'student') {
			return done(null, {'id': 'student', 'password' : 'student'});
		}
		 else {
			return done(null, false);
		}
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	if(id == 'admin') {
		done(null, {'id': 'admin', 'password' : 'admin'});
	} else if (id == 'student') {
		done(null, {'id': 'student', 'password' : 'student'});
	}
});

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(fileUpload());



// intercept Basic auth in case the api is being used without client cookies.
app.all('/api/*', (req,res,next) => {
	if(req.isAuthenticated()){
    next();
  } else {
    console.log(new Date() + ` not yet authenticated for: ${req.path}`);
    passport.authenticate('local', function(err, user) {
			if (req.user.id == 'admin') {
				req.login({ id: 'admin', password: 'admin' },{ session: false }, function(err) {
						if(err) {return next(err)}
						next()
				})
			} else {
				req.login({ id: 'student', password: 'student' },{ session: false }, function(err) {
						if(err) {return next(err)}
						next()
				})
			}

    })(req, res, next)
  }
});

// render login page with any flash error messages
app.get('/login', (req,res) => {
	let flashMsg = req.flash();
	res.render(path.join(process.cwd(), 'src', 'components','login.ejs'),{flash: flashMsg});
});

// after passport serializes user object
app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
		if(req.user.id == 'admin') {
			res.redirect('view_projects');
		} else if (req.user.id == 'student') {
			res.redirect('select_projects')
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
