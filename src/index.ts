import "reflect-metadata";
import { createConnection } from "typeorm";
import { importSchema } from "graphql-import";
import * as bcrypt from "bcryptjs";
import * as path from "path";
import * as express from "express";
import * as bodyParser from "body-parser";
import { makeExecutableSchema } from "graphql-tools";
import { graphqlExpress } from "apollo-server-express";
import expressPlayground from "graphql-playground-middleware-express";
import * as cors from "cors";
import * as session from "express-session";

import { User } from "./entity/User";
import { ResolverMap } from "./types/ResolverType";

const SALT = 12;
const SESSION_SECRET = "asdklfjqo31";

const resolvers: ResolverMap = {
  Query: {
    hello: () => `Hello World!`,
    authHello: (_, __, { req }) => {
      if (req.session.userId) {
        return `Cookie found! Your id is: ${req.session.userId}`;
      } else {
        return "Could not find cookie :(";
      }
    }
  },
  Mutation: {
    register: async (_, args, { req }) => {
      const password = await bcrypt.hash(args.password, SALT);
      const user = User.create({
        username: args.username,
        password
      });
      await user.save();

      req.session.userId = user.id;

      return true;
    }
  }
};

const app = express();

const typeDefs = importSchema(path.join(__dirname, "./schema.graphql"));

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000"
  })
);

app.use(
  session({
    name: "qid",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
  })
);

app.use(
  "/graphql",
  bodyParser.json(),
  (req, _, next) => {
    console.log(req.session);
    return next();
  },
  graphqlExpress(req => ({
    schema,
    context: { req }
  }))
);

app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

app.listen(4000);

createConnection().then(() => {
  app.listen(() => console.log("Server is running on localhost:4000"));
});
