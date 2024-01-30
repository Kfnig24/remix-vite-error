'use server'

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"
import { getAccountType, getTeenAccount } from "./cached_action"
import { redirect } from "next/navigation"
import { isAccountOnBoarded } from "./stripe"
import { createClient } from "@supabase/supabase-js"

// Users
export const createUser = async ({ account_type }: { account_type: 'teen' | 'client' }) => {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return null

    const { error, data } = await supabase.from('users').insert({ account_type: account_type, user_id: session.user.id }).select('id')

    revalidateTag('users')
    return {
        error,
        data
    }
}

export const signOut = async () => {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return redirect('/auth')

    await supabase.auth.signOut()
    return redirect('/auth')
}

export const deleteUser = async () => {
    const supabase = createServerActionClient<Database>({ cookies })
    const adminSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string)
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return redirect('/auth')

    const { error } = await adminSupabase.auth.admin.deleteUser(session.user.id)
    if (error) {
        console.log('Error')
        console.log(error)
        throw error
    }

    await supabase.auth.signOut()

    revalidateTag('users')
    revalidateTag('teens')
    revalidateTag('clients')
    return redirect('/')
}


// Teens
export const updateTeenPaidStatus = async (token: string | null) => {
    if (token !== process.env.ANTI_FRAUD_TOKEN) return redirect('/teen/auth/')

    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return null

    const account_type = await getAccountType(session.user.id)
    if (account_type !== 'teen') return null

    const { error } = await supabase.from('teens').update({ paid: true }).eq('user_id', session.user.id)
    if (error) return error

    revalidateTag('teens')
    return true
}

export const updateTeenStripeId = async (stripe_id: string) => {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return null

    const account_type = await getAccountType(session.user.id)
    if (account_type !== 'teen') return null

    const { error } = await supabase.from('teens').update({ stripe_id }).eq('user_id', session.user.id)
    if (error) return error

    revalidateTag('teens')
    return true
}

export const createTeenAccount = async ({ last_name, first_name, birthdate, registery_id }: { last_name: string, first_name: string, birthdate: Date, registery_id: number }) => {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return null

    const { error } = await supabase.from('teens').insert({
        last_name,
        first_name,
        birthdate: birthdate.toISOString(),
        user_id: session.user.id,
        registery_id
    })

    revalidateTag('teens')
    return error
}

export const isTeenOnboarded = async () => {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return redirect('/auth')

    const account_type = await getAccountType(session.user.id)
    if (!account_type) {
        return 'authenticated'
    }
    if (account_type !== 'teen') return redirect('/client/dashboard')

    const teen = await getTeenAccount(session.user.id)
    if (!teen?.paid) return 'non-paid'

    // if (!(await isAccountOnBoarded())) return await getAccountLink(headers().get("x-forwarded-host") || process.env.NODE_ENV === 'production' ? 'http://jobteen.lu' : 'http://localhost:300')
    if (!(await isAccountOnBoarded())) {
        return 'charges_unabled'
    }

    return 'onboarded'
}

export const updateTeenAccount = async ({ last_name, first_name, email } : { last_name: string, first_name: string, email: string }) => {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return redirect('/auth')

    const { error: emailErr } = await supabase.auth.updateUser({ email })
    if (emailErr) return emailErr.message

    const { error: dataErr } = await supabase.from('teens').update({
        first_name,
        last_name
    }).eq('user_id', session.user.id)
    if (dataErr) return dataErr.message

    revalidateTag('teens')
    return null
}


// Clients
export const createClientAccount = async ({ last_name, first_name, address, city, registery_id }: { last_name: string, first_name: string, address: string, city: string, registery_id: number }) => {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return null

    const { error } = await supabase.from('clients').insert({
        last_name,
        first_name,
        user_id: session.user.id,
        address,
        city,
        registery_id
    })

    revalidateTag('clients')
    return error
}

export const updateClientAccount = async ({ last_name, first_name, address, city, email }: { last_name: string, first_name: string, address: string, city: string, email: string }) => {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return redirect('/auth')

    const { error: emailErr } = await supabase.auth.updateUser({ email })
    if (emailErr) return emailErr.message

    const { error: dataErr } = await supabase.from('clients').update({
        address,
        city,
        first_name,
        last_name
    }).eq('user_id', session.user.id)
    if (dataErr) return dataErr.message

    revalidateTag('clients')
    return null
}

export const isClientOnboarded = async () => {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return redirect('/auth')

    const account_type = await getAccountType(session.user.id)
    if (!account_type) return 'authenticated'
    if (account_type !== 'client') return redirect('/teen/dashboard')

    return 'onboarded'
}