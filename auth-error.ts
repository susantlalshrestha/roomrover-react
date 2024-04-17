import { AuthError } from "next-auth";

export default class AppAuthError extends AuthError {
  action?: string;

  constructor(message: string, action?: string) {
    super(message);
    this.action = action;
    this.message = message;
  }
}
