import { getAuth } from "@clerk/remix/ssr.server";
import { ActionFunction, redirect } from "@remix-run/node";
import prisma from "~/lib/db";

export const action: ActionFunction = async (args) => {
    const { userId } = await getAuth(args)
    if (!userId) return redirect(`/auth/sign-in`)

    const job_id = args.params.jobId
    if (!job_id) return redirect(`/dashboard`)

    const formData = await args.request.formData()

    const hours = formData.get('hours')
    const date_year = formData.get('date_year')
    const date_month = formData.get('date_month')
    const date_day = formData.get('date_day')
    const title = formData.get('title')
    const description = formData.get('description')
    const categorie = formData.get('categorie')
    if (!date_year || !date_month || !date_day || !hours || !title || !description || !categorie) return redirect(`/dashboard/jobs/${job_id}`)

    const data = {
        title: title.toString(),
        description: description.toString(),
        categorie: categorie.toString(),
        hours: +hours,
        date: new Date(+date_year, +date_month, +date_day + 2)
    }

    await prisma.job.update({ where: { id: job_id, author: userId }, data })

    return redirect(`/dashboard/jobs/${job_id}`)
}