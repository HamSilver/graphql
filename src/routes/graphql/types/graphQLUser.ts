import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLOutputType,
  GraphQLNonNull,
  GraphQLInputType,
  GraphQLInputObjectType,
} from "graphql";
import { UserEntity } from "../../../utils/DB/entities/DBUsers";
import { graphQLPost } from "./graphQLPost";
import { graphQLProfile } from "./graphQLProfile";

export const graphQLUser: GraphQLOutputType = new GraphQLObjectType({
  name: "GraphQLUser",
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
    subscribedToUser: {
      type: new GraphQLList(graphQLUser),
      resolve: async (source: UserEntity, args: unknown, { fastify }) =>
        fastify.db.users.findMany({
          key: "id",
          equalsAnyOf: source.subscribedToUserIds,
        }),
    },
    userSubscribedTo: {
      type: new GraphQLList(graphQLUser),
      resolve: async (source: UserEntity, args: unknown, { fastify }) =>
        fastify.db.users.findMany({
          key: "subscribedToUserIds",
          inArray: source.id,
        }),
    },
    profile: {
      type: graphQLProfile,
      resolve: async (source: UserEntity, args: unknown, { fastify }) =>
        fastify.db.profiles.findOne({
          key: "userId",
          equals: source.id,
        }),
    },
    posts: {
      type: new GraphQLList(graphQLPost),
      resolve: async (source: UserEntity, args: unknown, { fastify }) =>
        fastify.db.posts.findMany({
          key: "userId",
          equals: source.id,
        }),
    },
  }),
});

export const graphQLCreateUser: GraphQLInputType = new GraphQLInputObjectType({
  name: "GraphQLCreateUser",
  fields: () => ({
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  }),
});
