import "reflect-metadata";
import { GraphQLServer } from "graphql-yoga";
import { createConnection } from "typeorm";

const typeDefs = `
  type User {
    id: Int!
    firstName: String!
    lastName: String!
    age: Int!
    email: String!
  }

  type Query {
    hello(name: String): String!
    user: User!
    users: [User!]!
  }

  type Mutation {
    createUser(firstName: String!, lastName: String!, age: Int!, email: String!): User!
    updateUser(firstName: String, lastName: String, age: Int, email: String): Boolean
    deleteUser(id: Int!): Boolean
  }
`;

const resolvers = {
  Query: {
    hello: (_: any, { name }: any) => `hhello ${name || "World"}`
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
createConnection().then(() => {
  server.start(() => console.log("Server is running on localhost:4000"));
});
