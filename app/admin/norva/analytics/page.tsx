import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type OrderItem = {
    product_name: string;
    quantity: number;
    line_total: number;
};

type Order = {
    id: string;
    customer_name: string | null;
    customer_email: string | null;
    total: number;
    currency: string | null;
    payment_status: string | null;
    order_status: string | null;
    created_at: string;
    norva_order_items: OrderItem[] | null;
};

export default async function NorvaAnalyticsPage() {
    /* =========================
       AUTH
    ========================= */

    const supabaseAuth = await createClient();

    const {
        data: { user },
    } = await supabaseAuth.auth.getUser();

    if (!user) {
        redirect("/admin/norva/login");
    }

    /* =========================
       DATA
    ========================= */

    const supabase = createAdminClient();

    const { data, error } = await supabase
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
        .order("created_at", { ascending: true });

    if (error) {
        console.error("NØRVA analytics error:", error);
    }

    const orders = (data ?? []) as Order[];

    const paidOrders = orders.filter(
        (order) => order.payment_status === "paid"
    );

    /* =========================
       MAIN METRICS
    ========================= */

    const revenue = paidOrders.reduce(
        (sum, order) => sum + Number(order.total || 0),
        0
    );

    const averageOrder =
        paidOrders.length > 0
            ? revenue / paidOrders.length
            : 0;

    let unitsSold = 0;

    for (const order of paidOrders) {
        for (const item of order.norva_order_items ?? []) {
            unitsSold += Number(item.quantity || 0);
        }
    }

    const uniqueCustomers = new Set(
        paidOrders
            .map((order) =>
                order.customer_email
                    ?.trim()
                    .toLowerCase()
            )
            .filter(Boolean)
    ).size;

    /* =========================
       PRODUCT PERFORMANCE
    ========================= */

    const productMap = new Map<
        string,
        {
            name: string;
            units: number;
            revenue: number;
            orders: Set<string>;
        }
    >();

    for (const order of paidOrders) {
        for (const item of order.norva_order_items ?? []) {
            const current = productMap.get(
                item.product_name
            );

            if (current) {
                current.units += Number(
                    item.quantity || 0
                );

                current.revenue += Number(
                    item.line_total || 0
                );

                current.orders.add(order.id);
            } else {
                productMap.set(item.product_name, {
                    name: item.product_name,
                    units: Number(item.quantity || 0),
                    revenue: Number(item.line_total || 0),
                    orders: new Set([order.id]),
                });
            }
        }
    }

    const products = Array.from(
        productMap.values()
    ).sort(
        (a, b) => b.revenue - a.revenue
    );

    const maxProductRevenue = Math.max(
        ...products.map(
            (product) => product.revenue
        ),
        1
    );

    /* =========================
       CUSTOMER PERFORMANCE
    ========================= */

    const customerMap = new Map<
        string,
        {
            name: string;
            email: string;
            orders: number;
            spent: number;
        }
    >();

    for (const order of paidOrders) {
        const email = order.customer_email
            ?.trim()
            .toLowerCase();

        if (!email) continue;

        const existing = customerMap.get(email);

        if (existing) {
            existing.orders += 1;
            existing.spent += Number(
                order.total || 0
            );

            if (
                existing.name === "Guest customer" &&
                order.customer_name
            ) {
                existing.name =
                    order.customer_name;
            }
        } else {
            customerMap.set(email, {
                name:
                    order.customer_name?.trim() ||
                    "Guest customer",
                email,
                orders: 1,
                spent: Number(order.total || 0),
            });
        }
    }

    const topCustomers = Array.from(
        customerMap.values()
    )
        .sort((a, b) => b.spent - a.spent)
        .slice(0, 5);

    /* =========================
       SALES BY DAY
    ========================= */

    const dailyMap = new Map<
        string,
        {
            revenue: number;
            orders: number;
        }
    >();

    for (const order of paidOrders) {
        const date = new Date(order.created_at);

        const key = [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(
                2,
                "0"
            ),
            String(date.getDate()).padStart(
                2,
                "0"
            ),
        ].join("-");

        const current = dailyMap.get(key);

        if (current) {
            current.revenue += Number(
                order.total || 0
            );

            current.orders += 1;
        } else {
            dailyMap.set(key, {
                revenue: Number(order.total || 0),
                orders: 1,
            });
        }
    }

    const dailySales = Array.from(
        dailyMap.entries()
    )
        .map(([date, values]) => ({
            date,
            ...values,
        }))
        .sort(
            (a, b) =>
                new Date(a.date).getTime() -
                new Date(b.date).getTime()
        )
        .slice(-14);

    const maxDailyRevenue = Math.max(
        ...dailySales.map(
            (day) => day.revenue
        ),
        1
    );

    /* =========================
       ORDER STATUS
    ========================= */

    const statusData = [
        {
            label: "New",
            value: orders.filter(
                (order) =>
                    order.order_status === "new"
            ).length,
        },
        {
            label: "Processing",
            value: orders.filter(
                (order) =>
                    order.order_status ===
                    "processing"
            ).length,
        },
        {
            label: "Shipped",
            value: orders.filter(
                (order) =>
                    order.order_status === "shipped"
            ).length,
        },
        {
            label: "Completed",
            value: orders.filter(
                (order) =>
                    order.order_status ===
                    "completed"
            ).length,
        },
    ];

    const maxStatus = Math.max(
        ...statusData.map(
            (status) => status.value
        ),
        1
    );

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

                {/* NAV */}
                <nav className="border-t border-black/[0.06]">
                    <div className="mx-auto flex max-w-7xl gap-7 overflow-x-auto px-6 md:px-10">
                        <NavLink
                            href="/admin/norva"
                            label="Dashboard"
                        />

                        <NavLink
                            href="/admin/norva/orders"
                            label="Orders"
                        />

                        <NavLink
                            href="/admin/norva/products"
                            label="Products"
                        />

                        <NavLink
                            href="/admin/norva/customers"
                            label="Customers"
                        />

                        <NavLink
                            href="/admin/norva/analytics"
                            label="Analytics"
                            active
                        />
                    </div>
                </nav>
            </header>

            {/* HERO */}
            <section className="border-b border-black/10">
                <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-[#A48654]">
                        Performance
                    </p>

                    <h1 className="mt-4 text-5xl font-light tracking-[-0.05em] md:text-7xl">
                        Store{" "}
                        <span className="font-serif italic text-[#A48654]">
              analytics.
            </span>
                    </h1>

                    <p className="mt-6 max-w-xl text-sm font-light leading-7 text-black/45">
                        Revenue, sales performance,
                        customer value and product
                        activity across NØRVA.
                    </p>
                </div>
            </section>

            {/* METRICS */}
            <section className="border-b border-black/10 bg-[#EEE8DD]">
                <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-5">
                    <Stat
                        label="Revenue"
                        value={`€${formatMoney(
                            revenue
                        )}`}
                        accent
                    />

                    <Stat
                        label="Paid orders"
                        value={String(
                            paidOrders.length
                        )}
                    />

                    <Stat
                        label="Avg. order"
                        value={`€${formatMoney(
                            averageOrder
                        )}`}
                    />

                    <Stat
                        label="Units sold"
                        value={String(unitsSold)}
                    />

                    <Stat
                        label="Customers"
                        value={String(
                            uniqueCustomers
                        )}
                    />
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-20">
                {/* SALES TREND */}
                <SectionHeading
                    eyebrow="Revenue"
                    title="Sales activity"
                    description="Paid order revenue across the latest active sales days."
                />

                <div className="mt-10 border border-black/10 bg-[#F8F5EF] p-6 md:p-8">
                    {dailySales.length === 0 ? (
                        <Empty text="No paid sales data yet." />
                    ) : (
                        <>
                            <div className="flex h-[260px] items-end gap-3 md:gap-5">
                                {dailySales.map(
                                    (day) => {
                                        const height =
                                            Math.max(
                                                (day.revenue /
                                                    maxDailyRevenue) *
                                                100,
                                                4
                                            );

                                        return (
                                            <div
                                                key={day.date}
                                                className="group flex h-full min-w-0 flex-1 flex-col justify-end"
                                            >
                                                <div className="mb-3 hidden text-center text-[8px] text-black/40 group-hover:block">
                                                    €
                                                    {formatMoney(
                                                        day.revenue
                                                    )}
                                                </div>

                                                <div
                                                    className="w-full bg-[#A48654] transition-opacity hover:opacity-70"
                                                    style={{
                                                        height: `${height}%`,
                                                    }}
                                                    title={`€${formatMoney(
                                                        day.revenue
                                                    )} · ${
                                                        day.orders
                                                    } orders`}
                                                />
                                            </div>
                                        );
                                    }
                                )}
                            </div>

                            <div className="mt-5 flex justify-between border-t border-black/10 pt-4">
                <span className="text-[8px] uppercase tracking-[0.14em] text-black/30">
                  {formatDate(
                      dailySales[0].date
                  )}
                </span>

                                <span className="text-[8px] uppercase tracking-[0.14em] text-black/30">
                  {formatDate(
                      dailySales[
                      dailySales.length - 1
                          ].date
                  )}
                </span>
                            </div>
                        </>
                    )}
                </div>

                {/* PRODUCT PERFORMANCE */}
                <div className="mt-20">
                    <SectionHeading
                        eyebrow="Catalogue"
                        title="Product performance"
                        description="Products ranked by paid revenue."
                    />

                    <div className="mt-9 border-t border-black/10">
                        {products.length === 0 ? (
                            <Empty text="No product sales data yet." />
                        ) : (
                            products
                                .slice(0, 8)
                                .map(
                                    (product, index) => {
                                        const width =
                                            (product.revenue /
                                                maxProductRevenue) *
                                            100;

                                        return (
                                            <div
                                                key={
                                                    product.name
                                                }
                                                className="grid gap-5 border-b border-black/10 py-6 md:grid-cols-[45px_1fr_100px_130px]"
                                            >
                                                <div className="font-serif text-lg italic text-[#A48654]">
                                                    {String(
                                                        index + 1
                                                    ).padStart(
                                                        2,
                                                        "0"
                                                    )}
                                                </div>

                                                <div>
                                                    <div className="flex items-center justify-between gap-4">
                                                        <p className="text-sm">
                                                            {
                                                                product.name
                                                            }
                                                        </p>

                                                        <p className="text-[9px] text-black/30 md:hidden">
                                                            €
                                                            {formatMoney(
                                                                product.revenue
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="mt-4 h-[3px] bg-black/[0.06]">
                                                        <div
                                                            className="h-full bg-[#A48654]"
                                                            style={{
                                                                width: `${width}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <SmallLabel>
                                                        Units
                                                    </SmallLabel>

                                                    <p className="mt-2 text-sm">
                                                        {
                                                            product.units
                                                        }
                                                    </p>
                                                </div>

                                                <div className="hidden md:block">
                                                    <SmallLabel>
                                                        Revenue
                                                    </SmallLabel>

                                                    <p className="mt-2 text-sm">
                                                        €
                                                        {formatMoney(
                                                            product.revenue
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    }
                                )
                        )}
                    </div>
                </div>

                {/* 2 COLUMNS */}
                <div className="mt-20 grid gap-16 lg:grid-cols-2">
                    {/* TOP CUSTOMERS */}
                    <div>
                        <SectionHeading
                            eyebrow="Customers"
                            title="Top customers"
                        />

                        <div className="mt-8 border-t border-black/10">
                            {topCustomers.length ===
                            0 ? (
                                <Empty text="No customer data yet." />
                            ) : (
                                topCustomers.map(
                                    (customer, index) => (
                                        <div
                                            key={
                                                customer.email
                                            }
                                            className="grid grid-cols-[35px_1fr_auto] items-center gap-4 border-b border-black/10 py-5"
                                        >
                      <span className="font-serif text-lg italic text-[#A48654]">
                        {String(
                            index + 1
                        ).padStart(
                            2,
                            "0"
                        )}
                      </span>

                                            <div className="min-w-0">
                                                <p className="truncate text-sm">
                                                    {
                                                        customer.name
                                                    }
                                                </p>

                                                <p className="mt-1 truncate text-[9px] text-black/30">
                                                    {
                                                        customer.email
                                                    }
                                                </p>

                                                <p className="mt-1 text-[8px] uppercase tracking-[0.15em] text-black/25">
                                                    {
                                                        customer.orders
                                                    }{" "}
                                                    orders
                                                </p>
                                            </div>

                                            <p className="text-sm text-[#A48654]">
                                                €
                                                {formatMoney(
                                                    customer.spent
                                                )}
                                            </p>
                                        </div>
                                    )
                                )
                            )}
                        </div>

                        <Link
                            href="/admin/norva/customers"
                            className="mt-6 inline-block text-[8px] uppercase tracking-[0.18em] text-black/35 transition hover:text-[#A48654]"
                        >
                            View customers →
                        </Link>
                    </div>

                    {/* ORDER STATUS */}
                    <div>
                        <SectionHeading
                            eyebrow="Fulfilment"
                            title="Order status"
                        />

                        <div className="mt-8 border-t border-black/10">
                            {statusData.map(
                                (status) => {
                                    const width =
                                        (status.value /
                                            maxStatus) *
                                        100;

                                    return (
                                        <div
                                            key={
                                                status.label
                                            }
                                            className="border-b border-black/10 py-5"
                                        >
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs">
                                                    {
                                                        status.label
                                                    }
                                                </p>

                                                <p className="text-sm">
                                                    {
                                                        status.value
                                                    }
                                                </p>
                                            </div>

                                            <div className="mt-4 h-[3px] bg-black/[0.06]">
                                                <div
                                                    className="h-full bg-[#A48654]"
                                                    style={{
                                                        width: `${width}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>

                        <Link
                            href="/admin/norva/orders"
                            className="mt-6 inline-block text-[8px] uppercase tracking-[0.18em] text-black/35 transition hover:text-[#A48654]"
                        >
                            Manage orders →
                        </Link>
                    </div>
                </div>

                {/* SUMMARY */}
                <div className="mt-20 border border-black/10 bg-[#EEE8DD] p-8 md:p-10">
                    <p className="text-[8px] uppercase tracking-[0.25em] text-[#A48654]">
                        Performance summary
                    </p>

                    <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        <Summary
                            label="Revenue / customer"
                            value={
                                uniqueCustomers > 0
                                    ? `€${formatMoney(
                                        revenue /
                                        uniqueCustomers
                                    )}`
                                    : "€0.00"
                            }
                        />

                        <Summary
                            label="Units / order"
                            value={
                                paidOrders.length > 0
                                    ? (
                                        unitsSold /
                                        paidOrders.length
                                    ).toFixed(1)
                                    : "0.0"
                            }
                        />

                        <Summary
                            label="Products sold"
                            value={String(
                                products.length
                            )}
                        />

                        <Summary
                            label="Paid rate"
                            value={
                                orders.length > 0
                                    ? `${(
                                        (paidOrders.length /
                                            orders.length) *
                                        100
                                    ).toFixed(1)}%`
                                    : "0.0%"
                            }
                        />
                    </div>
                </div>
            </section>

            <footer className="border-t border-black/10 px-6 py-8 md:px-10">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 text-[8px] uppercase tracking-[0.2em] text-black/25 sm:flex-row sm:justify-between">
          <span>
            NØRVA · Copenhagen · 2026
          </span>

                    <span>
            Commerce analytics
          </span>
                </div>
            </footer>
        </main>
    );
}

/* =========================
   COMPONENTS
========================= */

function NavLink({
                     href,
                     label,
                     active = false,
                 }: {
    href: string;
    label: string;
    active?: boolean;
}) {
    return (
        <Link
            href={href}
            className={`whitespace-nowrap py-4 text-[9px] uppercase tracking-[0.2em] transition ${
                active
                    ? "border-b border-[#A48654] text-[#A48654]"
                    : "text-black/35 hover:text-black"
            }`}
        >
            {label}
        </Link>
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
            <p className="text-[8px] uppercase tracking-[0.2em] text-black/35">
                {label}
            </p>

            <p
                className={`mt-4 text-3xl font-light ${
                    accent
                        ? "text-[#A48654]"
                        : ""
                }`}
            >
                {value}
            </p>
        </div>
    );
}

function SectionHeading({
                            eyebrow,
                            title,
                            description,
                        }: {
    eyebrow: string;
    title: string;
    description?: string;
}) {
    return (
        <div>
            <p className="text-[8px] uppercase tracking-[0.25em] text-[#A48654]">
                {eyebrow}
            </p>

            <h2 className="mt-2 text-3xl font-light tracking-[-0.03em]">
                {title}
            </h2>

            {description && (
                <p className="mt-3 text-xs font-light leading-6 text-black/40">
                    {description}
                </p>
            )}
        </div>
    );
}

function SmallLabel({
                        children,
                    }: {
    children: React.ReactNode;
}) {
    return (
        <p className="text-[8px] uppercase tracking-[0.17em] text-black/25">
            {children}
        </p>
    );
}

function Summary({
                     label,
                     value,
                 }: {
    label: string;
    value: string;
}) {
    return (
        <div>
            <p className="text-[8px] uppercase tracking-[0.18em] text-black/30">
                {label}
            </p>

            <p className="mt-3 text-2xl font-light">
                {value}
            </p>
        </div>
    );
}

function Empty({
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

function formatMoney(value: number) {
    return Number(value || 0).toLocaleString(
        "en-US",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    );
}

function formatDate(value: string) {
    return new Date(value).toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
        }
    );
}