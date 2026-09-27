import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import LogoutButton from "./orders/LogoutButton";

export const dynamic = "force-dynamic";

export default async function NorvaAdminDashboard() {
    const supabaseAuth = await createClient();

    const {
        data: { user },
    } = await supabaseAuth.auth.getUser();

    if (!user) {
        redirect("/admin/norva/login");
    }

    const supabase = createAdminClient();

    const [
        { data: orders, error: ordersError },
        { data: products, error: productsError },
    ] = await Promise.all([
        supabase
            .from("norva_orders")
            .select(`
        id,
        customer_name,
        customer_email,
        total,
        currency,
        payment_status,
        order_status,
        created_at,
        norva_order_items (
          product_name,
          quantity,
          line_total
        )
      `)
            .order("created_at", { ascending: false }),

        supabase
            .from("norva_products")
            .select(`
        id,
        name,
        stock,
        active,
        featured
      `),
    ]);

    if (ordersError) {
        console.error("NØRVA dashboard orders error:", ordersError);
    }

    if (productsError) {
        console.error("NØRVA dashboard products error:", productsError);
    }

    const safeOrders = orders ?? [];
    const safeProducts = products ?? [];

    const paidOrders = safeOrders.filter(
        (order) => order.payment_status === "paid"
    );

    const revenue = paidOrders.reduce(
        (sum, order) => sum + Number(order.total || 0),
        0
    );

    const newOrders = safeOrders.filter(
        (order) => order.order_status === "new"
    ).length;

    const processingOrders = safeOrders.filter(
        (order) => order.order_status === "processing"
    ).length;

    const activeProducts = safeProducts.filter(
        (product) => product.active
    ).length;

    const lowStockProducts = safeProducts.filter(
        (product) => product.stock > 0 && product.stock <= 5
    );

    const outOfStockProducts = safeProducts.filter(
        (product) => product.stock === 0
    );

    const customerEmails = new Set(
        safeOrders
            .map((order) =>
                order.customer_email?.trim().toLowerCase()
            )
            .filter(Boolean)
    );

    const customers = customerEmails.size;

    const averageOrderValue =
        paidOrders.length > 0
            ? revenue / paidOrders.length
            : 0;

    // BEST SELLERS
    const salesMap = new Map<
        string,
        {
            name: string;
            quantity: number;
            revenue: number;
        }
    >();

    for (const order of paidOrders) {
        for (const item of order.norva_order_items ?? []) {
            const existing = salesMap.get(item.product_name);

            if (existing) {
                existing.quantity += Number(item.quantity || 0);
                existing.revenue += Number(item.line_total || 0);
            } else {
                salesMap.set(item.product_name, {
                    name: item.product_name,
                    quantity: Number(item.quantity || 0),
                    revenue: Number(item.line_total || 0),
                });
            }
        }
    }

    const bestSellers = Array.from(salesMap.values())
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

    const recentOrders = safeOrders.slice(0, 5);

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

                    <div className="flex items-center gap-5">
                        <Link
                            href="/showcase/norva"
                            target="_blank"
                            className="text-[9px] uppercase tracking-[0.2em] text-black/35 transition hover:text-[#A48654]"
                        >
                            View store ↗
                        </Link>

                        <div className="h-4 w-px bg-black/10" />

                        <LogoutButton />
                    </div>
                </div>

                {/* NAV */}
                <nav className="border-t border-black/[0.06]">
                    <div className="mx-auto flex max-w-7xl gap-7 overflow-x-auto px-6 md:px-10">
                        <Link
                            href="/admin/norva"
                            className="whitespace-nowrap border-b border-[#A48654] py-4 text-[9px] uppercase tracking-[0.2em] text-[#A48654]"
                        >
                            Dashboard
                        </Link>

                        <Link
                            href="/admin/norva/orders"
                            className="whitespace-nowrap py-4 text-[9px] uppercase tracking-[0.2em] text-black/35 transition hover:text-black"
                        >
                            Orders
                        </Link>

                        <Link
                            href="/admin/norva/products"
                            className="whitespace-nowrap py-4 text-[9px] uppercase tracking-[0.2em] text-black/35 transition hover:text-black"
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
                <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-[#A48654]">
                        Overview
                    </p>

                    <div className="mt-5 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="text-5xl font-light tracking-[-0.05em] md:text-7xl">
                                Commerce
                                <br />

                                <span className="font-serif italic text-[#A48654]">
                  overview.
                </span>
                            </h1>

                            <p className="mt-6 max-w-xl text-sm font-light leading-7 text-black/45">
                                Orders, revenue, inventory and customer
                                activity across the NØRVA store.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Link
                                href="/admin/norva/products/new"
                                className="bg-[#181714] px-6 py-4 text-[8px] uppercase tracking-[0.2em] text-white transition hover:bg-[#A48654]"
                            >
                                + Add product
                            </Link>

                            <Link
                                href="/admin/norva/orders"
                                className="border border-black/15 px-6 py-4 text-[8px] uppercase tracking-[0.2em] transition hover:border-[#A48654] hover:text-[#A48654]"
                            >
                                View orders
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* MAIN STATS */}
            <section className="border-b border-black/10 bg-[#EEE8DD]">
                <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
                    <Stat
                        label="Revenue"
                        value={`€${revenue.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}`}
                        accent
                    />

                    <Stat
                        label="Orders"
                        value={String(safeOrders.length)}
                    />

                    <Stat
                        label="Customers"
                        value={String(customers)}
                    />

                    <Stat
                        label="Avg. order"
                        value={`€${averageOrderValue.toLocaleString(
                            "en-US",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }
                        )}`}
                    />
                </div>
            </section>

            {/* CONTENT */}
            <section className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-20">
                {/* STATUS CARDS */}
                <div className="grid gap-px overflow-hidden border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-4">
                    <MiniStat
                        label="New orders"
                        value={newOrders}
                        href="/admin/norva/orders"
                    />

                    <MiniStat
                        label="Processing"
                        value={processingOrders}
                        href="/admin/norva/orders"
                    />

                    <MiniStat
                        label="Active products"
                        value={activeProducts}
                        href="/admin/norva/products"
                    />

                    <MiniStat
                        label="Low stock"
                        value={lowStockProducts.length}
                        href="/admin/norva/products"
                        warning={lowStockProducts.length > 0}
                    />
                </div>

                {/* RECENT ORDERS */}
                <div className="mt-16">
                    <SectionTitle
                        eyebrow="Commerce"
                        title="Recent orders"
                        href="/admin/norva/orders"
                        linkLabel="View all orders"
                    />

                    <div className="mt-8 border-t border-black/10">
                        {recentOrders.length === 0 ? (
                            <EmptyState text="No orders yet." />
                        ) : (
                            recentOrders.map((order) => {
                                const date = new Date(order.created_at);

                                return (
                                    <div
                                        key={order.id}
                                        className="grid gap-5 border-b border-black/10 py-6 sm:grid-cols-[1fr_1.3fr_0.7fr_0.7fr] sm:items-center"
                                    >
                                        <div>
                                            <SmallLabel>Order</SmallLabel>

                                            <p className="mt-2 text-sm font-medium">
                                                #
                                                {order.id
                                                    .slice(0, 8)
                                                    .toUpperCase()}
                                            </p>

                                            <p className="mt-1 text-[9px] text-black/30">
                                                {date.toLocaleDateString(
                                                    "en-GB"
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <SmallLabel>Customer</SmallLabel>

                                            <p className="mt-2 text-xs">
                                                {order.customer_name ||
                                                    "Guest customer"}
                                            </p>

                                            <p className="mt-1 truncate text-[10px] text-black/30">
                                                {order.customer_email || "—"}
                                            </p>
                                        </div>

                                        <div>
                                            <SmallLabel>Status</SmallLabel>

                                            <p className="mt-2 text-[9px] uppercase tracking-[0.15em] text-[#A48654]">
                                                {order.order_status}
                                            </p>
                                        </div>

                                        <div className="sm:text-right">
                                            <SmallLabel>Total</SmallLabel>

                                            <p className="mt-2 text-sm">
                                                {order.currency?.toUpperCase()}{" "}
                                                {Number(order.total).toLocaleString(
                                                    "en-US",
                                                    {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    }
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* TWO COLUMNS */}
                <div className="mt-20 grid gap-16 lg:grid-cols-2">
                    {/* BEST SELLERS */}
                    <div>
                        <SectionTitle
                            eyebrow="Performance"
                            title="Best sellers"
                            href="/admin/norva/products"
                            linkLabel="Products"
                        />

                        <div className="mt-8 border-t border-black/10">
                            {bestSellers.length === 0 ? (
                                <EmptyState text="No sales data yet." />
                            ) : (
                                bestSellers.map((product, index) => (
                                    <div
                                        key={product.name}
                                        className="grid grid-cols-[35px_1fr_auto] items-center gap-4 border-b border-black/10 py-5"
                                    >
                    <span className="font-serif text-lg italic text-[#A48654]">
                      {String(index + 1).padStart(
                          2,
                          "0"
                      )}
                    </span>

                                        <div>
                                            <p className="text-sm">
                                                {product.name}
                                            </p>

                                            <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-black/30">
                                                {product.quantity} sold
                                            </p>
                                        </div>

                                        <p className="text-xs">
                                            €
                                            {product.revenue.toLocaleString(
                                                "en-US",
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }
                                            )}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* INVENTORY */}
                    <div>
                        <SectionTitle
                            eyebrow="Inventory"
                            title="Stock attention"
                            href="/admin/norva/products"
                            linkLabel="Manage stock"
                        />

                        <div className="mt-8 border-t border-black/10">
                            {lowStockProducts.length === 0 &&
                            outOfStockProducts.length === 0 ? (
                                <EmptyState text="Inventory looks healthy." />
                            ) : (
                                [
                                    ...outOfStockProducts,
                                    ...lowStockProducts,
                                ]
                                    .slice(0, 6)
                                    .map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center justify-between gap-5 border-b border-black/10 py-5"
                                        >
                                            <div>
                                                <p className="text-sm">
                                                    {product.name}
                                                </p>

                                                <p
                                                    className={`mt-1 text-[8px] uppercase tracking-[0.16em] ${
                                                        product.stock === 0
                                                            ? "text-[#A45B4B]"
                                                            : "text-[#A48654]"
                                                    }`}
                                                >
                                                    {product.stock === 0
                                                        ? "Out of stock"
                                                        : "Low stock"}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-xl font-light">
                                                    {product.stock}
                                                </p>

                                                <p className="text-[8px] uppercase tracking-[0.15em] text-black/25">
                                                    units
                                                </p>
                                            </div>
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-black/10 px-6 py-8 md:px-10">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 text-[8px] uppercase tracking-[0.2em] text-black/25 sm:flex-row sm:justify-between">
                    <span>NØRVA · Copenhagen · 2026</span>
                    <span>Commerce administration</span>
                </div>
            </footer>
        </main>
    );
}

function Stat({
                  label,
                  value,
                  accent = false,
              }: {
    label: string;
    value: string;
    accent?: boolean;
}) {
    return (
        <div className="border-b border-r border-black/10 p-6 lg:border-b-0 md:p-8">
            <p className="text-[8px] uppercase tracking-[0.22em] text-black/35">
                {label}
            </p>

            <p
                className={`mt-4 text-3xl font-light md:text-4xl ${
                    accent ? "text-[#A48654]" : ""
                }`}
            >
                {value}
            </p>
        </div>
    );
}

function MiniStat({
                      label,
                      value,
                      href,
                      warning = false,
                  }: {
    label: string;
    value: number;
    href: string;
    warning?: boolean;
}) {
    return (
        <Link
            href={href}
            className="bg-[#F8F5EF] p-6 transition hover:bg-[#EEE8DD]"
        >
            <p className="text-[8px] uppercase tracking-[0.2em] text-black/35">
                {label}
            </p>

            <div className="mt-4 flex items-end justify-between">
                <p
                    className={`text-3xl font-light ${
                        warning ? "text-[#A45B4B]" : ""
                    }`}
                >
                    {value}
                </p>

                <span className="text-xs text-black/25">
          →
        </span>
            </div>
        </Link>
    );
}

function SectionTitle({
                          eyebrow,
                          title,
                          href,
                          linkLabel,
                      }: {
    eyebrow: string;
    title: string;
    href: string;
    linkLabel: string;
}) {
    return (
        <div className="flex items-end justify-between gap-5">
            <div>
                <p className="text-[8px] uppercase tracking-[0.25em] text-[#A48654]">
                    {eyebrow}
                </p>

                <h2 className="mt-2 text-2xl font-light">
                    {title}
                </h2>
            </div>

            <Link
                href={href}
                className="text-[8px] uppercase tracking-[0.18em] text-black/35 transition hover:text-[#A48654]"
            >
                {linkLabel} →
            </Link>
        </div>
    );
}

function SmallLabel({
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

function EmptyState({
                        text,
                    }: {
    text: string;
}) {
    return (
        <div className="border-b border-black/10 py-10">
            <p className="text-xs font-light text-black/35">
                {text}
            </p>
        </div>
    );
}