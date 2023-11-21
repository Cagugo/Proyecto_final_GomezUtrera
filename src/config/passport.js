const passport = require('passport');
const { Cart } = require('../models/carts');
const GitHubStrategy = require('passport-github2');
const { config } = require('.');
const { usersServices } = require('../repositories/index');
const initializePassport = () => {
  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: `${config.github_client_id}`,
        clientSecret: `${config.github_secret_key}`,
        callbackURL: `${config.github_callback_url}`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await usersServices.findOne({ email: profile._json.email });
          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: 'GitHub user',
              email: profile._json.email,
              password: '[]',
              platform: 'github',
            };
            let result = await usersServices.create(newUser);
            const userCart = new Cart({
              user: result._id,
              products: [],
            });
            await userCart.save();
            result.cart = userCart._id;
            await result.save();
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    let user = await usersServices.findById(id);
    done(null, user);
  });
};
module.exports = initializePassport;
