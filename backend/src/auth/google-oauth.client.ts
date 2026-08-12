// TODO: リファクタリング検討
import { OAuth2Client } from 'google-auth-library';
export function createGoogleOAuthClient() {
  return new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL,
  );
}
