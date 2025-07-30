const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const db = require('../db/connect');

passport.serializeUser((user, done) => {
  // Serialize user ID to the session
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  // Deserialize user from the session
  const user = await db.getDb().collection('users').findOne({ _id: id });
  done(null, user);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL ?? 'https://digital-bookstore-api.onrender.com/auth/github/callback'

    },
    async (accessToken, refreshToken, profile, done) => {
      // This is the "verify" callback
      const dbInstance = db.getDb();
      const usersCollection = dbInstance.collection('users');

      try {
        // Find if the user already exists
        let user = await usersCollection.findOne({ githubId: profile.id });

        if (user) {
          // User exists, proceed to log them in
          return done(null, user);
        } else {
          // User doesn't exist, create a new user record
          const newUser = {
            githubId: profile.id,
            username: profile.username,
            displayName: profile.displayName,
            profileUrl: profile.profileUrl,
            // You might want to store more info from the profile object
          };
          
          const result = await usersCollection.insertOne(newUser);
          const createdUser = await usersCollection.findOne({ _id: result.insertedId });
          return done(null, createdUser);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);