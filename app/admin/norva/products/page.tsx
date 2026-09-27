"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

type Product = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    category: string | null;
    material: string | null;
    image_url: string | null;
    stock: number;
    featured: boolean;
    active: boolean;
    created_at: string;
};

type StatusFilter =
    | "all"
    | "active"
    | "draft"
    | "featured"
    | "low-stock"
    | "out-of-stock";

type SortOption =
    | "newest"
    | "oldest"
    | "price-low"
    | "price-high"
    | "stock-low"
    | "stock-high"
    | "name";

export default function NorvaProductsPage() {
    const router = useRouter();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("all");
    const [categoryFilter, setCategoryFilter] =
        useState("all");
    const [sort, setSort] =
        useState<SortOption>("newest");

    useEffect(() => {
        async function loadProducts() {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                router.replace("/admin/norva/login");
                return;
            }

            const { data, error } = await supabase
                .from("norva_products")
                .select(`
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
        `)
                .order("created_at", { ascending: false });

            if (error) {
                console.error("NØRVA products error:", error);
                setLoadError("Could not load products.");
                setLoading(false);
                return;
            }

            setProducts((data ?? []) as Product[]);
            setLoading(false);
        }

        loadProducts();
    }, [router]);

    const categories = useMemo(() => {
        return Array.from(
            new Set(
                products
                    .map((product) => product.category)
                    .filter(
                        (category): category is string =>
                            Boolean(category)
                    )
            )
        ).sort();
    }, [products]);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        const query = search.trim().toLowerCase();

        if (query) {
            result = result.filter((product) => {
                return [
                    product.name,
                    product.category,
                    product.material,
                    product.description,
                    product.slug,
                ].some((value) =>
                    value?.toLowerCase().includes(query)
                );
            });
        }

        if (categoryFilter !== "all") {
            result = result.filter(
                (product) =>
                    product.category === categoryFilter
            );
        }

        switch (statusFilter) {
            case "active":
                result = result.filter(
                    (product) => product.active
                );
                break;

            case "draft":
                result = result.filter(
                    (product) => !product.active
                );
                break;

            case "featured":
                result = result.filter(
                    (product) => product.featured
                );
                break;

            case "low-stock":
                result = result.filter(
                    (product) =>
                        product.stock > 0 &&
                        product.stock <= 5
                );
                break;

            case "out-of-stock":
                result = result.filter(
                    (product) => product.stock === 0
                );
                break;
        }

        switch (sort) {
            case "oldest":
                result.sort(
                    (a, b) =>
                        new Date(a.created_at).getTime() -
                        new Date(b.created_at).getTime()
                );
                break;

            case "price-low":
                result.sort(
                    (a, b) =>
                        Number(a.price) - Number(b.price)
                );
                break;

            case "price-high":
                result.sort(
                    (a, b) =>
                        Number(b.price) - Number(a.price)
                );
                break;

            case "stock-low":
                result.sort(
                    (a, b) => a.stock - b.stock
                );
                break;

            case "stock-high":
                result.sort(
                    (a, b) => b.stock - a.stock
                );
                break;

            case "name":
                result.sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
                break;

            default:
                result.sort(
                    (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                );
        }

        return result;
    }, [
        products,
        search,
        statusFilter,
        categoryFilter,
        sort,
    ]);

    const activeProducts = products.filter(
        (product) => product.active
    ).length;

    const featuredProducts = products.filter(
        (product) => product.featured
    ).length;

    const lowStockProducts = products.filter(
        (product) =>
            product.stock > 0 &&
            product.stock <= 5
    ).length;

    const outOfStockProducts = products.filter(
        (product) => product.stock === 0
    ).length;

    const filtersActive =
        search !== "" ||
        statusFilter !== "all" ||
        categoryFilter !== "all" ||
        sort !== "newest";

    function clearFilters() {
        setSearch("");
        setStatusFilter("all");
        setCategoryFilter("all");
        setSort("newest");
    }

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#F4F0E8] text-[#181714]">
                <p className="text-[9px] uppercase tracking-[0.25em] text-[#A48654]">
                    Loading NØRVA catalogue...
                </p>
            </main>
        );
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
                        href="/showcase/norva"
                        target="_blank"
                        className="text-[9px] uppercase tracking-[0.2em] text-black/35 transition hover:text-[#A48654]"
                    >
                        View store ↗
                    </Link>
                </div>

                <nav className="border-t border-black/[0.06]">
                    <div className="mx-auto flex max-w-7xl gap-7 overflow-x-auto px-6 md:px-10">
                        <Link
                            href="/admin/norva"
                            className="whitespace-nowrap py-4 text-[9px] uppercase tracking-[0.2em] text-black/35"
                        >
                            Dashboard
                        </Link>

                        <Link
                            href="/admin/norva/orders"
                            className="whitespace-nowrap py-4 text-[9px] uppercase tracking-[0.2em] text-black/35"
                        >
                            Orders
                        </Link>

                        <Link
                            href="/admin/norva/products"
                            className="whitespace-nowrap border-b border-[#A48654] py-4 text-[9px] uppercase tracking-[0.2em] text-[#A48654]"
                        >
                            Products
                        </Link>

                        <span className="whitespace-nowrap py-4 text-[9px] uppercase tracking-[0.2em] text-black/20">
              Customers
            </span>

                        <span className="whitespace-nowrap py-4 text-[9px] uppercase tracking-[0.2em] text-black/20">
              Analytics
            </span>
                    </div>
                </nav>
            </header>

            {/* HERO */}
            <section className="border-b border-black/10">
                <div className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-16">
                    <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.3em] text-[#A48654]">
                                Catalogue
                            </p>

                            <h1 className="mt-4 text-5xl font-light tracking-[-0.05em] md:text-6xl">
                                Products
                            </h1>

                            <p className="mt-5 max-w-lg text-sm font-light leading-7 text-black/45">
                                Search, filter and manage the complete
                                NØRVA collection.
                            </p>
                        </div>

                        <Link
                            href="/admin/norva/products/new"
                            className="inline-flex w-fit bg-[#181714] px-7 py-4 text-[9px] uppercase tracking-[0.22em] text-[#F8F5EF] transition hover:bg-[#A48654]"
                        >
                            + Add product
                        </Link>
                    </div>
                </div>
            </section>

            {/* STATS */}
            <section className="border-b border-black/10 bg-[#EEE8DD]">
                <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-5">
                    <Stat
                        label="Products"
                        value={products.length}
                    />

                    <Stat
                        label="Active"
                        value={activeProducts}
                    />

                    <Stat
                        label="Featured"
                        value={featuredProducts}
                        accent
                    />

                    <Stat
                        label="Low stock"
                        value={lowStockProducts}
                    />

                    <Stat
                        label="Out of stock"
                        value={outOfStockProducts}
                    />
                </div>
            </section>

            {/* CONTENT */}
            <section className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-20">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.28em] text-[#A48654]">
                            Collection
                        </p>

                        <h2 className="mt-3 text-3xl font-light">
                            All products
                        </h2>
                    </div>

                    <p className="text-[9px] uppercase tracking-[0.18em] text-black/30">
                        Showing {filteredProducts.length} of{" "}
                        {products.length}
                    </p>
                </div>

                {/* SEARCH */}
                <div className="mt-10">
                    <input
                        type="search"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search product, material, category..."
                        className="w-full border border-black/10 bg-[#F8F5EF] px-5 py-4 text-sm font-light outline-none transition placeholder:text-black/25 focus:border-[#A48654]"
                    />
                </div>

                {/* FILTERS */}
                <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(
                                event.target.value as StatusFilter
                            )
                        }
                        className={selectClass}
                    >
                        <option value="all">
                            All products
                        </option>
                        <option value="active">
                            Active
                        </option>
                        <option value="draft">
                            Draft
                        </option>
                        <option value="featured">
                            Featured
                        </option>
                        <option value="low-stock">
                            Low stock
                        </option>
                        <option value="out-of-stock">
                            Out of stock
                        </option>
                    </select>

                    <select
                        value={categoryFilter}
                        onChange={(event) =>
                            setCategoryFilter(event.target.value)
                        }
                        className={selectClass}
                    >
                        <option value="all">
                            All categories
                        </option>

                        {categories.map((category) => (
                            <option
                                key={category}
                                value={category}
                            >
                                {category}
                            </option>
                        ))}
                    </select>

                    <select
                        value={sort}
                        onChange={(event) =>
                            setSort(
                                event.target.value as SortOption
                            )
                        }
                        className={selectClass}
                    >
                        <option value="newest">
                            Newest first
                        </option>
                        <option value="oldest">
                            Oldest first
                        </option>
                        <option value="price-low">
                            Price · Low to high
                        </option>
                        <option value="price-high">
                            Price · High to low
                        </option>
                        <option value="stock-low">
                            Stock · Low to high
                        </option>
                        <option value="stock-high">
                            Stock · High to low
                        </option>
                        <option value="name">
                            Name · A–Z
                        </option>
                    </select>

                    <button
                        type="button"
                        onClick={clearFilters}
                        disabled={!filtersActive}
                        className="border border-black/10 px-5 py-4 text-[8px] uppercase tracking-[0.18em] text-black/40 transition hover:border-[#A48654] hover:text-[#A48654] disabled:cursor-default disabled:opacity-25"
                    >
                        Clear filters
                    </button>
                </div>

                {loadError && (
                    <div className="mt-8 border border-[#A45B4B]/20 bg-[#A45B4B]/5 p-5 text-xs text-[#8B493D]">
                        {loadError}
                    </div>
                )}

                {/* PRODUCTS */}
                <div className="mt-8 border-t border-black/10">
                    {filteredProducts.length === 0 ? (
                        <div className="border-b border-black/10 py-24 text-center">
                            <p className="text-sm font-light text-black/40">
                                No products match these filters.
                            </p>

                            {filtersActive && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="mt-5 text-[9px] uppercase tracking-[0.2em] text-[#A48654]"
                                >
                                    Clear filters →
                                </button>
                            )}
                        </div>
                    ) : (
                        filteredProducts.map((product) => (
                            <article
                                key={product.id}
                                className="grid gap-6 border-b border-black/10 py-7 md:grid-cols-[90px_1.5fr_0.8fr_0.55fr_0.55fr_auto] md:items-center"
                            >
                                <div className="h-[90px] w-[90px] overflow-hidden bg-[#E8E1D5]">
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-[8px] uppercase tracking-[0.15em] text-black/20">
                                            No image
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-base font-medium">
                                            {product.name}
                                        </h3>

                                        {product.featured && (
                                            <Badge accent>
                                                Featured
                                            </Badge>
                                        )}

                                        {!product.active && (
                                            <Badge>Draft</Badge>
                                        )}

                                        {product.stock === 0 && (
                                            <span className="border border-[#A45B4B]/20 px-2 py-1 text-[7px] uppercase tracking-[0.16em] text-[#A45B4B]">
                        Out of stock
                      </span>
                                        )}
                                    </div>

                                    <p className="mt-2 text-[10px] text-black/35">
                                        {product.material ||
                                            "Material not specified"}
                                    </p>

                                    <p className="mt-2 max-w-md truncate text-xs font-light text-black/40">
                                        {product.description ||
                                            "No description"}
                                    </p>
                                </div>

                                <div>
                                    <Label>Category</Label>
                                    <p className="mt-2 text-xs">
                                        {product.category || "—"}
                                    </p>
                                </div>

                                <div>
                                    <Label>Stock</Label>

                                    <p
                                        className={`mt-2 text-sm ${
                                            product.stock <= 5
                                                ? "text-[#A45B4B]"
                                                : ""
                                        }`}
                                    >
                                        {product.stock}
                                    </p>
                                </div>

                                <div>
                                    <Label>Price</Label>

                                    <p className="mt-2 text-sm">
                                        €
                                        {Number(
                                            product.price
                                        ).toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </p>
                                </div>

                                <div className="flex md:justify-end">
                                    <Link
                                        href={`/admin/norva/products/${product.id}/edit`}
                                        className="border border-black/15 px-5 py-3 text-[8px] uppercase tracking-[0.2em] transition hover:border-[#A48654] hover:text-[#A48654]"
                                    >
                                        Edit
                                    </Link>
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </section>
        </main>
    );
}

const selectClass =
    "border border-black/10 bg-[#F8F5EF] px-5 py-4 text-[9px] uppercase tracking-[0.15em] text-black/55 outline-none transition focus:border-[#A48654]";

function Stat({
                  label,
                  value,
                  accent = false,
              }: {
    label: string;
    value: number;
    accent?: boolean;
}) {
    return (
        <div className="border-b border-r border-black/10 p-6 last:border-r-0 lg:border-b-0 md:p-8">
            <p className="text-[8px] uppercase tracking-[0.22em] text-black/35">
                {label}
            </p>

            <p
                className={`mt-4 text-4xl font-light ${
                    accent ? "text-[#A48654]" : ""
                }`}
            >
                {value}
            </p>
        </div>
    );
}

function Label({
                   children,
               }: {
    children: React.ReactNode;
}) {
    return (
        <p className="text-[8px] uppercase tracking-[0.18em] text-black/25">
            {children}
        </p>
    );
}

function Badge({
                   children,
                   accent = false,
               }: {
    children: React.ReactNode;
    accent?: boolean;
}) {
    return (
        <span
            className={`border px-2 py-1 text-[7px] uppercase tracking-[0.16em] ${
                accent
                    ? "border-[#A48654]/30 bg-[#A48654]/5 text-[#A48654]"
                    : "border-black/10 text-black/30"
            }`}
        >
      {children}
    </span>
    );
}