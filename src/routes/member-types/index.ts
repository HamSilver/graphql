import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { changeMemberTypeBodySchema } from "./schema";
import type { MemberTypeEntity } from "../../utils/DB/entities/DBMemberTypes";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<
    MemberTypeEntity[]
  > {
    return this.db.memberTypes.findMany();
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const result = await this.db.memberTypes.findOne({
        key: "id",
        equals: request.params.id,
      });
      if (!result) {
        throw this.httpErrors.notFound("Member Type not found");
      }
      return result;
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      try {
        return await this.db.memberTypes.change(
          request.params.id,
          request.body
        );
      } catch (error: any) {
        throw this.httpErrors.badRequest(error);
      }
    }
  );
};

export default plugin;
