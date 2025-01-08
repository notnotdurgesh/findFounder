const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const Developer = require('../models/developer');
require('dotenv').config();

// Check if required environment variables are present
if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
  console.error('Missing required GitHub OAuth credentials in environment variables');
  process.exit(1);
}

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "https://findfounderbe-production.up.railway.app/developer/auth/github/callback",
      scope: ['user:email'] 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let developer = await Developer.findOne({ githubId: profile.id });
        
        if (!developer) {
          // Get primary email or first available email
          const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;
          
          developer = await Developer.create({
            githubId: profile.id,
            name: profile.displayName || profile.username,
            email: email,
            avatarUrl: profile.photos?.[0]?.value,
            bio: profile._json.bio || '', 
            location: profile._json.location || '',
            company: profile._json.company || '',
            blog: profile._json.blog || '',
            githubUrl: profile._json.html_url,

          });
        }
        
        return done(null, developer);
      } catch (err) {
        console.error('GitHub auth error:', err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((developer, done) => {
  done(null, developer.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const developer = await Developer.findById(id);
    done(null, developer);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;