import { existsSync, readFileSync, writeFileSync } from "fs";
import yargs from "yargs";

import { $log } from "@tsed/common";
import { PlatformExpress } from "@tsed/platform-express";

import { Server } from "./server";
import { Config } from "./types";
import { YoutubeService } from "./services/youtube";

async function bootstrapPlatform(config: Config) {
  try {
    $log.info("Bootstarping platform...");
    const platform = await PlatformExpress.bootstrap(Server, { config });
    $log.info("Platform bootstraped");

    return platform;
  } catch (err) {
    $log.error(err);
  }
}

yargs(process.argv.slice(2))
  .option("headless", {
    type: "boolean",
    default: false,
    desc: "Whether to run browser in headless mode",
  })
  .option("chrome-path", {
    type: "string",
    desc: "Path to chrome",
  })
  .command(
    "login-youtube",
    "login into youtube and fetch cookies",
    (yargs) => {
      return yargs.option("output", {
        type: "string",
        require: true,
        desc: "Output cookies files",
      });
    },
    async (argv) => {
      const platform = await bootstrapPlatform({ ...argv, headless: false });

      const service = platform.app.injector.get<YoutubeService>(YoutubeService);

      const cookies = await service.loginAndSaveCookies();

      $log.info(`Saving cookies to ${argv.output}`);
      writeFileSync(argv.output, JSON.stringify(cookies), "utf-8");

      await platform.stop();

      process.exit(0);
    }
  )
  .command(
    "serve",
    "the server command",
    (yargs) =>
      yargs
        .options({
          "youtube-cookies": { type: "string", require: true },
          token: { type: "string" },
        })
        .coerce({
          youtubeCookies: (f) => (existsSync(f) ? readFileSync(f, "utf-8") : f),
        }),
    async (argv) => {
      const platform = await bootstrapPlatform(argv);

      await platform.listen();
      $log.info("Server initialized");
    }
  )
  .env("BROWSERBOI")
  .demandCommand()
  .help().argv;
