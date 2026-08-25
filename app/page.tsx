import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight"
            aria-label="OpenWitness হোম"
          >
            OpenWitness
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <Link
              href="/incidents"
              className="transition-colors hover:text-zinc-500"
            >
              প্রকাশিত ঘটনা
            </Link>

            <Link
              href="/report"
              className="rounded-full bg-zinc-950 px-5 py-2.5 text-white transition-colors hover:bg-zinc-800"
            >
              ঘটনা রিপোর্ট করুন
            </Link>
          </nav>

          <Link
            href="/report"
            className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white md:hidden"
          >
            রিপোর্ট করুন
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-zinc-200">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <p className="mb-6 text-sm font-semibold tracking-wide text-zinc-500">
              বাংলাদেশের জনস্বার্থে
            </p>

            <h1 className="text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-7xl">
              আপনার এলাকার গুরুত্বপূর্ণ ঘটনা জানান।
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-600 sm:text-xl">
              পরিচয় প্রকাশ না করেই জনস্বার্থ সংশ্লিষ্ট ঘটনা রিপোর্ট করুন।
              প্রতিটি রিপোর্ট যাচাই ও moderation-এর পর প্রকাশ করা হয়।
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/report"
                className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-zinc-800"
              >
                ঘটনা রিপোর্ট করুন
              </Link>

              <Link
                href="/incidents"
                className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-7 py-3.5 text-base font-semibold transition-colors hover:bg-zinc-100"
              >
                প্রকাশিত ঘটনা দেখুন
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Privacy */}
      <section className="border-b border-zinc-200 bg-zinc-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-3 lg:px-8">
          <div>
            <div className="mb-4 text-2xl font-bold">পরিচয় গোপন</div>
            <p className="leading-7 text-zinc-600">
              রিপোর্ট করার জন্য কোনো account, login, নাম, email বা phone
              number প্রয়োজন নেই।
            </p>
          </div>

          <div>
            <div className="mb-4 text-2xl font-bold">বাংলাদেশজুড়ে</div>
            <p className="leading-7 text-zinc-600">
              বাংলাদেশের ৮টি বিভাগ এবং ৬৪টি জেলার ভিত্তিতে ঘটনা খুঁজে পাওয়া
              যাবে।
            </p>
          </div>

          <div>
            <div className="mb-4 text-2xl font-bold">Moderation</div>
            <p className="leading-7 text-zinc-600">
              প্রকাশের আগে প্রতিটি রিপোর্ট moderation প্রক্রিয়ার মধ্য দিয়ে
              যায়।
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-zinc-200">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-wide text-zinc-500">
              কীভাবে কাজ করে
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              তিনটি সহজ ধাপ
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="border-t-2 border-zinc-950 pt-6">
              <span className="text-sm font-semibold text-zinc-500">০১</span>

              <h3 className="mt-4 text-xl font-bold">
                ঘটনা রিপোর্ট করুন
              </h3>

              <p className="mt-3 leading-7 text-zinc-600">
                ঘটনার তথ্য, বিভাগ, জেলা এবং প্রয়োজনীয় বিবরণ দিন।
              </p>
            </div>

            <div className="border-t-2 border-zinc-950 pt-6">
              <span className="text-sm font-semibold text-zinc-500">০২</span>

              <h3 className="mt-4 text-xl font-bold">
                Moderation
              </h3>

              <p className="mt-3 leading-7 text-zinc-600">
                রিপোর্টটি moderation প্রক্রিয়ায় পর্যালোচনা করা হবে।
              </p>
            </div>

            <div className="border-t-2 border-zinc-950 pt-6">
              <span className="text-sm font-semibold text-zinc-500">০৩</span>

              <h3 className="mt-4 text-xl font-bold">
                প্রকাশ
              </h3>

              <p className="mt-3 leading-7 text-zinc-600">
                অনুমোদিত রিপোর্ট public platform-এ প্রকাশিত হবে।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="rounded-3xl bg-zinc-950 px-6 py-14 text-white sm:px-12 lg:px-16">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                আপনার জানা কোনো গুরুত্বপূর্ণ ঘটনা আছে?
              </h2>

              <p className="mt-5 text-base leading-7 text-zinc-300 sm:text-lg">
                পরিচয় প্রকাশ না করেই ঘটনাটি রিপোর্ট করুন।
              </p>

              <Link
                href="/report"
                className="mt-8 inline-flex rounded-full bg-white px-7 py-3.5 font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
              >
                ঘটনা রিপোর্ট করুন
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>
            © {new Date().getFullYear()} OpenWitness
          </p>

          <p>
            বাংলাদেশের জনস্বার্থে একটি anonymous reporting platform
          </p>
        </div>
      </footer>
    </main>
  );
}