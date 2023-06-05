import ApiError from "./api-error.js";
import { StatusCodes } from "http-status-codes";
export default class UnauthenticatedError extends ApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
