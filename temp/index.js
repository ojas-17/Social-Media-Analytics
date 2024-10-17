const express = require('express');
const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const app = express();

// Set up session middleware
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' https://vercel.live https://connect.facebook.net;");
  next();
});


// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport with Facebook strategy
passport.use(new FacebookStrategy({
    clientID: '1047685123192239',
    clientSecret: '58e8d193734fb9e6360b719e4d67ee4e',
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'email'] // Fields you want
  },
  (accessToken, refreshToken, profile, done) => {
    // Here you can save user details in the database if needed
    return done(null, profile);
  }
));

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Route for Facebook authentication
app.get('/auth/facebook', passport.authenticate('facebook'));

// Callback route
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect home or send user data
    res.redirect('/profile');
  }
);

// Profile route
app.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.json(req.user); // Return user details
});

// Start server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
