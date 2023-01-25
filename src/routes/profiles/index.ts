import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { createProfileBodySchema, changeProfileBodySchema } from "./schema";
import type { ProfileEntity } from "../../utils/DB/entities/DBProfiles";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<ProfileEntity[]> {
    return this.db.profiles.findMany();
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const result = await this.db.profiles.findOne({
        key: "id",
        equals: request.params.id,
      });
      if (!result) {
        throw this.httpErrors.notFound("Profile not found");
      }
      return result;
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await this.db.profiles.findOne({
        key: "userId",
        equals: request.body.userId,
      });
      const memberType = await this.db.memberTypes.findOne({
        key: "id",
        equals: request.body.memberTypeId,
      });
      if (profile) {
        throw this.httpErrors.badRequest("Profile already exists");
      }
      if (!memberType) {
        throw this.httpErrors.badRequest("Member Type not found");
      }
      return this.db.profiles.create(request.body);
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await this.db.profiles.findOne({
        key: "id",
        equals: request.params.id,
      });
      if (!profile) {
        throw this.httpErrors.badRequest("Profile not found");
      }
      return await this.db.profiles.delete(request.params.id);
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      try {
        return await this.db.profiles.change(request.params.id, request.body);
      } catch (error: any) {
        throw this.httpErrors.badRequest(error);
      }
    }
  );
};

export default plugin;
