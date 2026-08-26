import { createClient } from "@/lib/supabase/server";
import CategoryForm from "./CategoryForm";

type CategoryRow = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
};

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export const metadata = {
    title: "শ্রেণি ব্যবস্থাপনা",
};

export default async function AdminCategoriesPage() {
    const supabase = await createClient();

    const { data: categoriesRaw, error: queryError } = await supabase
        .from("categories")
        .select("id, name, slug, description, is_active, sort_order, created_at")
        .order("sort_order", { ascending: true });

    if (queryError) {
        console.error(
            "[OpenWitness] Categories query failed:",
            JSON.stringify(
                {
                    code: queryError.code,
                    message: queryError.message,
                    details: queryError.details,
                    hint: queryError.hint,
                },
                null,
                2,
            ),
        );
    }

    const categories: CategoryRow[] = (categoriesRaw ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        is_active: row.is_active,
        sort_order: row.sort_order,
        created_at: row.created_at,
    }));

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        শ্রেণি ব্যবস্থাপনা
                    </h1>

                    <p className="mt-1 text-sm text-zinc-500">
                        ঘটনা শ্রেণি তৈরি, সম্পাদনা এবং পরিচালনা করুন।
                    </p>
                </div>

                <CategoryForm mode="create" />
            </div>

            {queryError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
                    <p className="font-semibold">
                        তথ্য লোড করা যায়নি।
                    </p>
                    <p className="mt-1">
                        কিছুক্ষণ পর পৃষ্ঠাটি রিফ্রেশ করুন।
                    </p>
                </div>
            ) : categories.length === 0 ? (
                <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center">
                    <h2 className="text-lg font-semibold">
                        কোনো শ্রেণি নেই
                    </h2>

                    <p className="mt-2 text-sm text-zinc-500">
                        প্রথম শ্রেণিটি তৈরি করুন।
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className={`rounded-2xl border bg-white p-5 transition ${
                                category.is_active
                                    ? "border-zinc-200"
                                    : "border-zinc-200 bg-zinc-50 opacity-75"
                            }`}
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="font-semibold">
                                            {category.name}
                                        </span>

                                        <span className="text-xs text-zinc-400">
                                            {category.slug}
                                        </span>

                                        {!category.is_active ? (
                                            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
                                                নিষ্ক্রিয়
                                            </span>
                                        ) : null}

                                        <span className="text-xs text-zinc-400">
                                            ক্রম: {category.sort_order}
                                        </span>
                                    </div>

                                    {category.description ? (
                                        <p className="mt-2 text-sm text-zinc-500">
                                            {category.description}
                                        </p>
                                    ) : null}

                                    <p className="mt-1 text-xs text-zinc-400">
                                        তৈরি: {formatDate(category.created_at)}
                                    </p>
                                </div>

                                <div className="flex-shrink-0">
                                    <CategoryForm
                                        mode="edit"
                                        category={category}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
