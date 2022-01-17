import {
  Inject,
  Injectable,
  ProviderScope,
  ProviderType,
  Value,
} from "@tsed/di";

import { Browser } from "puppeteer";
import puppeteer from "puppeteer-extra";
import stealth from "puppeteer-extra-plugin-stealth";

import { Config } from "../types";
import { OnSignal } from "@tsed/terminus";
import { Logger } from "@tsed/common";

@Injectable({
  type: ProviderType.PROVIDER,
  scope: ProviderScope.SINGLETON,
})
export class BrowserService {
  @Inject()
  logger: Logger;

  @Value("config")
  private readonly config: Config;

  public browser: Browser;

  async $onInit() {
    puppeteer.use(stealth());

    const headless = this.config.headless;

    this.logger.info(`initializing ${headless ? "headless" : ""} browser`);

    this.browser = await puppeteer.launch({
      headless,
      executablePath: this.config.chromePath,
      product: "chrome",
      defaultViewport: {
        width: 1280,
        height: 600,
      },
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }

  @OnSignal()
  async OnSignal() {
    this.logger.info("closing browser");
    await this.browser.close();
  }
}
