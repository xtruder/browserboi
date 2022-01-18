import {
  Default,
  Description,
  Post,
  Property,
  Required,
  Returns,
  Security,
  Title,
} from "@tsed/schema";
import { Context, UseAuth } from "@tsed/common";
import { Controller, Inject } from "@tsed/di";
import { BodyParams } from "@tsed/platform-params";
import { YoutubeService } from "../services/youtube";
import { BearerAuthMiddleware } from "../middlewares";

export class YoutubeLikeReq {
  @Description("Youtube video URL")
  @Property()
  @Required()
  url: string;

  @Description("Whether youtube video should be in liked state or not")
  @Property()
  @Required()
  liked: boolean;
}

export class YoutubeLikeResp extends YoutubeLikeReq {
  @Description("Whether like state has been updated")
  @Property()
  updated: boolean;
}

export class YoutubeWatchLaterReq {
  @Description("Youtube video URL")
  @Property()
  @Required()
  url: string;

  @Description("Whether youtube video should be added to watched later or not")
  @Property()
  @Required()
  added: boolean;
}

export class YoutubeWatchLaterResp extends YoutubeWatchLaterReq {
  @Description("Whether watch later state has been updated")
  @Property()
  updated: boolean;
}

@Controller("/youtube")
export class YoutubeCtrl {
  @Inject()
  service: YoutubeService;

  @Post("/likeVideo")
  @Description("like youtube video")
  @Returns(200, YoutubeLikeResp)
  @UseAuth(BearerAuthMiddleware)
  @Security("bearer")
  async likeVideo(
    @Context() ctx: Context,
    @BodyParams() model: YoutubeLikeReq
  ): Promise<YoutubeLikeResp> {
    const updated = await this.service.likeVideo(ctx, model.url, model.liked);

    return { ...model, updated };
  }

  @Post("/watchLater")
  @Description("add youtube video to watch later")
  @Returns(200, YoutubeWatchLaterResp)
  @UseAuth(BearerAuthMiddleware)
  @Security("bearer")
  async watchLater(
    @Context() ctx: Context,
    @BodyParams() model: YoutubeWatchLaterReq
  ): Promise<YoutubeWatchLaterResp> {
    const updated = await this.service.addVideoToWatchLater(
      ctx,
      model.url,
      model.added
    );

    return { ...model, updated };
  }
}
