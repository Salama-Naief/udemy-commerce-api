import passport from "passport";
import localAuth from "passport-local";

import userModal from "../models/user.modal.js";
import locaUserModal from "../models/local-user.modal.js";
import uploadImages from "../utils/upload-images.js";

//strategies
const localStrategy = localAuth.Strategy;

//serializeUser
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  done(null, user);
});

//register local user
passport.use(
  "local-signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true, // allows us to pass back the entire request to the callback
    },
    async function (req, email, password, done) {
      const { username } = req.body;
      console.log("body", req.body);
      console.log("files", req.files);
      const existUser = await userModal.findOne({ email: email });
      console.log("existUser", existUser);
      if (existUser) {
        return done(null, false, "this email is already registerd");
      } else {
        try {
          let user = null;
          let avatar = "";
          if (req.files && req.files.avatar) {
            avatar = await uploadImages(req.files.avatar);
            console.log("avatarImage", avatar);
          }
          const newUser = new locaUserModal({
            email,
            password,
            username,
            ...(avatar && { avatar: avatar }),
          });
          user = await newUser.save();

          return done(null, { userId: user._id });
        } catch (error) {
          console.log(error);
          return done(error);
        }
      }
    }
  )
);

//sigin local user
passport.use(
  "local-signin",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true, // allows us to pass back the entire request to the callback
    },
    async function (req, email, password, done) {
      const existUser = await locaUserModal
        .findOne({ email: email })
        .select("+password");
      console.log("existUser", existUser);
      if (!existUser) {
        return done(null, false, "this email is not registerd!");
      } else {
        try {
          const isMatch = await existUser.comparePassword(password);
          console.log("isMatch", isMatch);
          if (!isMatch) {
            return done(null, false, "wrong password!");
          }

          return done(null, { userId: existUser._id });
        } catch (error) {
          return done(error);
        }
      }
    }
  )
);

export default passport;
