/**
 * Simple strings are encoded as a plus (+) character, followed by a string. The string mustn't contain a CR (\r) or LF (\n) character and is terminated
 * by CRLF (i.e., \r\n).
 * i.e. +OK\r\n
 */

import { pipe, Schema, String } from "effect";
import { CRLF } from "./common";

export class SimpleString extends Schema.TaggedClass<SimpleString>(
  "RESP.SimpleString",
)("RESP.SimpleString", {
  value: Schema.String,
}) {
  static readonly Resp = pipe(
    Schema.String,
    Schema.startsWith("+"),
    Schema.endsWith(CRLF),
    Schema.transform(Schema.String, {
      decode: (s) => pipe(s, String.slice(1, -2)),
      encode: (s) => `+${s}${CRLF}`,
    }),
    Schema.transform(SimpleString, {
      decode: (s) => new SimpleString({ value: s }),
      encode: (s) => s.value,
    }),
  );
}
