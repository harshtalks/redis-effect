import { pipe, Schema, String } from "effect";
import { CRLF } from "./common";

// Format - `-Error message\r\n`
export class Error extends Schema.TaggedClass<Error>("Resp.SimpleError")(
  "Resp.SimpleError",
  {
    value: Schema.String,
  },
) {
  static readonly Resp = pipe(
    Schema.String,
    Schema.startsWith("-"),
    Schema.endsWith(CRLF),
    Schema.transform(Schema.String, {
      decode: (e) => pipe(e, String.slice(1, -2)),
      encode: (e) => `-${e}${CRLF}`,
    }),
    Schema.transform(Error, {
      decode: (e) =>
        new Error({
          value: e,
        }),
      encode: (e) => e.value,
    }),
  );
}
