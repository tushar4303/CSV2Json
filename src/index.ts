import "./database/index";
import * as http from "http";
import App from "./app";

process.on("uncaughtException", (error, origin) => {
  console.error(`uncaughtException: ${error}\n` + `Exception origin: ${origin}`);
});

process.on("unhandledRejection", (reason: any) => {
  console.error(`unhandledRejection: message: ${reason?.message} `);
});

const onError = (error: NodeJS.ErrnoException): void => {
  if (error.syscall !== "listen") throw error;
  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
    default:
      throw error;
  }
};

const onListening = (): void => {
  const addr: any | string = server.address();
  const bind =
    typeof addr === "string"
      ? `pipe ${addr}`
      : `http://${addr.address}:${addr.port}`;
  console.info("server started", `listening on ${bind}`);
};

const port = process.env.PORT || 3001;
App.set("port", port);
const server = http.createServer(App);
server.listen({ port });
server.on("error", onError);
server.on("listening", onListening);
