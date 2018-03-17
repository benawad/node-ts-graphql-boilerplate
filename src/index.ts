import "reflect-metadata";
import { GraphQLServer } from "graphql-yoga";
import { createConnection } from "typeorm";
// tslint:disable-next-line:no-submodule-imports
// import { IResolvers } from "graphql-yoga/dist/src/types";

import typeDefs from "./schema.graphql";

import { User } from "./entity/User";
import { Profile } from "./entity/Profile";
import { ResolverMap } from "./types/ResolverType";

const resolvers: ResolverMap = {
  Query: {
    hello: (_, { name }: GQL.IHelloOnQueryArguments) =>
      `hhello ${name || "World"}`,
    user: async (_, { id }: GQL.IUserOnQueryArguments) => {
      const user = await User.findOneById(id, { relations: ["profile"] });
      console.log(user);

      return user;
    },
    users: async () => {
      const users = await User.find({ relations: ["profile"] });

      console.log(users);
      return users;
    }
  },
  Mutation: {
    createUser: async (_, args: GQL.ICreateUserOnMutationArguments) => {
      const profile = Profile.create({ ...args.profile });
      await profile.save();

      const user = User.create({
        firstName: args.firstName
      });

      user.profile = profile;

      await user.save();

      console.log(user);

      return user;
    },
    updateUser: async (
      _: any,
      { id, ...args }: GQL.IUpdateUserOnMutationArguments
    ) => {
      try {
        await User.updateById(id, args);
      } catch (err) {
        console.log(err);
        return false;
      }

      return true;
    },
    deleteUser: async (_, { id }: GQL.IDeleteUserOnMutationArguments) => {
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
