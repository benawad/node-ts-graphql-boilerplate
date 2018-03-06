import "reflect-metadata";
import { GraphQLServer } from "graphql-yoga";
import { createConnection, getConnection } from "typeorm";
import { ResolverMap } from "./types/ResolverType";
import { User } from "./entity/User";

const typeDefs = `
  type User {
    id: Int!
    firstName: String!
  }

  type Query {
    hello(name: String): String!
    user(id: Int!): User!
    users: [User!]!
  }

  type Mutation {
    createUser(firstName: String!): User!
    updateUser(id: Int!, firstName: String): Boolean
    deleteUser(id: Int!): Boolean
  }
`;

const resolvers: ResolverMap = {
  Query: {
    hello: (_: any, { name }: any) => `hhello ${name || "World"}`,
    user: (_, { id }) => User.findOneById(id),
    users: () => User.find()
  },
  Mutation: {
    createUser: (_, args) => User.create(args).save(),
    updateUser: async (_, { id, ...args }) => {
      try {
        await User.updateById(id, args);
      } catch (err) {
        console.log(err);
        return false;
      }

      return true;
    },
    deleteUser: async (_, { id }) => {
      try {
        await User.removeById(id);
        // const deleteQuery = getConnection()
        //   .createQueryBuilder()
        //   .delete()
        //   .from(User)
        //   .where("id = :id", { id });

        // if (id === 1) {
        //   deleteQuery.andWhere("email = :email", { email: "bob@bob.com" });
        // }

        // await deleteQuery.execute();
      } catch (err) {
        console.log(err);
        return false;
      }

      return true;
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
createConnection().then(() => {
  server.start(() => console.log("Server is running on localhost:4000"));
});
