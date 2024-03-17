import { WebhookEvent } from "@clerk/remix/api.server";
import { ActionFunction, json } from "@vercel/remix";
import prisma from "~/lib/db";

export const action: ActionFunction = async (args) => {
    if(args.request.method !== 'POST') {
        return json({ message: "Method not allowed" }, 405)
    }

    const { data, type }: WebhookEvent = await args.request.json() 
    if (!data || !type) return json({ message: "Missing payload" }, 400)

    if (type !== "user.deleted") return 

    await prisma.job.deleteMany({ where: { author: data.id } })

    await prisma.proposition.deleteMany({ where: { teen: data.id } })
    await prisma.stripeVerificationToken.deleteMany({ where: { user_id: data.id } })
    await prisma.customer.deleteMany({ where: { OR: [{ teen: data.id }, { pro: data.id }] } })

    return json({ message: "User deleted on db" }, 200)
}