export function validateRequest(schema, source = "body") {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req[source]);

    if (!parsed.success) {
      return next({
        statusCode: 400,
        message: "Validation failed",
        details: parsed.error.flatten()
      });
    }

    req[source] = parsed.data;
    next();
  };
}

