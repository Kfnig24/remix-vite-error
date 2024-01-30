import { paidJob } from "@/lib/actions/job"
import { Loader2 } from "lucide-react"
import { redirect } from "next/navigation"

const PayCallback = async ({ params: { id }, searchParams: { token, prop } }: { params: { id: number }, searchParams: { token: string, prop: number } }) => {
    if (token !== process.env.ANTI_FRAUD_TOKEN) return redirect(`/client/jobs/${id}`)
    if (!prop) return redirect(`/client/jobs/${id}`)

    await paidJob(id, prop, token)

    return (
        <div className="w-full h-full justify-center items-center flex">
            <Loader2 className="h-8 animate-spin text-primary" />
        </div>
    )
}

export default PayCallback