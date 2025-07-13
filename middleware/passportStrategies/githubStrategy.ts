import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { PassportStrategy } from "../../interfaces/index";
import { Request } from "express";
import { database } from "../../models/userModel";

const githubStrategy: GitHubStrategy = new GitHubStrategy(
  {
    clientID: "Ov23liDpMCDbrbmiFflu",
    clientSecret: "afe8c74923e80b6332573d74f34b57674eea9e93",
    callbackURL: "http://localhost:8000/auth/github/callback",
    passReqToCallback: true,
  },

  async (
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any) => void
  ) => {
    const existingUser = database.find(
      (user) => user.id === parseInt(profile.id)
    );

    if (existingUser) {
      return done(null, existingUser);
    }

    const newUser = {
      id: parseInt(profile.id),
      name: profile.displayName || profile.username || "GitHub User",
      email: `${profile.username || "github"}@github.com`,
      password: "",
      role: "admin",
    };

    database.push(newUser);
    return done(null, newUser);
    //return done(null, profile);
  }
);

passport.serializeUser((user: any, done: (error: any, id?: any) => void) => {
  done(null, user);
});

passport.deserializeUser(
  (user: any, done: (error: any, user?: any) => void) => {
    done(null, user);
  }
);

const passportGitHubStrategy: PassportStrategy = {
  name: "github",
  strategy: githubStrategy,
};

export default passportGitHubStrategy;
