import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
} from "graphql";

export const graphQLMemberType = new GraphQLObjectType({
  name: 'GraphQLMemberType',
  fields: () => ({
    id: { type: GraphQLID },
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  }),
});
