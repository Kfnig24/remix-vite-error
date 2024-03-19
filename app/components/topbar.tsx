
import { UserButton } from "@clerk/remix";

const Topbar = () => {
    return (
        <div className="p-6 w-full flex flex-row justify-between items-center font-semibold text-gray-700">
            <div>
                <UserButton />
            </div>

        </div>
    )
}

export default Topbar