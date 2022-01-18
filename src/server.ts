import { Configuration, Inject } from "@tsed/di";
import { PlatformApplication } from "@tsed/common";
import * as express from "express";

import { YoutubeCtrl } from "./controllers/youtube";

import "@tsed/ajv";
import "@tsed/terminus";
import "@tsed/swagger";

@Configuration({
  rootDir: __dirname,
  acceptMimes: ["application/json"],
  mount: {
    "/api": [YoutubeCtrl],
  },
  swagger: [
    {
      path: "/docs",
      specVersion: "3.0.1",
      spec: {
        components: {
          securitySchemes: {
            bearer: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "token",
            },
          },
        },
      },
    },
  ],
  middlewares: [express.json({ inflate: true, type: () => true })],
  terminus: {},
})
export class Server {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;

  /**
   * This method let you configure the express middleware required by your application to works.
   * @returns {Server}
   */
  public $beforeRoutesInit(): void | Promise<any> {}
}
