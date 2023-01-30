import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { GraphQLSchema } from "graphql";
import { getGraphQLQuery } from "./getGraphQLQuery";
import { graphqlBodySchema } from "./schema";
import { graphql } from "graphql";
import { getGraphQLMutation } from "./getGraphQLMutation";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    "/",
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const source = `${request.body.query}`;
      const variableValues = request.body.variables;
      const schema = new GraphQLSchema({
        query: await getGraphQLQuery(this),
        mutation: await getGraphQLMutation(this),
      });

      return await graphql({
        schema,
        source,
        variableValues,
        contextValue: { fastify },
      });
    }
  );
};

export default plugin;
