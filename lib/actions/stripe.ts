'use server'

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import Stripe from "stripe"
import { updateTeenStripeId } from "./user"
import { getAccountType, getPropositionFromId, getTeenAccount } from "./cached_action"

export const payFee = async (origin: string) => {
    const supabase = createServerActionClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return redirect('/auth')

    const teen = await getTeenAccount(session.user.id)
    if (teen?.paid) return redirect('/teen/auth/payFee?status=success')

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

    const stripeSession = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
            {
                price_data: {
                    currency: 'EUR',
                    product_data: {
                        name: "Frais JobTeen"
                    },
                    unit_amount: 1499
                },
                quantity: 1
            }
        ],
        success_url: `${origin}/teen/auth/payFee?status=success&token=${process.env.ANTI_FRAUD_TOKEN}`,
        cancel_url: `${origin}/teen/auth/payFee?status=canceled`
    })
    return redirect(stripeSession.url as string)
}

export const createStripeAccount = async (origin: string): Promise<never> => {
    const supabase = createServerActionClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return redirect('/auth')

    const userAccountType = await getAccountType(session.user.id)
    if (userAccountType !== 'teen') return redirect(`/${userAccountType}/dashboard`)

    const teen = await getTeenAccount(session.user.id)
    if (!teen) return redirect('/auth')

    if (teen.stripe_id) return await getAccountLink(origin)

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
    const account = await stripe.accounts.create({
        type: 'standard',
        email: teen.email,
        business_type: 'individual',
        business_profile: {
            product_description: 'Service au particuliers et entreprises via JobTeen',
            url: 'http://jobteen.lu',
            mcc: '8999',
        },
        individual: {
            first_name: teen.first_name,
            last_name: teen.last_name,
            email: teen.email,
        }
    })
    await updateTeenStripeId(account.id)

    return await getAccountLink(origin)
}

export const getAccountLink = async (origin: string): Promise<never> => {
    const supabase = createServerActionClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return redirect('/auth')

    const userAccountType = await getAccountType(session.user.id)
    if (userAccountType !== 'teen') return redirect(`/${userAccountType}/dashboard`)

    const teen = await getTeenAccount(session.user.id)
    if (!teen) return redirect('/teen/auth')
    if (!teen.stripe_id) return await createStripeAccount(origin)

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
    const accountLink = await stripe.accountLinks.create({
        account: teen.stripe_id,
        type: 'account_onboarding',
        return_url: `${origin}/teen/auth/stripeOnboarding?status=return`,
        refresh_url: `${origin}/teen/auth/stripeOnboarding?status=refresh`,
    })

    return redirect(accountLink.url)
}

export const isAccountOnBoarded = async () => {
    const supabase = createServerActionClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return redirect('/auth')

    const userAccountType = await getAccountType(session.user.id)
    if (userAccountType !== 'teen') return redirect(`/${userAccountType}/dashboard`)

    const teen = await getTeenAccount(session.user.id)
    if (!teen) return redirect('/teen/auth')
    if (!teen.stripe_id) return false

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
    const account = await stripe.accounts.retrieve({
        stripeAccount: teen.stripe_id
    })

    return account.charges_enabled
}

export const payJob = async (proposition_id: number, origin: string) => {
    const supabase = createServerActionClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return redirect('/auth')

    const userAccountType = await getAccountType(session.user.id)
    if (userAccountType !== 'client') return redirect(`/${userAccountType}/dashboard`)

    const prop = await getPropositionFromId(proposition_id)
    if (!prop) return null

    if (!prop.teens?.stripe_id) return redirect(`/client/jobs/${prop.jobs?.id}`)

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
    const stripeSession = await stripe.checkout.sessions.create(
        {
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'EUR',
                        product_data: {
                            name: "Paiement du job",
                            description: `Paiment pour le job: ${prop.jobs?.title}`
                        },
                        unit_amount: 1999
                    },
                    quantity: 1
                }
            ],
            payment_intent_data: {
                application_fee_amount: 200
            },
            success_url: `${origin}/client/jobs/${prop.jobs?.id}/payCallback?token=${process.env.ANTI_FRAUD_TOKEN}&prop=${proposition_id}`,
            cancel_url: `${origin}/client/jobs/${prop.jobs?.id}`
        },
        {
            stripeAccount: prop.teens.stripe_id,
        }
    )

    return redirect(stripeSession.url as string)
} 