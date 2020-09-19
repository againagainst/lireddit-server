import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import { duration } from "moment";
import "reflect-metadata"; //
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { APP, COOKIE_NAME, DEBUG } from "./constants";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import typeormConfig from "./typeorm.config";

const main = async () => {
  await createConnection(typeormConfig);

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(cors({ origin: "http://localhost:3000", credentials: true }));

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
      cookie: {
        maxAge: duration(1, "year").asMilliseconds(),
        httpOnly: true,
        sameSite: "lax",
        secure: !DEBUG,
      },
      saveUninitialized: false,
      secret: "***REMOVED***",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) /*: MyContext */ => ({
      req,
      res,
      redis,
    }),
  });
  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: false,
    },
  });
  app.listen(APP.PORT, () => {
    console.log(`lireddit-server started on localhost:${APP.PORT}`);
  });
};

main();
