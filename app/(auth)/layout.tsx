import Logo from "@/components/logo"

const AuthLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div className="relative flex justify-center items-center h-screen w-screen overflow-hidden bg-gradient-to-br from-white to-primary/20">
            <div className="absolute top-8 left-8">
                <Logo />
            </div>

            <main className="p-8 border-[1px] rounded-lg shadow-sm bg-white">
                {children}
            </main>
        </div>
    )
}

export default AuthLayout