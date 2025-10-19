import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { BadRequestError } from "../_errors/bad-request-error";
import { createSlug } from "@/utils/create-slug";

export async function createOrganization(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().register(auth).post('/organizations', {
		schema:{
			tags:['organizations'],
			summary:'Create Organization',
			body: z.object({
				name:z.string(),
				domain:z.string().nullish(),
				shouldAttachUsersByDomain: z.boolean().optional()
			}),
			response:{
				201: z.object({
					organizationId:z.uuid()
				})
			}
		},
	}, async (request,reply) => {
		const userId = await request.getCurrentUserId()
		const {name,domain,shouldAttachUsersByDomain} = request.body


		if(domain){
			const orgByDomain = await prisma.organization.findUnique({
				where:{
					domain
				}
			})

			if(orgByDomain){
				throw new BadRequestError('Another organization already has this domain')
			}
		}

		const organization = await prisma.organization.create({
			data:{
				name,
				domain,
				slug:createSlug(name),
				shouldAttachUsersByDomain,
				ownerId:userId,
				members: {
					create:{
						userId,
						role:'ADMIN'
					}
				}
			}
			})

			return reply.status(201).send({organizationId: organization.id})
	});
}
