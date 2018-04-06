import "reflect-metadata";
import { createConnection } from "typeorm";
import { importSchema } from "graphql-import";
import * as bcrypt from "bcryptjs";
import * as path from "path";
import * as jwt from "jsonwebtoken";
import * as express from "express";
import * as bodyParser from "body-parser";
import { makeExecutableSchema } from "graphql-tools";
import { graphqlExpress } from "apollo-server-express";
import expressPlayground from "graphql-playground-middleware-express";
import * as cors from "cors";

import { User } from "./entity/User";
import { ResolverMap } from "./types/ResolverType";

import { GQL } from "./generated/schema";

const SALT = 12;
const JWT_SECRET = "aslkdfjaklsjdflk";

const resolvers: ResolverMap = {
  Query: {
    hello: (_, { name }: GQL.IHelloOnQueryArguments) =>
      `hhello ${name || "World"}`
  },
  Mutation: {
    register: async (_, args, { res }) => {
      const password = await bcrypt.hash(args.password, SALT);
      const user = User.create({
        username: args.username,
        password
      });
      await user.save();

      const token = jwt.sign(
        {
          uerId: user.id
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("id", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      });

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
  "/graphql",
  bodyParser.json(),
  graphqlExpress((_, res) => ({
    schema,
    context: { res }
  }))
);

app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

app.listen(4000);

createConnection().then(() => {
  app.listen(() => console.log("Server is running on localhost:4000"));
});
