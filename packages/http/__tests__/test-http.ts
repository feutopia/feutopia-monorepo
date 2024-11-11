import { BaseHttp } from "../core/base-http";
import { BaseHttpOptions } from "../core/types";

export class TestHttp extends BaseHttp {
	constructor(options?: BaseHttpOptions) {
		super(options);
	}
}
