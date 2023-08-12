import * as passportLocal from 'passport-local';
import User from "../../models/User";
import passport from "passport";
const LocalStrategy = passportLocal.Strategy;

//Called during login/sign up:
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser((user:any, done)=>{
    console.log(user);
    return done(null, user._id)
})
