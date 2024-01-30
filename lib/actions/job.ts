'use server'

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAccountType, getJob, getTeenAccount } from "./cached_action";
import { revalidateTag } from "next/cache";
import { payJob } from "./stripe";

// Jobs
export const createJob = async (values: {
    categorie: string;
    date: Date;
    description: string;
    title: string;
}) => {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return redirect('/auth')

    const account_type = await getAccountType(session.user.id)
    if (!account_type) return redirect('/onboarding')
    if (account_type !== 'client') return redirect('/teen/dashboard')

    const { data, error } = await supabase.from('jobs').insert({
        author: session.user.id,
        date: values.date.toISOString(),
        title: values.title,
        description: values.description,
        categorie: values.categorie
    }).select()
    if (error) throw error

    revalidateTag('jobs')
    return data
}

export const deleteJob = async (id: number) => {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return redirect('/auth')

    await supabase.from('jobs').delete().eq('id', id)

    revalidateTag('jobs')
    return redirect('/client/dashboard')
}

export const updateJob = async (id: number, values: {
    categorie: string;
    description: string;
    title: string;
}) => {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return redirect('/auth')

    const account_type = await getAccountType(session.user.id)
    if (!account_type) return redirect('/onboarding')
    if (account_type !== 'client') return redirect('/teen/dashboard')

    const { data, error } = await supabase.from('jobs').update({
        title: values.title,
        description: values.description,
        categorie: values.categorie
    }).eq('id', id).select()
    if (error) throw error

    revalidateTag('jobs')
    return data
}

export const paidJob = async (job_id: number, proposition_id: number, token: string) => {
    if (token !== process.env.ANTI_FRAUD_TOKEN) return redirect(`/client/jobs/${job_id}`)

    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return redirect('/auth')

    const account_type = await getAccountType(session.user.id)
    if (!account_type) return redirect('/onboarding')
    if (account_type !== 'client') return redirect('/teen/dashboard')

    await supabase.from('jobs').update({ paid: true }).eq('id', job_id)
    await supabase.from('propositions').update({ accepted: true }).eq('id', proposition_id)

    revalidateTag('propositions')
    revalidateTag('jobs')
    return redirect(`/client/jobs/${job_id}`)
}

export const completeJob = async (job_id: number) => {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return redirect('/auth')

    const account_type = await getAccountType(session.user.id)
    if (!account_type) return redirect('/onboarding')
    if (account_type !== 'client') return redirect('/teen/dashboard')

    await supabase.from('jobs').update({ completed: true }).eq('id', job_id).eq('paid', true)

    revalidateTag('jobs')
    return redirect(`/client/jobs/${job_id}/note`)
}


// Propositions
export const checkIfTeenProposed = async (job_id: number) => {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return redirect('/auth')

    const account_type = await getAccountType(session.user.id)
    if (!account_type) return redirect('/onboarding')
    if (account_type !== 'teen') return redirect('/client/dashboard')

    const { data } = await supabase.from('propositions').select('id, accepted').eq('user_id', session.user.id).eq('job', job_id).single()

    if (!data) return null

    return data
}

export const createProposition = async (job_id: number) => {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return redirect('/auth')

    const account_type = await getAccountType(session.user.id)
    if (!account_type) return redirect('/onboarding')
    if (account_type !== 'teen') return redirect('/client/dashboard')

    const teen = await getTeenAccount(session.user.id)
    if (!teen) return redirect('/teen/onboarding')

    const job = await getJob(job_id)
    if (!job) return redirect('/teen/dashboard')

    await supabase.from('propositions').insert({
        client_id: job.author.user_id,
        user_id: session.user.id,
        teen: teen.id,
        job: job_id
    })

    revalidateTag('propositions')
    return redirect(`/teen/jobs/${job_id}`)
}

export const deleteProposition = async (job_id: number) => {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return redirect('/auth')

    const account_type = await getAccountType(session.user.id)
    if (!account_type) return redirect('/onboarding')
    if (account_type !== 'teen') return redirect('/client/dashboard')

    await supabase.from('propositions').delete().eq('job', job_id).eq('user_id', session.user.id)

    revalidateTag('propositions')
    return redirect(`/teen/jobs/${job_id}`)
}

export const acceptProposition = async (proposition_id: number, origin: string) => {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return redirect('/auth')

    const account_type = await getAccountType(session.user.id)
    if (!account_type) return redirect('/onboarding')
    if (account_type !== 'client') return redirect('/teen/dashboard')

    return await payJob(proposition_id, origin)
}