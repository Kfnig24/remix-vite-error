import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAccountType } from "@/lib/actions/cached_action";

export const GET = async (req: NextRequest, res: NextResponse) => {
  const supabase = createRouteHandlerClient<Database>({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) return NextResponse.redirect(new URL('/auth'), { status: 401 })

  const account_type = await getAccountType(session.user.id)
  if (account_type) return NextResponse.redirect(new URL(`/${account_type}/dashboard`, req.url))


  return NextResponse.redirect(new URL('/onboarding', req.url))
}