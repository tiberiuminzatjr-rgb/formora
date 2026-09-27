import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import EditProductForm from "./EditProductForm";

export const dynamic = "force-dynamic";

type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditNorvaProductPage({
                                                       params,
                                                   }: PageProps) {
    const { id } = await params;

    // Check authentication
    const supabaseAuth = await createClient();

    const {
        data: { user },
    } = await supabaseAuth.auth.getUser();

    if (!user) {
        redirect("/admin/norva/login");
    }

    // Load product server-side
    const supabase = createAdminClient();

    const { data: product, error } = await supabase
        .from("norva_products")
        .select(
            `
        id,
        name,
        slug,
        description,
        price,
        category,
        material,
        image_url,
        stock,
        featured,
        active,
        created_at
      `
        )
        .eq("id", id)
        .single();

    if (error || !product) {
        console.error("NØRVA product load error:", error);
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#F4F0E8] text-[#181714]">
            {/* HEADER */}
            <header className="border-b border-black/10 bg-[#F8F5EF]">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7 md:px-10">
                    <div>
                        <Link
                            href="/showcase/norva"
                            className="text-2xl font-medium tracking-[0.32em]"
                        >
                            NØRVA
                        </Link>

                        <p className="mt-2 text-[8px] uppercase tracking-[0.3em] text-[#A48654]">
                            Copenhagen · Administration
                        </p>
                    </div>

                    <Link
                        href="/admin/norva/products"
                        className="text-[9px] uppercase tracking-[0.2em] text-black/40 transition hover:text-[#A48654]"
                    >
                        ← Products
                    </Link>
                </div>
            </header>

            {/* TITLE */}
            <section className="border-b border-black/10">
                <div className="mx-auto max-w-5xl px-6 py-14 md:px-10 md:py-16">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-[#A48654]">
                        Catalogue · Edit
                    </p>

                    <h1 className="mt-4 text-5xl font-light tracking-[-0.05em] md:text-6xl">
                        Edit{" "}
                        <span className="font-serif italic text-[#A48654]">
              product.
            </span>
                    </h1>

                    <p className="mt-5 max-w-xl text-sm font-light leading-7 text-black/45">
                        Update product information, inventory,
                        visibility and presentation.
                    </p>
                </div>
            </section>

            <EditProductForm product={product} />

            <footer className="border-t border-black/10 px-6 py-8 md:px-10">
                <div className="mx-auto flex max-w-5xl justify-between text-[8px] uppercase tracking-[0.2em] text-black/25">
                    <span>NØRVA · Copenhagen · 2026</span>
                    <span>Product administration</span>
                </div>
            </footer>
        </main>
    );
}