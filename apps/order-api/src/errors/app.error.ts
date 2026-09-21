/**
 * Base application error.
 *
 * AppError represents an expected error that can safely be
 * converted into an HTTP response.
 *
 * Examples:
 * - Resource not found
 * - Invalid request
 * - Conflict
 * - Unauthorized request
 */
export class AppError extends Error {
  /**
   * HTTP status code associated with the error.
   */
  public readonly statusCode: number;

  /**
   * Indicates whether this is an expected operational error.
   */
  public readonly isOperational: boolean;

  /**
   * Creates an application error.
   *
   * @param message - Safe message that may be returned to the client.
   * @param statusCode - HTTP status code.
   */
  constructor(message: string, statusCode: number) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.isOperational = true;

    /**
     * Restore the correct prototype chain when targeting
     * JavaScript environments where Error subclassing requires it.
     */
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
