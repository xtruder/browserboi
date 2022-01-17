import { Logger, PlatformContext } from "@tsed/common";
import { Inject, Injectable, Value } from "@tsed/di";
import { OnSignal } from "@tsed/terminus";
import { Protocol, ProtocolLifeCycleEvent } from "puppeteer";

import { Config } from "../types";
import { BrowserService } from "./browser";

@Injectable()
export class YoutubeService {
  @Inject()
  private logger: Logger;

  @Inject()
  private browserService: BrowserService;

  @Value("config")
  private readonly config: Config;

  private cookies: Protocol.Network.CookieParam[];

  async loginAndSaveCookies() {
    const page = await this.browserService.browser.newPage();

    await page.setViewport({ width: 1200, height: 800 });

    await page.setRequestInterception(true);

    return new Promise((resolve) => {
      // Add event listener on request
      page.on("request", async (req) => {
        // If the request url is what I want, start my function
        if (req.url() === "https://youtube.com/?authuser=0") {
          this.logger.info("login success, getting cookies");
          resolve(await page.cookies());
        }

        req.continue();
      });

      this.logger.info("redirecting to google account chooser");

      // Then go to my url once all the listeners are setup
      page.goto(
        "https://accounts.google.com/AccountChooser?service=wise&continue=https://youtube.com"
      );
    });
  }

  async likeVideo(
    ctx: PlatformContext,
    url: string,
    liked: boolean
  ): Promise<boolean> {
    if (!this.cookies) {
      throw new Error("missing youtube cookies");
    }

    const page = await this.browserService.browser.newPage();

    try {
      await page.setCookie(...this.cookies);

      await page.goto(url, { waitUntil: "networkidle2" });

      ctx.logger.info("page loaded, waiting 3 seconds");

      await new Promise((resolve) => setTimeout(resolve, 3000));

      const el = await page.$<HTMLAnchorElement>(".ytd-toggle-button-renderer");
      if (!el) {
        throw new Error("toggle anchor not found");
      }

      const iconEl = await el.$<HTMLDivElement>("yt-icon-button");
      if (!iconEl) {
        throw new Error("incon el not found");
      }

      const checkLiked = async () => {
        const iconClass = await iconEl.getProperty("className");
        ctx.logger.info(iconClass.toString());

        return iconClass.toString().indexOf("style-default-active") > -1;
      };

      const isLiked = await checkLiked();
      if (isLiked === liked) {
        ctx.logger.info(
          `video already ${liked ? "liked" : "unliked"}, do nothing`
        );

        await page.close();
        return false;
      }

      ctx.logger.info(`${liked ? "liking" : "unliking"} video`);
      await el.click();
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if ((await checkLiked()) !== liked)
        throw new Error(`error ${liked ? "liking" : "unliking"} video`);

      ctx.logger.info(`video ${liked ? "liked" : "unliked"}, closing page`);

      await page.close();
      return true;
    } catch (err) {
      page.close();
      throw err;
    }
  }

  $onInit() {
    if (this.config.youtubeCookies) {
      this.cookies = JSON.parse(this.config.youtubeCookies);
    }
  }
}
