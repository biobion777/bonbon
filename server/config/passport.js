const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const mongoose = require('mongoose')
const configAuth = require('./config').auth

const User = mongoose.model('User')

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, done)
    })

    // Google strategy
    passport.use(new GoogleStrategy(configAuth.google, (token, refreshToken, profile, done) => {
        process.nextTick(() => {
            User.findOne({'google.id': profile.id}, (err, user) => {
                if (err) {
                    return done(err)
                }

                if (user) {
                    return done(null, user)
                }

                const newUser = new User()

                newUser.google = {
                    id: profile.id,
                    token,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    gender: profile.gender,
                }

                newUser.save((_err) => {
                    if (_err) {
                        return done(_err)
                    }

                    return done(null, newUser)
                })
            })
        })
    }))
}
