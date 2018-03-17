import { Binding as BaseBinding, BindingOptions } from 'graphql-binding'
import { GraphQLResolveInfo } from 'graphql'

export interface ProfileInput {
  favoriteColor: String
}

export interface Profile {
  favoriteColor: String
}

export interface User {
  id: Int
  firstName: String
  profile?: Profile
}

/*
The `Boolean` scalar type represents `true` or `false`.
*/
export type Boolean = boolean

/*
The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. 
*/
export type Int = number

/*
The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
*/
export type String = string

export interface Schema {
  query: Query
  mutation: Mutation
}

export type Query = {
  hello: (args: { name?: String }, context: { [key: string]: any }, info?: GraphQLResolveInfo | string) => Promise<String>
  user: (args: { id: Int }, context: { [key: string]: any }, info?: GraphQLResolveInfo | string) => Promise<User>
  users: (args: {}, context: { [key: string]: any }, info?: GraphQLResolveInfo | string) => Promise<User[]>
}

export type Mutation = {
  createUser: (args: { firstName: String, profile?: ProfileInput }, context: { [key: string]: any }, info?: GraphQLResolveInfo | string) => Promise<User>
  updateUser: (args: { id: Int, firstName?: String }, context: { [key: string]: any }, info?: GraphQLResolveInfo | string) => Promise<Boolean | null>
  deleteUser: (args: { id: Int }, context: { [key: string]: any }, info?: GraphQLResolveInfo | string) => Promise<Boolean | null>
}

export class Binding extends BaseBinding {
  
  constructor({ schema, fragmentReplacements }: BindingOptions) {
    super({ schema, fragmentReplacements });
  }
  
  query: Query = {
    hello: (args, context, info): Promise<String> => super.delegate('query', 'hello', args, context, info),
    user: (args, context, info): Promise<User> => super.delegate('query', 'user', args, context, info),
    users: (args, context, info): Promise<User[]> => super.delegate('query', 'users', args, context, info)
  }

  mutation: Mutation = {
    createUser: (args, context, info): Promise<User> => super.delegate('mutation', 'createUser', args, context, info),
    updateUser: (args, context, info): Promise<Boolean | null> => super.delegate('mutation', 'updateUser', args, context, info),
    deleteUser: (args, context, info): Promise<Boolean | null> => super.delegate('mutation', 'deleteUser', args, context, info)
  }
}