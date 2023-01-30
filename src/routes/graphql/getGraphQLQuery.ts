import { FastifyInstance } from "fastify";
import {
  graphQLUser,
  graphQLProfile,
  graphQLPost,
  graphQLMemberType,
} from "./types";
import { GraphQLObjectType, GraphQLList, GraphQLID } from "graphql";

export const getGraphQLQuery = async (
  fastify: FastifyInstance
): Promise<GraphQLObjectType> => {
  return new GraphQLObjectType({
    name: "Query",
    fields: {
      users: {
        type: new GraphQLList(graphQLUser),
        resolve: async () => fastify.db.users.findMany(),
      },
      user: {
        type: graphQLUser,
        args: {
          id: { type: GraphQLID },
        },
        resolve: async (source, args) =>
          fastify.db.users.findOne({
            key: "id",
            equals: args.id,
          }),
      },
      profiles: {
        type: new GraphQLList(graphQLProfile),
        resolve: async () => fastify.db.profiles.findMany(),
      },
      profile: {
        type: graphQLProfile,
        args: {
          id: { type: GraphQLID },
        },
        resolve: async (source, args) =>
          fastify.db.profiles.findOne({
            key: "id",
            equals: args.id,
          }),
      },
      posts: {
        type: new GraphQLList(graphQLPost),
        resolve: async () => fastify.db.posts.findMany(),
      },
      post: {
        type: graphQLPost,
        args: {
          id: { type: GraphQLID },
        },
        resolve: async (source, args) =>
          fastify.db.posts.findOne({
            key: "id",
            equals: args.id,
          }),
      },
      memberTypes: {
        type: new GraphQLList(graphQLMemberType),
        resolve: async () => fastify.db.memberTypes.findMany(),
      },
      memberType: {
        type: graphQLMemberType,
        args: {
          id: { type: GraphQLID },
        },
        resolve: async (source, args) =>
          fastify.db.memberTypes.findOne({
            key: "id",
            equals: args.id,
          }),
      },
    },
  });
};
