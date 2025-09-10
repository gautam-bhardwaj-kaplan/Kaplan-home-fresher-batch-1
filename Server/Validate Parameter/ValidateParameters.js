
function validateParams(params = {}, query = {}, rules = {}) {
  const errors = [];

  Object.entries(rules).forEach(([key, type]) => {
    const value = params[key] ?? query[key];
    if (value !== undefined) {
      if (type === "number" && isNaN(Number(value))) {
        errors.push(`${key} should be a number`);
      }
      if (type === "string" && typeof value !== "string") {
        errors.push(`${key} should be a string`);
      }
    }
  });

  return errors;
}

module.exports = { validateParams };

