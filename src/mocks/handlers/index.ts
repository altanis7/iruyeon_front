import { authHandlers } from "./auth.handlers";
import { profileHandlers } from "./profile.handlers";
import { clientHandlers } from "./client.handlers";
import { matchHandlers } from "./match.handlers";

export const handlers = [
  ...authHandlers,
  ...profileHandlers,
  ...clientHandlers,
  ...matchHandlers,
];
