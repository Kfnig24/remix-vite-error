'use client'

import { Button } from "@/components/ui/button"
import { acceptProposition, completeJob } from "@/lib/actions/job"
import { CheckCircle2 } from "lucide-react"

export const FinishButton = ({ job_id } : { job_id: number }) => {
    return (
        <Button onClick={async () => await completeJob(job_id)}>
            Terminé
        </Button>
    )
}

const PropositionButtons = ({ prop_id } : { prop_id: number }) => {
    return (
        <div className="flex flex-row gap-4">
            <Button onClick={async () => await acceptProposition(prop_id, location.origin)} size={'icon'}>
                <CheckCircle2 />
            </Button>
        </div>
    )
}

export default PropositionButtons