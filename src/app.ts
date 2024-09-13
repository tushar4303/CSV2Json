import * as bodyParser from "body-parser";
import * as express from "express";
import { appRoutes } from "./routes";

export interface RouteInterface {
  path: any;
  method: string;
  preHook?: any;
  action: any;
}

class App {
  public express: express.Application;
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  private middleware(): void {
    console.log("app launched in ", this.express.get("env"), " mode");
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: true }));
  }

  private routes(): void {
    const router: any = express.Router();
    appRoutes.forEach((route: RouteInterface) => {
      if (route.preHook) {
        router[route.method](route.path, ...route.preHook, route.action);
      } else {
        router[route.method](route.path, route.action);
      }
    });
    this.express.use("/", router);
  }
}

export default new App().express;
