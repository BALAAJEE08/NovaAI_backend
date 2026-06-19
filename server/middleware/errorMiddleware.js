export const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || (err.name === "ValidationError" ? 400 : 500);
  const details =
    err.details ||
    (err.name === "ValidationError" ? Object.values(err.errors).map((item) => item.message) : undefined);
  res.status(statusCode).json({
    message: err.message || "Server error",
    details,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
};
