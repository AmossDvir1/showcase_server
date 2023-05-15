import passport from "passport";
import { Strategy as JwtStrategy, StrategyOptions } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import User from "../../models/User";
import { User as UserType } from "../../models/User";

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: ExtractJwt.fromAuthHeaderAsBearerToken().toString(),
};

// Used by the authenticated requests to deserialize the user,
// i.e., to fetch user details from the JWT.
passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    console.log(jwt_payload);
    // Check against the DB only if necessary.
    // This can be avoided if you don't want to fetch user details in each request.
    User.findOne({ userId: jwt_payload._id }, function (err:any, user:UserType) {
      if (err) {
        console.log(err);
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    });
  })
);
