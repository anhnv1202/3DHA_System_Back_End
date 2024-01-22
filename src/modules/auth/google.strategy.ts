import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: '1071360717856-28gkoj7cqh0fvue13j1kjhfsp0b1k6bq.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3001/api/auth/login-google',
      passReqToCallback: true,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { name, emails, displayName, photos } = profile;
      const user = {
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        name: `${name.familyName} ${name.givenName}`.trim(),
        username: displayName,
        avatar: photos[0].value,
      };
      return done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
}
