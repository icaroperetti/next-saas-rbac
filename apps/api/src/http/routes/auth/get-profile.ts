import { prisma } from "@/lib/prisma";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";


export async function getProfile(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get("/profile",{
		schema: {
			tags: ['auth'],
			summary:'Get authenticate user',
			response: {
				200: z.object({
  					user: z.object({
							id: z.uuid(),
							name: z.string().nullable(),
							email:z.email(),
							avatarUrl:z.url().nullable()
						})
				})
			}
		}
	}, async (request,reply) => {
		const {sub}= await request.jwtVerify<{sub: string}>()

		const user = await prisma.user.findUnique({
		where: {
			id: sub,
		},
		select: {
			id: true,
			name: true,
			email: true,
			avatarUrl: true,
		},
		})

		if(!user) {
			throw new Error('User not find')
		}
		return reply.send({user})

	})
}
