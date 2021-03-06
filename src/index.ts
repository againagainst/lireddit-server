import "reflect-metadata";
import "dotenv-safe/config";
import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import { duration } from "moment";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { COOKIE_DOMAIN, COOKIE_NAME, DEBUG } from "./constants";
import { Post } from "./entities/Post";
import { Updoot } from "./entities/Updoot";
import { User } from "./entities/User";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { createUpdootLoader } from "./utils/createUpdootLoader";
import { createUserLoader } from "./utils/createUserLoader";

const main = async () => {
  await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: true,
    synchronize: true,
    entities: [Post, User, Updoot],
  });

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);

  app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
  app.set("trust proxy", 1);
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
      cookie: {
        maxAge: duration(1, "year").asMilliseconds(),
        httpOnly: true,
        sameSite: "lax",
        secure: !DEBUG,
        domain: COOKIE_DOMAIN,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
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
      userLoader: createUserLoader(),
      updootLoader: createUpdootLoader(),
    }),
  });
  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: false,
    },
  });
  app.listen(parseInt(process.env.PORT), () => {
    console.log(`lireddit-server started on localhost:${process.env.PORT}`);
  });
};

main();
