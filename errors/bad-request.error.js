import ApiError from "./api-error.js";
import StatusCodes from "http-status-codes";
export default class BadRequestError extends ApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
