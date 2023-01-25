import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { createPostBodySchema, changePostBodySchema } from "./schema";
import type { PostEntity } from "../../utils/DB/entities/DBPosts";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<PostEntity[]> {
    return this.db.posts.findMany();
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const result = await this.db.posts.findOne({
        key: "id",
        equals: request.params.id,
      });
      if (!result) {
        throw this.httpErrors.notFound("Post not found");
      }
      return result;
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const user = await this.db.users.findOne({
        key: "id",
        equals: request.body.userId,
      });
      if (!user) {
        throw this.httpErrors.badRequest("Post's user not found");
      }
      return await this.db.posts.create(request.body);
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const post = await this.db.posts.findOne({
        key: "id",
        equals: request.params.id,
      });
      if (!post) {
        throw this.httpErrors.badRequest("Post not found");
      }
      return await this.db.posts.delete(request.params.id);
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      try {
        return await this.db.posts.change(request.params.id, request.body);
      } catch (error: any) {
        throw this.httpErrors.badRequest(error);
      }
    }
  );
};

export default plugin;
