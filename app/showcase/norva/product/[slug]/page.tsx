import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductActions from "../../components/ProductActions";
import CartButton from "../../components/CartButton";

type ProductPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export default async function ProductPage({
                                              params,
                                          }: ProductPageProps) {
    const { slug } = await params;

    const supabase = await createClient();

    const { data: product, error } = await supabase
        .from("norva_products")
        .select("*")
        .eq("slug", slug)
        .eq("active", true)
        .single();

    if (error || !product) {
        notFound();
    }

    const formattedPrice = Number(product.price).toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });

    return (
        <main className="min-h-screen bg-[#F7F4EE] text-[#1B1B1B]">

            {/* HEADER */}
            <header className="flex h-24 items-center justify-between px-8 md:px-14 lg:px-20">
                <Link
                    href="/showcase/norva"
                    className="text-2xl font-medium tracking-[0.28em]"
                >
                    NØRVA
                </Link>

                <nav className="hidden items-center gap-10 text-[11px] tracking-[0.18em] md:flex">
                    <Link
                        href="/showcase/norva#shop"
                        className="transition-opacity hover:opacity-50"
                    >
                        SHOP
                    </Link>

                    <Link
                        href="/showcase/norva#collections"
                        className="transition-opacity hover:opacity-50"
                    >
                        COLLECTIONS
                    </Link>

                    <Link
                        href="/showcase/norva#about"
                        className="transition-opacity hover:opacity-50"
                    >
                        ABOUT
                    </Link>
                </nav>

                <div className="flex items-center gap-6 text-[11px] tracking-[0.15em]">
                    <button className="transition-opacity hover:opacity-50">
                        SEARCH
                    </button>

                    <CartButton />
                </div>
            </header>

            {/* BREADCRUMB */}
            <div className="px-8 pb-6 md:px-14 lg:px-20">
                <div className="flex items-center gap-3 text-[9px] tracking-[0.2em] text-black/40">
                    <Link
                        href="/showcase/norva"
                        className="transition hover:text-black"
                    >
                        NØRVA
                    </Link>

                    <span>/</span>

                    <Link
                        href="/showcase/norva#shop"
                        className="transition hover:text-black"
                    >
                        SHOP
                    </Link>

                    <span>/</span>

                    <span className="text-black/70">
            {product.name.toUpperCase()}
          </span>
                </div>
            </div>

            {/* PRODUCT */}
            <section className="px-8 pb-28 md:px-14 lg:px-20">
                <div className="grid gap-10 lg:grid-cols-[1.45fr_0.75fr] lg:gap-16">

                    {/* IMAGE */}
                    <div className="relative min-h-[620px] overflow-hidden bg-[#E9E1D5] md:min-h-[760px] lg:min-h-[820px]">
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="absolute inset-0 h-full w-full object-cover"
                        />

                        {product.featured && (
                            <span className="absolute left-6 top-6 bg-[#F7F4EE] px-4 py-2 text-[9px] tracking-[0.22em]">
                NEW COLLECTION
              </span>
                        )}

                        <span className="absolute bottom-6 left-6 text-[9px] tracking-[0.2em] text-white">
              NØRVA / COPENHAGEN
            </span>
                    </div>

                    {/* PRODUCT INFO */}
                    <div className="flex flex-col lg:sticky lg:top-10 lg:h-fit lg:pt-10">

                        <p className="mb-5 text-[10px] tracking-[0.28em] text-[#A48654]">
                            {product.category?.toUpperCase()} / 2026 COLLECTION
                        </p>

                        <h1 className="text-5xl font-light leading-[0.95] tracking-[-0.04em] md:text-6xl">
                            {product.name}
                        </h1>

                        <p className="mt-7 text-xl font-light">
                            €{formattedPrice}
                        </p>

                        <div className="mt-10 border-t border-black/15 pt-8">
                            <p className="max-w-md text-sm font-light leading-7 text-black/55">
                                {product.description}
                            </p>
                        </div>

                        {/* MATERIAL */}
                        <div className="mt-10 border-t border-black/15 pt-7">
                            <p className="mb-3 text-[9px] tracking-[0.22em] text-black/40">
                                MATERIAL
                            </p>

                            <p className="text-sm">
                                {product.material || "Natural materials"}
                            </p>
                        </div>

                        {/* AVAILABILITY */}
                        <div className="mt-7 border-t border-black/15 pt-7">
                            <p className="mb-3 text-[9px] tracking-[0.22em] text-black/40">
                                AVAILABILITY
                            </p>

                            {product.stock > 0 ? (
                                <div className="flex items-center gap-3">
                                    <span className="h-2 w-2 rounded-full bg-[#A48654]" />

                                    <p className="text-sm">
                                        In stock · {product.stock} available
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-black/45">
                                    Currently unavailable
                                </p>
                            )}
                        </div>

                        <ProductActions
                            id={product.id}
                            name={product.name}
                            slug={product.slug}
                            price={Number(product.price)}
                            stock={product.stock}
                            image_url={product.image_url}
                            material={product.material}
                        />

                        {/* DETAILS */}
                        <div className="mt-8 border-t border-black/15">
                            <details className="border-b border-black/15 py-5">
                                <summary className="cursor-pointer list-none text-[10px] tracking-[0.18em]">
                                    PRODUCT DETAILS
                                </summary>

                                <p className="mt-5 max-w-md text-sm font-light leading-6 text-black/50">
                                    Designed with considered proportions and carefully
                                    selected materials for everyday use and long-lasting
                                    comfort.
                                </p>
                            </details>

                            <details className="border-b border-black/15 py-5">
                                <summary className="cursor-pointer list-none text-[10px] tracking-[0.18em]">
                                    DELIVERY & RETURNS
                                </summary>

                                <p className="mt-5 max-w-md text-sm font-light leading-6 text-black/50">
                                    Complimentary delivery on selected orders. Returns
                                    are accepted within 30 days in original condition.
                                </p>
                            </details>

                            <details className="border-b border-black/15 py-5">
                                <summary className="cursor-pointer list-none text-[10px] tracking-[0.18em]">
                                    CARE GUIDE
                                </summary>

                                <p className="mt-5 max-w-md text-sm font-light leading-6 text-black/50">
                                    Care instructions vary by material. Keep away from
                                    prolonged direct sunlight and clean using gentle,
                                    material-appropriate products.
                                </p>
                            </details>
                        </div>

                    </div>
                </div>
            </section>

            {/* BOTTOM BRAND LINE */}
            <section className="border-t border-black/10 px-8 py-10 md:px-14 lg:px-20">
                <div className="flex flex-col justify-between gap-5 text-[9px] tracking-[0.22em] text-black/40 md:flex-row">
                    <span>NØRVA · COPENHAGEN</span>
                    <span>OBJECTS FOR QUIETER LIVING</span>
                    <span>2026 COLLECTION</span>
                </div>
            </section>

        </main>
    );
}