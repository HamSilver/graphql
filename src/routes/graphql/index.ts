import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { GraphQLSchema } from 'graphql';
import { getGraphQLQuery } from './getGraphQLQuery';
import { graphqlBodySchema } from './schema';
import { graphql } from 'graphql';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const source = `${request.body.query}`;
      const schema = new GraphQLSchema({
        query: await getGraphQLQuery(this),
      });

      return await graphql({
        schema,
        source,
      });
    }
  );
};

export default plugin;
