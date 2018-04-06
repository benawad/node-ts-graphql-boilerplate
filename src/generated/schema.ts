// tslint:disable
// graphql typescript definitions

export declare namespace GQL {
  interface IGraphQLResponseRoot {
    data?: IQuery | IMutation;
    errors?: Array<IGraphQLResponseError>;
  }

  interface IGraphQLResponseError {
    /** Required for all errors */
    message: string;
    locations?: Array<IGraphQLResponseErrorLocation>;
    /** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
    [propName: string]: any;
  }

  interface IGraphQLResponseErrorLocation {
    line: number;
    column: number;
  }

  interface IQuery {
    __typename: "Query";
    hello: string;
    user: IUser;
    users: Array<IUser>;
  }

  interface IHelloOnQueryArguments {
    name?: string | null;
  }

  interface IUserOnQueryArguments {
    id: number;
  }

  interface IUser {
    __typename: "User";
    id: number;
    firstName: string;
    profile: IProfile | null;
  }

  interface IProfile {
    __typename: "Profile";
    favoriteColor: string;
  }

  interface IMutation {
    __typename: "Mutation";
    updateUser: boolean | null;
    deleteUser: boolean | null;
    register: boolean;
  }

  interface IUpdateUserOnMutationArguments {
    id: number;
    firstName?: string | null;
  }

  interface IDeleteUserOnMutationArguments {
    id: number;
  }

  interface IRegisterOnMutationArguments {
    username: string;
    password: string;
  }

  interface IProfileInput {
    favoriteColor: string;
  }
}

// tslint:enable
