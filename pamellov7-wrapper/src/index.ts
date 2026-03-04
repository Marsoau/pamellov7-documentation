import { PamelloClient } from "./PamelloClient";

export { PamelloClient } from "./PamelloClient";
export { PamelloRequestsService as PamelloRequests } from "./Requests/PamelloRequestsService";
export { UserRequiredError } from "./Errors/UserRequiredError";

export const pamelloClient = new PamelloClient();
