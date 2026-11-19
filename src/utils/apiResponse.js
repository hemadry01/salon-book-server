// Every endpoint returns the same JSON shape:
// success -> { success: true, message, data }
// error   -> { success: false, message, details? }

export function sendSuccess(res, data = null, message = "Success", statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendError(res, message = "Something went wrong", statusCode = 500, details = null) {
  const body = {
    success: false,
    message,
  };

  if (details) {
    body.details = details;
  }

  return res.status(statusCode).json(body);
}
