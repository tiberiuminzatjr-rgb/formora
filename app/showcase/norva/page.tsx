import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function NorvaPage() {
    const supabase = await createClient();

    const { data: products, error } = await supabase
        .from("norva_products")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error loading NØRVA products:", error);
    }

    return (
        <main className="min-h-screen bg-[#F7F4EE] text-[#1B1B1B]">

            {/* HEADER */}
            <header className="flex h-24 items-center justify-between px-8 md:px-14 lg:px-20">
                <a
                    href="/showcase/norva"
                    className="text-2xl font-medium tracking-[0.28em]"
                >
                    NØRVA
                </a>

                <nav className="hidden items-center gap-10 text-[11px] tracking-[0.18em] md:flex">
                    <a
                        href="#shop"
                        className="transition-opacity hover:opacity-50"
                    >
                        SHOP
                    </a>

                    <a
                        href="#collections"
                        className="transition-opacity hover:opacity-50"
                    >
                        COLLECTIONS
                    </a>

                    <a
                        href="#journal"
                        className="transition-opacity hover:opacity-50"
                    >
                        JOURNAL
                    </a>

                    <a
                        href="#about"
                        className="transition-opacity hover:opacity-50"
                    >
                        ABOUT
                    </a>
                </nav>

                <div className="flex items-center gap-6 text-[11px] tracking-[0.15em]">
                    <button className="transition-opacity hover:opacity-50">
                        SEARCH
                    </button>

                    <button className="transition-opacity hover:opacity-50">
                        BAG (0)
                    </button>
                </div>
            </header>

            {/* HERO */}
            <section className="px-8 pb-10 md:px-14 lg:px-20">
                <div className="relative min-h-[760px] overflow-hidden bg-[#DED3C2]">

                    <img
                        src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2400&q=90"
                        alt="NØRVA luxury interior"
                        className="absolute inset-0 h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/10" />

                    <div className="absolute left-8 top-8 md:left-12 md:top-12">
                        <p className="text-[10px] tracking-[0.28em] text-white">
                            THE 2026 COLLECTION
                        </p>
                    </div>

                    <div className="absolute bottom-10 left-8 right-8 text-white md:bottom-14 md:left-12 md:right-12">
                        <h1 className="max-w-5xl text-[54px] font-light leading-[0.9] tracking-[-0.04em] md:text-[90px] lg:text-[118px]">
                            Quiet luxury.
                            <br />
                            Made to live.
                        </h1>

                        <div className="mt-8 flex flex-col gap-8 border-t border-white/40 pt-6 md:flex-row md:items-end md:justify-between">
                            <p className="max-w-sm text-sm font-light leading-6 text-white/85">
                                Timeless furniture shaped by natural materials,
                                considered proportions and Scandinavian simplicity.
                            </p>

                            <a
                                href="#collections"
                                className="w-fit border-b border-white pb-2 text-[11px] tracking-[0.2em] transition-opacity hover:opacity-60"
                            >
                                DISCOVER COLLECTION ↗
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEW ARRIVALS */}
            <section
                id="shop"
                className="px-8 py-28 md:px-14 md:py-36 lg:px-20"
            >
                <div className="mb-14 flex items-end justify-between border-b border-black/15 pb-6">
                    <div>
                        <p className="mb-4 text-[10px] tracking-[0.28em] text-[#A48654]">
                            CURATED FOR 2026
                        </p>

                        <h2 className="text-5xl font-light tracking-[-0.04em] md:text-7xl">
                            New arrivals.
                        </h2>
                    </div>

                    <a
                        href="#"
                        className="hidden border-b border-black pb-2 text-[10px] tracking-[0.2em] transition-opacity hover:opacity-50 md:block"
                    >
                        VIEW ALL PIECES ↗
                    </a>
                </div>

                {/* PRODUCTS FROM SUPABASE */}
                {!products || products.length === 0 ? (
                    <div className="py-20 text-center">
                        <p className="text-sm text-black/50">
                            No products available.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-x-5 gap-y-14 md:grid-cols-2 lg:grid-cols-4">
                        {products.map((product) => (
                            <Link
                                key={product.id}
                                href={`/showcase/norva/product/${product.slug}`}
                                className="group block"
                            >
                                <article className="cursor-pointer">
                                    <div className="relative aspect-[4/5] overflow-hidden bg-[#EAE3D8]">

                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                                        />

                                        {product.featured && (
                                            <span className="absolute left-4 top-4 bg-[#F7F4EE] px-3 py-2 text-[9px] tracking-[0.2em]">
                        NEW
                      </span>
                                        )}

                                        <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center bg-[#F7F4EE] text-lg opacity-0 transition duration-300 group-hover:opacity-100">
                      +
                    </span>
                                    </div>

                                    <div className="mt-5 flex justify-between gap-4">
                                        <div>
                                            <h3 className="text-sm tracking-wide">
                                                {product.name}
                                            </h3>

                                            <p className="mt-1 text-xs text-black/45">
                                                {product.material}
                                            </p>
                                        </div>

                                        <p className="text-sm">
                                            €
                                            {Number(product.price).toLocaleString("en-US", {
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 2,
                                            })}
                                        </p>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* SHOP BY COLLECTION */}
            <section
                id="collections"
                className="bg-[#E9E1D5] px-8 py-28 md:px-14 md:py-36 lg:px-20"
            >
                <div className="mb-16">
                    <p className="mb-5 text-[10px] tracking-[0.28em] text-[#A48654]">
                        EXPLORE NØRVA
                    </p>

                    <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                        <h2 className="text-5xl font-light leading-[0.95] tracking-[-0.04em] md:text-7xl lg:text-[86px]">
                            Shop by
                            <br />
                            collection.
                        </h2>

                        <p className="max-w-sm text-sm font-light leading-6 text-black/55">
                            Furniture and objects designed around quiet spaces,
                            natural materials and everyday living.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                    {/* LIVING */}
                    <a href="#" className="group block">
                        <div className="relative aspect-[3/4] overflow-hidden bg-[#D9D0C3]">
                            <img
                                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=90"
                                alt="NØRVA Living Collection"
                                className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                            />

                            <div className="absolute inset-0 bg-black/5 transition group-hover:bg-black/15" />

                            <span className="absolute left-6 top-6 text-[10px] tracking-[0.22em] text-white">
                01 / LIVING
              </span>

                            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
                                <h3 className="text-4xl font-light tracking-[-0.03em]">
                                    Living
                                </h3>

                                <span className="text-2xl transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                  ↗
                </span>
                            </div>
                        </div>
                    </a>

                    {/* DINING */}
                    <a
                        href="#"
                        className="group block md:translate-y-12"
                    >
                        <div className="relative aspect-[3/4] overflow-hidden bg-[#D9D0C3]">
                            <img
                                src="https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1400&q=90"
                                alt="NØRVA Dining Collection"
                                className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                            />

                            <div className="absolute inset-0 bg-black/5 transition group-hover:bg-black/15" />

                            <span className="absolute left-6 top-6 text-[10px] tracking-[0.22em] text-white">
                02 / DINING
              </span>

                            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
                                <h3 className="text-4xl font-light tracking-[-0.03em]">
                                    Dining
                                </h3>

                                <span className="text-2xl transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                  ↗
                </span>
                            </div>
                        </div>
                    </a>

                    {/* OBJECTS */}
                    <a href="#" className="group block">
                        <div className="relative aspect-[3/4] overflow-hidden bg-[#D9D0C3]">
                            <img
                                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=90"
                                alt="NØRVA Objects Collection"
                                className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                            />

                            <div className="absolute inset-0 bg-black/5 transition group-hover:bg-black/15" />

                            <span className="absolute left-6 top-6 text-[10px] tracking-[0.22em] text-white">
                03 / OBJECTS
              </span>

                            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
                                <h3 className="text-4xl font-light tracking-[-0.03em]">
                                    Objects
                                </h3>

                                <span className="text-2xl transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                  ↗
                </span>
                            </div>
                        </div>
                    </a>

                </div>

                <div className="mt-20 flex justify-end md:mt-28">
                    <a
                        href="#shop"
                        className="border-b border-[#1B1B1B] pb-2 text-[10px] tracking-[0.2em] transition-opacity hover:opacity-50"
                    >
                        EXPLORE ALL COLLECTIONS ↗
                    </a>
                </div>
            </section>

            {/* BRAND STATEMENT */}
            <section
                id="about"
                className="bg-[#F7F4EE] px-8 py-28 md:px-14 md:py-40 lg:px-20"
            >
                <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">

                    <div className="lg:col-span-3">
                        <p className="text-[10px] tracking-[0.28em] text-[#A48654]">
                            OUR PHILOSOPHY
                        </p>
                    </div>

                    <div className="lg:col-span-9">
                        <h2 className="max-w-6xl text-[42px] font-light leading-[1.05] tracking-[-0.04em] md:text-[65px] lg:text-[82px]">
                            We believe the objects
                            <br />
                            around us should bring
                            <br />
                            <span className="text-[#A48654]">
                calm to everyday life.
              </span>
                        </h2>

                        <div className="mt-16 grid gap-10 border-t border-black/15 pt-8 md:grid-cols-2">
                            <p className="max-w-md text-sm font-light leading-7 text-black/55">
                                NØRVA brings together thoughtful proportions, natural
                                materials and enduring craftsmanship to create furniture
                                designed for spaces that feel considered, warm and personal.
                            </p>

                            <div className="flex items-end md:justify-end">
                                <a
                                    href="#"
                                    className="border-b border-black pb-2 text-[10px] tracking-[0.2em] transition-opacity hover:opacity-50"
                                >
                                    DISCOVER OUR STORY ↗
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative mt-24 h-[550px] overflow-hidden md:h-[750px] lg:h-[850px]">
                    <img
                        src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2400&q=90"
                        alt="NØRVA interior philosophy"
                        className="h-full w-full object-cover transition duration-[1500ms] hover:scale-[1.015]"
                    />

                    <div className="absolute inset-0 bg-black/5" />

                    <div className="absolute bottom-8 left-8 text-white md:bottom-12 md:left-12">
                        <p className="mb-3 text-[9px] tracking-[0.28em]">
                            COPENHAGEN / 2026
                        </p>

                        <p className="text-2xl font-light md:text-3xl">
                            Designed for quieter spaces.
                        </p>
                    </div>
                </div>
            </section>

        </main>
    );
}