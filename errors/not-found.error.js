import { StatusCodes } from "http-status-codes";
import ApiError from "./api-error.js";

export default class NotFoundError extends ApiError {
  constructor(message) {
    super(message);
    this.StatusCode = StatusCodes.NOT_FOUND;
  }
}
