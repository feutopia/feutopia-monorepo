import { HttpClient } from "../core/http";
import { HttpClientOptions } from "../core/types";

export class TestHttp extends HttpClient {
  constructor(options?: HttpClientOptions) {
    super(options);
  }
}
