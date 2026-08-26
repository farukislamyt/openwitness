import PolicyLayout from "@/components/PolicyLayout";

export const metadata = {
    title: "Privacy Policy",
    description:
        "OpenWitness Privacy Policy — কোন তথ্য সংগ্রহ করা হয়, কোনটি নয়।",
};

export default function PrivacyPage() {
    return (
        <PolicyLayout
            title="Privacy Policy"
            subtitle="OpenWitness কী তথ্য সংগ্রহ করে এবং কীভাবে সেগুলো রক্ষা করা হয়।"
            lastUpdated="২০২৬ সাল, ২৬ আগস্ট"
        >
            <h2>১. তথ্য সংগ্রহ</h2>

            <h3>১.১ আমরা যা সংগ্রহ করি</h3>

            <p>
                রিপোর্ট জমা দেওয়ার সময় আমরা শুধুমাত্র
                নিম্নলিখিত তথ্য সংগ্রহ করি:
            </p>

            <ul>
                <li>
                    <strong>ঘটনার তথ্য:</strong> শিরোনাম,
                    বিবরণ, শ্রেণি, বিভাগ, জেলা এবং
                    ঘটনার তারিখ।
                </li>

                <li>
                    <strong>সময়সীমা:</strong> রিপোর্ট জমা
                    দেওয়ার সময় (created_at) এবং
                    আপডেটের সময় (updated_at)।
                </li>
            </ul>

            <h3>১.২ আমরা যা সংগ্রহ করি না</h3>

            <ul>
                <li>নাম</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>ঠিকানা</li>
                <li>IP address</li>
                <li>ব্রাউজার তথ্য</li>
                <li>Device fingerprint</li>
                <li>কোনো পরিচয়মূলক তথ্য</li>
            </ul>

            <h2>২. IP/Logging Policy</h2>

            <p>
                OpenWitness <strong>IP address সংগ্রহ বা
                লগ করে না।</strong> আমাদের সার্ভার লগে
                কোনো ব্যবহারকারীর IP address সংরক্ষিত
                হয় না।
            </p>

            <p>
                রিপোর্ট জমা দেওয়ার সময় কোনো
                fingerprinting, tracking, বা analytics
                ব্যবহার করা হয় না।
            </p>

            <h2>৩. Cookies</h2>

            <p>
                OpenWitness <strong>কোনো tracking cookie
                ব্যবহার করে না।</strong> শুধুমাত্র
                প্রয়োজনীয় session cookies ব্যবহার
                করা হয়:
            </p>

            <ul>
                <li>
                    <strong>Session cookie:</strong>{" "}
                    authenticated ব্যবহারকারীদের
                    (শুধুমাত্র admin/staff) login
                    অবস্থা বজায় রাখতে।
                </li>
            </ul>

            <p>
                তৃতীয় পক্ষের analytics, advertising,
                বা tracking cookies ব্যবহার করা হয় না।
            </p>

            <h2>৪. Supabase/Auth Data</h2>

            <p>
                আমরা Supabase ব্যবহার করি database
                ও authentication পরিচালনার জন্য।
            </p>

            <ul>
                <li>
                    <strong>Anonymous ব্যবহারকারী:</strong>{" "}
                    কোনো Supabase Auth account তৈরি
                    হয় না। কোনো session সংরক্ষিত
                    হয় না।
                </li>

                <li>
                    <strong>Admin/Staff:</strong> শুধুমাত্র
                    অ্যাডমিন ও মডারেটরদের জন্য
                    Supabase Auth ব্যবহার করা হয়।
                    তাদের auth_user_id শুধুমাত্র
                    admin_users টেবিলে সংরক্ষিত
                    হয়।
                </li>
            </ul>

            <h2>৫. Data Retention</h2>

            <ul>
                <li>
                    <strong>প্রকাশিত রিপোর্ট:</strong>{" "}
                    অনির্দিষ্টকাল পর্যন্ত
                    সংরক্ষিত থাকে।
                </li>

                <li>
                    <strong>অপেক্ষমাণ রিপোর্ট:</strong>{" "}
                    moderation এর পর সংরক্ষিত
                    বা মুছে ফেলা হয়।
                </li>

                <li>
                    <strong>প্রত্যাখ্যাত রিপোর্ট:</strong>{" "}
                    নির্দিষ্ট সময় পর মুছে ফেলা হতে
                    পারে।
                </li>

                <li>
                    <strong>Admin activity logs:</strong>{" "}
                    moderation_actions টেবিলে
                    সংরক্ষিত থাকে।
                </li>
            </ul>

            <h2>৬. প্রকাশিত তথ্য</h2>

            <p>
                প্রকাশিত রিপোর্টে যা থাকে:
            </p>

            <ul>
                <li>ঘটনার শিরোনাম ও বিবরণ</li>
                <li>শ্রেণি</li>
                <li>বিভাগ ও জেলা</li>
                <li>ঘটনার তারিখ</li>
                <li>যাচাইকরণ স্ট্যাটাস</li>
                <li>প্রকাশের তারিখ</li>
            </ul>

            <p>
                <strong>কখনোই প্রকাশিত হয় না:</strong>{" "}
                রিপোর্টকারীর পরিচয়, IP address,
                ব্রাউজার তথ্য, বা যেকোনো
                পরিচয়মূলক তথ্য।
            </p>

            <h2>৭. নিরাপত্তা</h2>

            <p>
                আমরা নিম্নলিখিত পদ্ধতি ব্যবহার করি
                তথ্য রক্ষায়:
            </p>

            <ul>
                <li>
                    Row Level Security (RLS) —
                    PostgreSQL-এ তথ্য অ্যাক্সেস
                    নিয়ন্ত্রণ।
                </li>

                <li>
                    HTTPS encryption — সব ডেটা
                    ট্রান্সমিশন এনক্রিপ্টেড।
                </li>

                <li>
                    Minimal privileges — সবচেয়ে
                    কম অনুমতি নীতি।
                </li>

                <li>
                    Authentication — শুধুমাত্র
                    অনুমোদিত ব্যবহারকারী
                    অ্যাডমিন ফাংশন ব্যবহার করতে
                    পারে।
                </li>
            </ul>

            <h2>৮. ব্যবহারকারীর অধিকার</h2>

            <ul>
                <li>
                    আপনি <strong>সম্পূর্ণ
                    অজ্ঞানভাবে</strong> রিপোর্ট
                    জমা দিতে পারেন।
                </li>

                <li>
                    আপনার <strong>কোনো account
                    তৈরি করার প্রয়োজন নেই।</strong>
                </li>

                <li>
                    আপনার <strong>কোনো ব্যক্তিগত
                    তথ্য দিতে হয় না।</strong>
                </li>

                <li>
                    আপনি <strong>কোনো tracking বা
                    monitoring</strong>-এর
                    সম্মুখীন হন না।
                </li>
            </ul>
        </PolicyLayout>
    );
}
