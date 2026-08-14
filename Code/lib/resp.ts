export function respData(data: any) {
  return respJson(0, "ok", data || []);
}

export function respOk() {
  return respJson(0, "ok");
}

export function respErr(message: string) {
  return respJson(-1, message);
}

/**
 * Keep the existing `{ code, message, data }` envelope while allowing core
 * first-success APIs to expose honest HTTP semantics to browsers and monitors.
 */
export function respUnauthorized(message = "no auth") {
  return respJson(-2, message, undefined, 401);
}

export function respForbidden(message = "forbidden") {
  return respJson(-1, message, undefined, 403);
}

export function respBadRequest(message: string) {
  return respJson(-1, message, undefined, 400);
}

export function respServerError(message: string) {
  return respJson(-1, message, undefined, 500);
}

export function respJson(code: number, message: string, data?: any, status = 200) {
  let json = {
    code: code,
    message: message,
    data: data,
  };
  if (data) {
    json["data"] = data;
  }

  return Response.json(json, { status });
}
