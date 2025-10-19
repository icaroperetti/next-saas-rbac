import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { BadRequestError } from "../_errors/bad-request-error";
import { organizationSchema } from "@saas/auth";
import { getUserPermissions } from "@/utils/get-user-permissions";

export async function shutDownOrganization(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().register(auth).delete('/organization/:slug', {
		schema:{
			tags:['organizations'],
			summary:'Shutdown Organization',
			params: z.object({
				slug:z.string()
			}),
			response:{
				204: z.null()
			}
		},
	}, async (request,reply) => {
		const {slug} = request.params
		const userId = await request.getCurrentUserId()
		const {membership,organization} = await request.getUserMembership(slug)

		const authOrganization = organizationSchema.parse(organization)

		const {cannot} = getUserPermissions(userId,membership.role)

		if(cannot('delete',authOrganization)){
			throw new BadRequestError('You do not have permission to shutdown this organization')
		}

		 await prisma.organization.delete({
			where:{
				id: organization.id
			},
		})
			return reply.status(204).send()
		});
}
