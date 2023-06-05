import ApiError from "./api-error.js";
export default class PermissionsError extends ApiError {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}
