import { createClient } from "@/lib/supabase/server";

export const metadata = {
    title: "অবস্থান",
};

type DivisionRow = {
    id: number;
    name: string;
    slug: string;
    sort_order: number;
    created_at: string;
};

type DistrictRow = {
    id: number;
    division_id: number;
    name: string;
    slug: string;
    sort_order: number;
    created_at: string;
};

export default async function AdminLocationsPage() {
    const supabase = await createClient();

    const { data: divisionsRaw, error: divError } = await supabase
        .from("divisions")
        .select("id, name, slug, sort_order, created_at")
        .order("sort_order");

    const { data: districtsRaw, error: distError } = await supabase
        .from("districts")
        .select("id, division_id, name, slug, sort_order, created_at")
        .order("sort_order");

    if (divError || distError) {
        console.error(
            "[OpenWitness] Locations query failed:",
            JSON.stringify(
                {
                    divisions: divError
                        ? { code: divError.code, message: divError.message }
                        : null,
                    districts: distError
                        ? { code: distError.code, message: distError.message }
                        : null,
                },
                null,
                2,
            ),
        );
    }

    const divisions: DivisionRow[] = (divisionsRaw ?? []) as DivisionRow[];
    const districts: DistrictRow[] = (districtsRaw ?? []) as DistrictRow[];

    const districtsByDivision = new Map<number, DistrictRow[]>();
    for (const d of districts) {
        const list = districtsByDivision.get(d.division_id) ?? [];
        list.push(d);
        districtsByDivision.set(d.division_id, list);
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">
                    অবস্থান
                </h1>

                <p className="mt-1 text-sm text-zinc-500">
                    বাংলাদেশের ৮টি বিভাগ ও ৬৪টি জেলা।
                </p>
            </div>

            {divError || distError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
                    <p className="font-semibold">তথ্য লোড করা যায়নি।</p>
                    <p className="mt-1">কিছুক্ষণ পর পৃষ্ঠাটি রিফ্রেশ করুন।</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {divisions.map((division) => {
                        const divDistricts =
                            districtsByDivision.get(division.id) ?? [];

                        return (
                            <div
                                key={division.id}
                                className="rounded-2xl border border-zinc-200 bg-white p-6"
                            >
                                <div className="flex items-center gap-3">
                                    <h2 className="text-lg font-bold">
                                        {division.name}
                                    </h2>

                                    <span className="text-xs text-zinc-400">
                                        {division.slug}
                                    </span>

                                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
                                        {divDistricts.length} জেলা
                                    </span>
                                </div>

                                <div className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                    {divDistricts.map((district) => (
                                        <div
                                            key={district.id}
                                            className="rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3"
                                        >
                                            <p className="text-sm font-medium">
                                                {district.name}
                                            </p>

                                            <p className="text-xs text-zinc-400">
                                                {district.slug}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
