export default function Loading() {
    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">
                <div className="flex items-center justify-between">
                    <div className="h-8 w-32 animate-pulse rounded bg-zinc-100" />

                    <div className="hidden gap-8 md:flex">
                        <div className="h-4 w-16 animate-pulse rounded bg-zinc-100" />
                        <div className="h-4 w-16 animate-pulse rounded bg-zinc-100" />
                        <div className="h-10 w-28 animate-pulse rounded-full bg-zinc-100" />
                    </div>

                    <div className="h-9 w-24 animate-pulse rounded-full bg-zinc-100 md:hidden" />
                </div>
            </div>

            <div className="border-t border-zinc-100">
                <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
                    <div className="max-w-4xl">
                        <div className="mb-6 h-4 w-40 animate-pulse rounded bg-zinc-100" />

                        <div className="h-12 w-3/4 animate-pulse rounded bg-zinc-100 sm:h-16 lg:h-20" />

                        <div className="mt-8 h-6 w-2/3 animate-pulse rounded bg-zinc-100" />

                        <div className="mt-10 flex gap-3">
                            <div className="h-12 w-40 animate-pulse rounded-full bg-zinc-100" />
                            <div className="h-12 w-40 animate-pulse rounded-full bg-zinc-100" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-zinc-100">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i}>
                                <div className="h-4 w-24 animate-pulse rounded bg-zinc-100" />
                                <div className="mt-3 h-10 w-16 animate-pulse rounded bg-zinc-100" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
