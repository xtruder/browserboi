import { Req, Value } from "@tsed/common";
import { Context } from "@tsed/platform-params";
import { Middleware, MiddlewareMethods } from "@tsed/platform-middlewares";
import { Unauthorized } from "@tsed/exceptions";
import { Config } from "./types";

@Middleware()
export class BearerAuthMiddleware implements MiddlewareMethods {
  @Value("config")
  private readonly config: Config;

  public use(@Req() request: Req, @Context() ctx: Context) {
    if (!this.config.token) return;

    let type: string, token: string;
    try {
      [type, token] = request.headers.authorization.split(" ");
    } catch (err) {
      throw new Unauthorized("invalid token");
    }

    if (type !== "Bearer" || token !== this.config.token)
      throw new Unauthorized("invalid token");
  }
}
