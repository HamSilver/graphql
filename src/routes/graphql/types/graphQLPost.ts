import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
} from "graphql";

export const graphQLPost = new GraphQLObjectType({
  name: 'GraphQLPost',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    userId: { type: GraphQLID },
  }),
});
