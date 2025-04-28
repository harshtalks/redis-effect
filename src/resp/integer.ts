/**
 * :[+/-]<value>\r\n
 * The colon (:) as the first byte.
 * An optional plus (+) or minus (-) as the sign.
 * One or more decimal digits (0..9) as the integer's unsigned, base-10 value.
 * The CRLF terminator.
 */

import { Effect, ParseResult, pipe, Schema, String } from "effect";
import { CRLF } from "./common";

export class Integer extends Schema.TaggedClass<Integer>("RESP.Integer")(
  "RESP.Integer",
  {
    value: Schema.Int,
  },
) {
  static readonly RESP = pipe(
    Schema.String,
    Schema.startsWith(":"),
    Schema.endsWith(CRLF),
    Schema.transform(Schema.String, {
      decode: (s) => pipe(s, String.slice(1, -2)),
      encode: (s) => `:${s}${CRLF}`,
    }),
    Schema.transformOrFail(Schema.Int, {
      decode: (s, _, ast) =>
        Effect.try({
          try: () => parseInt(s),
          catch: (error) =>
            new ParseResult.Type(
              ast,
              s,
              error instanceof Error
                ? error.message
                : "Unexpected error while parsing an integer",
            ),
        }),
      encode: (s) => Effect.succeed(s.toString()),
    }),
    Schema.transform(Integer, {
      decode: (s) =>
        new Integer({
          value: s,
        }),
      encode: (s) => s.value,
    }),
  );
}
