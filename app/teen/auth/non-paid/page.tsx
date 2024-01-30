import { isTeenOnboarded } from "@/lib/actions/user"
import PayFeeButton from "./button"
import { redirect } from "next/navigation"

const NonPaid = async () => {
  const isOnBoarded = await isTeenOnboarded()

  if (isOnBoarded !== 'non-paid') return redirect('/teen/dashboard')

  return (
    <div className="text-center">
      <h2 className="text-lg text-gray-700 font-semibold mb-4">
        Le paiement des frais d'inscription est nécessaire pour accéder au réseau JobTeen.
      </h2>
      <PayFeeButton />
    </div>
  )
}

export default NonPaid