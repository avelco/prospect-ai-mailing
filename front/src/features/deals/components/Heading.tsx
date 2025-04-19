
export const Heading = () => {
    return (
        <div className="border-b border-slate-200 bg-white/25 px-4 py-6 lg:px-8">
            <nav className="mb-6 flex flex-wrap items-center gap-3 md:gap-10 lg:mb-10">
                <a href="javascript:void(0)" className="font-medium text-slate-950 underline decoration-slate-300 decoration-2 underline-offset-8 md:text-xl">Projects</a>
                <a href="javascript:void(0)" className="font-medium text-slate-500 underline decoration-transparent decoration-2 underline-offset-8 hover:text-slate-700 hover:decoration-slate-300 md:text-xl">Personal</a>
                <a href="javascript:void(0)" className="font-medium text-slate-500 underline decoration-transparent decoration-2 underline-offset-8 hover:text-slate-700 hover:decoration-slate-300 md:text-xl">Team</a>
                <a href="javascript:void(0)" className="font-medium text-slate-500 underline decoration-transparent decoration-2 underline-offset-8 hover:text-slate-700 hover:decoration-slate-300 md:text-xl">Company</a>
            </nav>
            <h1 className="text-2xl font-bold lg:text-3xl">Board</h1>
        </div>
    )
}
