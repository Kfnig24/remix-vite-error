'use client'

import { Button } from "@/components/ui/button"
import { createProposition, deleteProposition } from "@/lib/actions/job"

export const PropositionButton = ({ job_id }: { job_id: number }) => {
    return (
        <Button onClick={async () => await createProposition(job_id)} size={'lg'}>
            Se proposer
        </Button>
    )
}

export const RetirePropositionButton = ({ job_id }: { job_id: number }) => {
    return (
        <Button onClick={async () => await deleteProposition(job_id)} variant={'destructive'} size={'lg'}>
            Se retirer
        </Button>
    )
}