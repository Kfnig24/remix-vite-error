import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { unstable_cache } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Users
export const getAccountType = unstable_cache(async (id: string) => {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return null

    const { data } = await supabase.from('users').select('account_type, user_id').eq('user_id', id)
    if (!data || !data[0]) return null

    return data[0].account_type
}, [], { tags: ['users'], revalidate: 3600 })


// Teens
export const getTeenAccount = unstable_cache(async (id: string) => {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return null

    const { data } = await supabase.from('teens').select().eq('user_id', id)
    if (!data || !data[0]) return null

    return {
        email: session.user.email,
        ...data[0]
    }
}, [], { tags: ['teens'], revalidate: 3600 })


// Clients
export const getClientAccount = unstable_cache(async (id: string) => {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return null

    const { data } = await supabase.from('clients').select().eq('user_id', id)
    if (!data || !data[0]) return null

    return {
        email: session.user.email,
        ...data[0]
    }
}, [], { tags: ['clients'], revalidate: 3600 })


// Jobs
export const getLatestJobsFromClient = unstable_cache(async (clientId: string) => {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return null

    const { data } = await supabase.from('jobs').select('title, description, date, id, categorie').eq('author', clientId).eq('completed', false).eq('paid', false).order('created_at', { ascending: false })

    if (!data) return null

    return data
}, [], { tags: ['jobs'], revalidate: 3600 })

export const getPaidJobsFromClient = unstable_cache(async () => {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return null

    const { data } = await supabase.from('jobs').select('title, description, date, id, categorie').eq('author', session.user.id).eq('completed', false).eq('paid', true).order('created_at', { ascending: false })

    if (!data) return null

    return data
}, [], { tags: ['jobs'], revalidate: 3600 })

export const getCompleteJobsFromClient = unstable_cache(async () => {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return null

    const { data } = await supabase.from('jobs').select('title, description, date, id, categorie').eq('author', session.user.id).eq('completed', true).eq('paid', true).order('created_at', { ascending: false })

    if (!data) return null

    return data
}, [], { tags: ['jobs'], revalidate: 3600 })

export const getJobsFromCategorie = unstable_cache(async (categorie: string) => {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return null

    const { data } = await supabase.from('jobs').select('title, description, date, id, categorie').eq('categorie', categorie).eq('completed', false).eq('paid', false)

    if (!data) return null

    return data
}, [], { tags: ['jobs'], revalidate: 3600 })

export const getJob = unstable_cache(async (id: number) => {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return null

    const { data } = await supabase.from('jobs').select().eq('id', id)
    if (!data || !data[0]) return null

    const author = await getClientAccount(data[0].author)
    if (!author) return null

    return {
        ...data[0],
        author
    }
}, [], { tags: ['jobs'], revalidate: 3600 * 24 })


// Propositions
export const getPropositionsFromJob = unstable_cache(async (job_id: number) => {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return null
    
    const { data } = await supabase.from('propositions').select(`
        accepted,
        teens (
            first_name,
            last_name,
            note
        ),
        user_id,
        id
    `).eq('job', job_id)

    return data
}, [], { tags: ['propositions'], revalidate: 3600 })

export const getPropositionsFromTeen = unstable_cache(async () => {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return redirect('/auth')

    const account_type = await getAccountType(session.user.id)
    if (!account_type) return redirect('/onboarding')
    if (account_type !== 'teen') return redirect('/client/dashboard')

    const { data } = await supabase.from('propositions').select(`
        accepted,
        jobs (
            id,
            title,
            description,
            date,
            categorie,
            completed
        )
    `).eq('user_id', session.user.id)

    return data
}, [], { tags: ['propositions'], revalidate: 3600 })

export const getPropositionFromId = unstable_cache(async (id: number) => {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return redirect('/auth')

    const { data } = await supabase.from('propositions').select(`
        accepted,
        jobs (
            id,
            title,
            description,
            date,
            categorie
        ),
        teens (
            stripe_id
        )
    `).eq('id', id).single()

    return data
}, [], { tags: ['propositions'], revalidate: 3600 })