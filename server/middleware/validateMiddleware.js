import { ApiError } from "../utils/apiError.js";

export const validate = (schema) => (req, _res, next) => {
  const errors = [];
  for (const [field, rule] of Object.entries(schema)) {
    const value = req.body[field];
    if (rule.required && (value === undefined || value === null || value === "")) {
      errors.push(`${field} is required`);
    }
    if (value !== undefined && rule.enum && !rule.enum.includes(value)) {
      errors.push(`${field} must be one of: ${rule.enum.join(", ")}`);
    }
  }
  if (errors.length) throw new ApiError(400, "Validation failed", errors);
  next();
};
