import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { roleSchema } from "@saas/auth";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { UnauthorizedError } from "../_errors/unauthorized-error";

export async function getMembers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/organizations/:orgSlug/members",
      {
        schema: {
          tags: ["members"],
          summary: "Get all members of org",
          params: z.object({
            orgSlug: z.string(),
          }),
          response: {
            200: z.object({
              members: z.array(
                z.object({
                  id: z.uuid(),
                  userId: z.uuid(),
                  role: roleSchema,
                  name: z.string().nullable(),
                  email: z.email(),
                  avatarUrl: z.url().nullable(),
                })
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const { orgSlug } = request.params;
        const userId = await request.getCurrentUserId();
        const { organization, membership } = await request.getUserMembership(
          orgSlug
        );

        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot("get", "User")) {
          throw new UnauthorizedError(
            "You are not allowed to see organization members"
          );
        }

        const members = await prisma.member.findMany({
          select: {
            id: true,
            role: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
          where: {
            organizationId: organization.id,
          },
          orderBy: {
            role: "asc",
          },
        });

        const membersWithRoles = members.map(
          ({ user: { id: userId, ...user }, ...member }) => {
            return {
              ...user,
              ...member,
              userId,
            };
          }
        );

        return reply.send({ members: membersWithRoles });
      }
    );
}
