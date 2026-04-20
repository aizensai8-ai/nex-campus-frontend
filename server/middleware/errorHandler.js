// ── Centralized error response ────────────────────────────────────────────────
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  const isDbUnavailable =
    /buffering timed out/i.test(message) ||
    /server selection timed out/i.test(message) ||
    /client must be connected/i.test(message) ||
    err.name === 'MongoNetworkError' ||
    err.name === 'MongoServerSelectionError' ||
    err.name === 'MongoNotConnectedError';

  if (process.env.NODE_ENV === 'development' && !isDbUnavailable) {
    console.error('[ERROR]', err.stack);
  } else if (isDbUnavailable && process.env.NODE_ENV === 'development') {
    console.warn('[WARN] MongoDB temporarily unavailable:', message);
  }

  // ── Mongoose: invalid ObjectId ─────────────────────────────────────────────
  if (err.name === 'CastError') {
    statusCode = 404;
    message = `Resource not found (invalid id: ${err.value})`;
  }

  // ── Mongoose: duplicate key ────────────────────────────────────────────────
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue ? err.keyValue[field] : '';
    message = `Duplicate value for '${field}': '${value}' is already in use`;
  }

  // ── Mongoose: validation errors ────────────────────────────────────────────
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join('; ');
  }

  // ── JWT errors ─────────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired — please log in again';
  }

  if (isDbUnavailable) {
    statusCode = 503;
    message = 'Database temporarily unavailable. Please try again in a moment.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// ── Async wrapper — eliminates try/catch boilerplate in route handlers ────────
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export { errorHandler, asyncHandler };
