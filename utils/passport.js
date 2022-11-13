const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
//const FacebookStrategy = require("passport-facebook").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");

const dotenv = require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// DECLARE GG, FB ID AND SECRET
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleSecretId = process.env.GOOGLE_CLIENT_SECRET;

const facebookAppId = process.env.FACEBOOK_APP_ID;
const facebookSecretId = process.env.FACEBOOK_APP_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleSecretId,
      callbackURL: "/api/auth/google/callback",
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
          let existingUser = await User.findOne({ 'email': profile.email });
          // if user exists return the user 
          if (existingUser) {
            return done(null, `user already exists ${existingUser}`);
          }
          // if user does not exist create a new user 
          console.log('Creating new user...');
          const newUser = new User({
            method: 'google',
              username: profile.displayName,
              gender: 1,
              password: '1111',
              email: profile.emails[0].value,
              accountType: 'google_account'
            
          });
          await newUser.save();
          return done(null, newUser);
      } catch (error) {
          return done(error, false)
      }
    }
  )
);

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: facebookAppId,
//       clientSecret: facebookSecretId,
//       callbackURL: "/facebook/callback",
//       profileFields: ['id', 'displayName', 'email', 'picture'],

//     },
//     function (accessToken, refreshToken, profile, done) {
//       done(null, profile);
//     }
//   )
// );

// passport.use(
//   new JWTStrategy(
//     {
//       jwtFromRequest: (req) => {
//         let token = null;
//         if (req && req.cookies) {
//           token = req.cookies.jwt;
//         }
//         return token;
//       },
//       secretOrKey: process.env.SESSION_SECRET,
//     },
//     (jwtPayload, done) => {
//       if (!jwtPayload) {
//         return done('No token found...');
//       }
//       return done(null, jwtPayload);
//     }
//   )
// );
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
      secretOrKey: "secretKey",
    },
    async (jwtPayload, done) => {
      try {
        const user = jwtPayload.user;
        done(null, user); 
      } catch (error) {
        done(error, false);
      }
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
