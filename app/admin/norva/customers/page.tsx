import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminPage } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

type Order = {
    id: string;
    customer_name: string | null;
    customer_email: string | null;
    total: number;
    payment_status: string | null;
    order_status: string | null;
    created_at: string;
};

type Customer = {
    email: string;
    name: string;
    orders: number;
    paidOrders: number;
    totalSpent: number;
    averageOrder: number;
    lastOrder: string;
    firstOrder: string;
};

type PageProps = {
    searchParams: Promise<{
        search?: string;
        sort?: string;
    }>;
};

export default async function NorvaCustomersPage({
                                                     searchParams,
                                                 }: PageProps) {
    /* ========================================
       AUTH
    ======================================== */

    const supabaseAuth = await createClient();

    const {
        data: { user },
    } = await supabaseAuth.auth.getUser();

    if (!user) {
        redirect("/admin/norva/login");
    }

    // Logged in is not enough: the user must be an admin.
    await requireAdminPage("/admin/norva/login");

    /* ========================================
       LOAD ORDERS
    ======================================== */

    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from("norva_orders")
        .select(`
      id,
      customer_name,
      customer_email,
      total,
      payment_status,
      order_status,
      created_at
    `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("NØRVA customers error:", error);
    }

    const orders = (data ?? []) as Order[];

    /* ========================================
       BUILD CUSTOMERS FROM ORDERS
    ======================================== */

    const customerMap = new Map<
        string,
        {
            email: string;
            name: string;
            orders: number;
            paidOrders: number;
            totalSpent: number;
            dates: string[];
        }
    >();

    for (const order of orders) {
        const email = order.customer_email
            ?.trim()
            .toLowerCase();

        if (!email) continue;

        const existing = customerMap.get(email);

        if (existing) {
            existing.orders += 1;
            existing.dates.push(order.created_at);

            if (order.payment_status === "paid") {
                existing.paidOrders += 1;
                existing.totalSpent += Number(
                    order.total || 0
                );
            }

            if (
                (!existing.name ||
                    existing.name === "Guest customer") &&
                order.customer_name
            ) {
                existing.name = order.customer_name;
            }
        } else {
            customerMap.set(email, {
                email,
                name:
                    order.customer_name?.trim() ||
                    "Guest customer",
                orders: 1,
                paidOrders:
                    order.payment_status === "paid"
                        ? 1
                        : 0,
                totalSpent:
                    order.payment_status === "paid"
                        ? Number(order.total || 0)
                        : 0,
                dates: [order.created_at],
            });
        }
    }

    let customers: Customer[] = Array.from(
        customerMap.values()
    ).map((customer) => {
        const timestamps = customer.dates
            .map((date) => new Date(date).getTime())
            .filter(Number.isFinite);

        return {
            email: customer.email,
            name: customer.name,
            orders: customer.orders,
            paidOrders: customer.paidOrders,
            totalSpent: customer.totalSpent,

            averageOrder:
                customer.paidOrders > 0
                    ? customer.totalSpent /
                    customer.paidOrders
                    : 0,

            lastOrder: new Date(
                Math.max(...timestamps)
            ).toISOString(),

            firstOrder: new Date(
                Math.min(...timestamps)
            ).toISOString(),
        };
    });

    /* ========================================
       SEARCH + SORT
    ======================================== */

    const params = await searchParams;

    const search =
        params.search?.trim().toLowerCase() ?? "";

    const sort = params.sort ?? "recent";

    if (search) {
        customers = customers.filter(
            (customer) =>
                customer.name
                    .toLowerCase()
                    .includes(search) ||
                customer.email
                    .toLowerCase()
                    .includes(search)
        );
    }

    switch (sort) {
        case "spent-high":
            customers.sort(
                (a, b) =>
                    b.totalSpent - a.totalSpent
            );
            break;

        case "spent-low":
            customers.sort(
                (a, b) =>
                    a.totalSpent - b.totalSpent
            );
            break;

        case "orders-high":
            customers.sort(
                (a, b) => b.orders - a.orders
            );
            break;

        case "orders-low":
            customers.sort(
                (a, b) => a.orders - b.orders
            );
            break;

        case "name":
            customers.sort((a, b) =>
                a.name.localeCompare(b.name)
            );
            break;

        case "oldest":
            customers.sort(
                (a, b) =>
                    new Date(a.lastOrder).getTime() -
                    new Date(b.lastOrder).getTime()
            );
            break;

        default:
            customers.sort(
                (a, b) =>
                    new Date(b.lastOrder).getTime() -
                    new Date(a.lastOrder).getTime()
            );
    }

    /* ========================================
       STATS
    ======================================== */

    const allCustomers =
        Array.from(customerMap.values());

    const totalCustomers = allCustomers.length;

    const repeatCustomers =
        allCustomers.filter(
            (customer) => customer.orders > 1
        ).length;

    const totalRevenue =
        allCustomers.reduce(
            (sum, customer) =>
                sum + customer.totalSpent,
            0
        );

    const averageCustomerValue =
        totalCustomers > 0
            ? totalRevenue / totalCustomers
            : 0;

    /* ========================================
       UI
    ======================================== */

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

                {/* NAVIGATION */}
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
                            active
                        />

                        <span className="whitespace-nowrap py-4 text-[9px] uppercase tracking-[0.2em] text-black/20">
              Analytics
            </span>
                    </div>
                </nav>
            </header>

            {/* HERO */}
            <section className="border-b border-black/10">
                <div className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-16">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-[#A48654]">
                        Relationships
                    </p>

                    <h1 className="mt-4 text-5xl font-light tracking-[-0.05em] md:text-7xl">
                        Customers
                        <span className="font-serif italic text-[#A48654]">
              .
            </span>
                    </h1>

                    <p className="mt-5 max-w-xl text-sm font-light leading-7 text-black/45">
                        Customer activity calculated automatically
                        from NØRVA orders and completed payments.
                    </p>
                </div>
            </section>

            {/* STATS */}
            <section className="border-b border-black/10 bg-[#EEE8DD]">
                <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
                    <Stat
                        label="Customers"
                        value={String(totalCustomers)}
                    />

                    <Stat
                        label="Repeat customers"
                        value={String(repeatCustomers)}
                    />

                    <Stat
                        label="Customer revenue"
                        value={`€${totalRevenue.toLocaleString(
                            "en-US",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }
                        )}`}
                        accent
                    />

                    <Stat
                        label="Avg. customer value"
                        value={`€${averageCustomerValue.toLocaleString(
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
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.28em] text-[#A48654]">
                            Directory
                        </p>

                        <h2 className="mt-3 text-3xl font-light">
                            Customer list
                        </h2>
                    </div>

                    <p className="text-[9px] uppercase tracking-[0.18em] text-black/30">
                        {customers.length}{" "}
                        {customers.length === 1
                            ? "customer"
                            : "customers"}
                    </p>
                </div>

                {/* FILTERS */}
                <form
                    method="GET"
                    className="mt-10 grid gap-3 md:grid-cols-[1fr_240px_auto]"
                >
                    <input
                        type="search"
                        name="search"
                        defaultValue={params.search ?? ""}
                        placeholder="Search customer or email..."
                        className="border border-black/10 bg-[#F8F5EF] px-5 py-4 text-sm font-light outline-none transition placeholder:text-black/25 focus:border-[#A48654]"
                    />

                    <select
                        name="sort"
                        defaultValue={sort}
                        className="border border-black/10 bg-[#F8F5EF] px-5 py-4 text-[9px] uppercase tracking-[0.15em] text-black/55 outline-none focus:border-[#A48654]"
                    >
                        <option value="recent">
                            Most recent
                        </option>

                        <option value="oldest">
                            Oldest activity
                        </option>

                        <option value="spent-high">
                            Highest spent
                        </option>

                        <option value="spent-low">
                            Lowest spent
                        </option>

                        <option value="orders-high">
                            Most orders
                        </option>

                        <option value="orders-low">
                            Fewest orders
                        </option>

                        <option value="name">
                            Name · A–Z
                        </option>
                    </select>

                    <button
                        type="submit"
                        className="bg-[#181714] px-7 py-4 text-[8px] uppercase tracking-[0.2em] text-white transition hover:bg-[#A48654]"
                    >
                        Apply
                    </button>
                </form>

                {(params.search ||
                    (params.sort &&
                        params.sort !== "recent")) && (
                    <div className="mt-4 flex justify-end">
                        <Link
                            href="/admin/norva/customers"
                            className="text-[8px] uppercase tracking-[0.18em] text-black/35 transition hover:text-[#A48654]"
                        >
                            Clear filters ×
                        </Link>
                    </div>
                )}

                {/* CUSTOMER TABLE */}
                <div className="mt-10 border-t border-black/10">
                    {customers.length === 0 ? (
                        <div className="border-b border-black/10 py-24 text-center">
                            <p className="text-sm font-light text-black/40">
                                {search
                                    ? "No customers match your search."
                                    : "No customers yet."}
                            </p>
                        </div>
                    ) : (
                        customers.map(
                            (customer, index) => (
                                <article
                                    key={customer.email}
                                    className="grid gap-6 border-b border-black/10 py-7 md:grid-cols-[55px_1.5fr_0.55fr_0.8fr_0.8fr_0.8fr] md:items-center"
                                >
                                    {/* NUMBER */}
                                    <div className="font-serif text-lg italic text-[#A48654]">
                                        {String(index + 1).padStart(
                                            2,
                                            "0"
                                        )}
                                    </div>

                                    {/* CUSTOMER */}
                                    <div>
                                        <p className="text-sm font-medium">
                                            {customer.name}
                                        </p>

                                        <p className="mt-2 text-[10px] text-black/35">
                                            {customer.email}
                                        </p>

                                        {customer.orders > 1 && (
                                            <span className="mt-3 inline-block border border-[#A48654]/30 bg-[#A48654]/5 px-2 py-1 text-[7px] uppercase tracking-[0.16em] text-[#A48654]">
                        Returning
                      </span>
                                        )}
                                    </div>

                                    {/* ORDERS */}
                                    <CustomerValue
                                        label="Orders"
                                        value={String(
                                            customer.orders
                                        )}
                                    />

                                    {/* TOTAL */}
                                    <CustomerValue
                                        label="Total spent"
                                        value={`€${customer.totalSpent.toLocaleString(
                                            "en-US",
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }
                                        )}`}
                                        accent
                                    />

                                    {/* AVERAGE */}
                                    <CustomerValue
                                        label="Avg. order"
                                        value={`€${customer.averageOrder.toLocaleString(
                                            "en-US",
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }
                                        )}`}
                                    />

                                    {/* LAST ORDER */}
                                    <div>
                                        <SmallLabel>
                                            Last order
                                        </SmallLabel>

                                        <p className="mt-2 text-xs">
                                            {new Date(
                                                customer.lastOrder
                                            ).toLocaleDateString(
                                                "en-GB",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                }
                                            )}
                                        </p>
                                    </div>
                                </article>
                            )
                        )
                    )}
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-black/10 px-6 py-8 md:px-10">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 text-[8px] uppercase tracking-[0.2em] text-black/25 sm:flex-row sm:justify-between">
          <span>
            NØRVA · Copenhagen · 2026
          </span>

                    <span>
            Customer administration
          </span>
                </div>
            </footer>
        </main>
    );
}

/* ========================================
   COMPONENTS
======================================== */

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

function CustomerValue({
                           label,
                           value,
                           accent = false,
                       }: {
    label: string;
    value: string;
    accent?: boolean;
}) {
    return (
        <div>
            <SmallLabel>{label}</SmallLabel>

            <p
                className={`mt-2 text-sm ${
                    accent ? "text-[#A48654]" : ""
                }`}
            >
                {value}
            </p>
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