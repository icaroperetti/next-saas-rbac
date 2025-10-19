import { auth } from "@/http/middlewares/auth";
import { roleSchema } from "@saas/auth";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod';

export async function getMembership(app:FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().register(auth).get('/organizations/:slug/membership',{
		schema:{
			tags: ['organizations'],
			summary:'Get user membership',
			params: z.object({
				slug: z.string()
			}),
			response:{
				200: z.object({
					membership: z.object({
						id:z.uuid(),
						organizationId:z.uuid(),
						role:roleSchema,
					})
				})
			}
		},
	},async (request) => {
		const {slug} = request.params

		const {membership} = await request.getUserMembership(slug)

		return {
			membership:{
				role: roleSchema.parse(membership.role),
				id:membership.id,
				organizationId: membership.organizationId
			}
		}
	})
}
