import { authCopy } from "./authCopy";

const messagesByCallbackError: Record<string, string> = {
  account_not_linked: authCopy["error.social.accountExists"],
  access_denied: authCopy["error.social.cancelled"],
  state_mismatch: authCopy["error.social.expired"],
  state_not_found: authCopy["error.social.expired"],
  invalid_callback_request: authCopy["error.social.expired"],
  invalid_code: authCopy["error.social.expired"],
  no_code: authCopy["error.social.expired"],
  email_not_found: authCopy["error.social.noEmail"],
  email_not_verified: authCopy["error.social.noEmail"],
};

export function socialErrorMessage(callbackError: string): string {
  return messagesByCallbackError[callbackError] ?? authCopy["error.social"];
}
