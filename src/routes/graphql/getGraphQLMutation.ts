import { FastifyInstance } from "fastify";
import { graphQLUser, graphQLCreateUser } from "./types";
import { GraphQLObjectType, GraphQLNonNull } from "graphql";

export const getGraphQLMutation = async (
  fastify: FastifyInstance
): Promise<GraphQLObjectType> =>
  new GraphQLObjectType({
    name: "Mutation",
    fields: {
      createUser: {
        type: graphQLUser,
        args: {
          variables: {
            type: new GraphQLNonNull(graphQLCreateUser),
          },
        },
        resolve: async (_, args: any) => {
          const { firstName, lastName, email } = args.variables;
          return fastify.db.users.create({
            firstName,
            lastName,
            email,
          });
        },
      },
    },
  });
