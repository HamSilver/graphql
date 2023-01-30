import { FastifyInstance } from "fastify";
import {
  graphQLUser,
  graphQLProfile,
  graphQLPost,
  graphQLMemberType,
} from "./types";
import { GraphQLObjectType, GraphQLList } from "graphql";

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
      profiles: {
        type: new GraphQLList(graphQLProfile),
        resolve: async () => fastify.db.profiles.findMany(),
      },
      posts: {
        type: new GraphQLList(graphQLPost),
        resolve: async () => fastify.db.posts.findMany(),
      },
      memberTypes: {
        type: new GraphQLList(graphQLMemberType),
        resolve: async () => fastify.db.memberTypes.findMany(),
      },
    },
  });
};
