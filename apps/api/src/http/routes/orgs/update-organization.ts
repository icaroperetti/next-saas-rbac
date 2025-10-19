import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { BadRequestError } from "../_errors/bad-request-error";
import { organizationSchema } from "@saas/auth";
import { getUserPermissions } from "@/utils/get-user-permissions";

export async function updateOrganization(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().register(auth).put('/organization/:slug', {
		schema:{
			tags:['organizations'],
			summary:'Update Organization',
			body: z.object({
				name:z.string(),
				domain:z.string().nullish(),
				shouldAttachUsersByDomain: z.boolean().optional()
			}),
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

		const {name,domain,shouldAttachUsersByDomain} = request.body


		const authOrganization = organizationSchema.parse(organization)

		const {cannot} = getUserPermissions(userId,membership.role)

		if(cannot('update',authOrganization)){
			throw new BadRequestError('You do not have permission to update this organization')
		}

		if(domain){
			const orgByDomain = await prisma.organization.findFirst({
				where:{
					domain,
					slug:{not:organization.id}
				}
			})

			if(orgByDomain){
				throw new BadRequestError('Another organization already has this domain')
			}
		}

		 await prisma.organization.update({
			where:{
				id: organization.id
			},
			data:{
				name,
				domain,
				shouldAttachUsersByDomain,
			}
			})
			return reply.status(204).send()
		});
}
