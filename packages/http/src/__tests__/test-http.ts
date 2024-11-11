import { HttpClient } from "../core/http-client";
import { HttpClientOptions } from "../core/types";

export class TestHttp extends HttpClient {
	constructor(options?: HttpClientOptions) {
		super(options);
	}
}
