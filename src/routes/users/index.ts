import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from "./schemas";
import type { UserEntity } from "../../utils/DB/entities/DBUsers";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<UserEntity[]> {
    return this.db.users.findMany();
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const result = await this.db.users.findOne({
        key: "id",
        equals: request.params.id,
      });
      if (!result) {
        throw this.httpErrors.notFound("User not found");
      }
      return result;
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      return this.db.users.create(request.body);
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await this.db.users.findOne({
        key: "id",
        equals: request.params.id,
      });
      if (!user) {
        throw this.httpErrors.badRequest("User not found");
      }
      const profile = await this.db.profiles.findOne({
        key: "userId",
        equals: request.params.id,
      });
      const posts = await this.db.posts.findMany({
        key: "userId",
        equals: request.params.id,
      });
      const subscribers = await fastify.db.users.findMany({
        key: "subscribedToUserIds",
        inArray: request.params.id,
      });
      if (profile) {
        await this.db.profiles.delete(profile.id);
      }
      for (const post of posts) {
        await this.db.posts.delete(post.id);
      }
      for (const subscriber of subscribers) {
        const subscribedToUserIds = user.subscribedToUserIds.filter(
          (id) => id !== request.params.id
        );
        await this.db.users.change(subscriber.id, { subscribedToUserIds });
      }
      return await this.db.users.delete(request.params.id);
    }
  );

  fastify.post(
    "/:id/subscribeTo",
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await this.db.users.findOne({
        key: "id",
        equals: request.body.userId,
      });
      const targetUser = await this.db.users.findOne({
        key: "id",
        equals: request.params.id,
      });
      if (!user) {
        throw this.httpErrors.badRequest("User not found");
      }
      if (!targetUser) {
        throw this.httpErrors.badRequest("Target user not found");
      }
      if (user.subscribedToUserIds.includes(request.params.id)) {
        return user;
      }
      if (request.body.userId === request.params.id) {
        throw this.httpErrors.badRequest("Wrong target user");
      }
      try {
        return await this.db.users.change(request.body.userId, {
          subscribedToUserIds: [...user.subscribedToUserIds, request.params.id],
        });
      } catch (error: any) {
        throw this.httpErrors.badRequest(error);
      }
    }
  );

  fastify.post(
    "/:id/unsubscribeFrom",
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await this.db.users.findOne({
        key: "id",
        equals: request.body.userId,
      });
      const targetUser = await this.db.users.findOne({
        key: "id",
        equals: request.params.id,
      });
      if (!user) {
        throw this.httpErrors.badRequest("User not found");
      }
      if (!targetUser) {
        throw this.httpErrors.badRequest("Target user not found");
      }
      if (
        !user.subscribedToUserIds.includes(request.params.id) ||
        request.body.userId === request.params.id
      ) {
        throw this.httpErrors.badRequest("Wrong target user");
      }
      try {
        const filteredUsers = user.subscribedToUserIds.filter(
          (id) => id !== request.params.id
        );
        return await this.db.users.change(request.body.userId, {
          subscribedToUserIds: filteredUsers,
        });
      } catch (error: any) {
        throw this.httpErrors.badRequest(error);
      }
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      try {
        return await this.db.users.change(request.params.id, request.body);
      } catch (error: any) {
        throw this.httpErrors.badRequest(error);
      }
    }
  );
};

export default plugin;
