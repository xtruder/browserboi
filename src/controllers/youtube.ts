import { Default, Post, Property, Required } from "@tsed/schema";
import { Context, UseAuth } from "@tsed/common";
import { Controller, Inject } from "@tsed/di";
import { BodyParams } from "@tsed/platform-params";
import { YoutubeService } from "../services/youtube";
import { BearerAuthMiddleware } from "../middlewares";

export class YoutubeLikeReq {
  @Property()
  @Required()
  url: string;

  @Property()
  @Required()
  liked: boolean;
}

export interface YoutubeLikeResp extends YoutubeLikeReq {
  updated: boolean;
}

@Controller("/youtube")
export class YoutubeCtrl {
  @Inject()
  service: YoutubeService;

  @Post("/likeVideo")
  @UseAuth(BearerAuthMiddleware)
  async likeVideo(
    @Context() ctx: Context,
    @BodyParams() model: YoutubeLikeReq
  ): Promise<YoutubeLikeResp> {
    const updated = await this.service.likeVideo(ctx, model.url, model.liked);

    return { ...model, updated };
  }
}
