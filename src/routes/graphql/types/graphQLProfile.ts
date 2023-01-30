import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
} from "graphql";
import { ProfileEntity } from "../../../utils/DB/entities/DBProfiles";
import { graphQLMemberType } from "./graphQLMemberType";

export const graphQLProfile = new GraphQLObjectType({
  name: "GraphQLProfile",
  fields: () => ({
    id: { type: GraphQLID },
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    memberTypeId: { type: GraphQLID },
    userId: { type: GraphQLID },
    memberType: {
      type: graphQLMemberType,
      resolve: async (source: ProfileEntity, args: unknown, { fastify }) =>
        fastify.db.memberTypes.findOne({
          key: "id",
          equals: source.memberTypeId,
        }),
    },
  }),
});
