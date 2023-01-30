import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLOutputType,
} from "graphql";
import { UserEntity } from "../../../utils/DB/entities/DBUsers";
import { graphQLPost } from "./graphQLPost";
import { graphQLProfile } from "./graphQLProfile";

export const graphQLUser:GraphQLOutputType = new GraphQLObjectType({
  name: "GraphQLUser",
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
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
