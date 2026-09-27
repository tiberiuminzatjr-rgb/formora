import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import OrderStatus from "./OrderStatus";
import LogoutButton from "./LogoutButton";

export const dynamic = "force-dynamic";

type OrderItem = {
    id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    line_total: number;
};

type Order = {
    id: string;
    stripe_session_id: string | null;
    customer_name: string | null;
    customer_email: string | null;
    total: number;
    currency: string | null;
    payment_status: string | null;
    order_status: string | null;
    created_at: string;
    norva_order_items: OrderItem[] | null;
};

type PageProps = {
    searchParams: Promise<{
        search?: string;
        status?: string;
        payment?: string;
        sort?: string;
    }>;
};

export default async function NorvaOrdersPage({
                                                  searchParams,
                                              }: PageProps) {
    /* ==============================
       AUTH
    ============================== */

    const supabaseAuth = await createClient();

    const {
        data: { user },
    } = await supabaseAuth.auth.getUser();

    if (!user) {
        redirect("/admin/norva/login");
    }

    /* ==============================
       LOAD ORDERS
    ============================== */

    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from("norva_orders")
        .select(`
      id,
      stripe_session_id,
      customer_name,
      customer_email,
      total,
      currency,
      payment_status,
      order_status,
      created_at,
      norva_order_items (
        id,
        product_name,
        quantity,
        unit_price,
        line_total
      )
    `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("NØRVA orders error:", error);
    }

    const allOrders = (data ?? []) as Order[];

    /* ==============================
       GLOBAL STATS
    ============================== */

    const paidOrders = allOrders.filter(
        (order) => order.payment_status === "paid"
    );

    const totalRevenue = paidOrders.reduce(
        (sum, order) => sum + Number(order.total || 0),
        0
    );

    const newOrders = allOrders.filter(
        (order) => order.order_status === "new"
    ).length;

    const processingOrders = allOrders.filter(
        (order) => order.order_status === "processing"
    ).length;

    const shippedOrders = allOrders.filter(
        (order) => order.order_status === "shipped"
    ).length;

    const completedOrders = allOrders.filter(
        (order) => order.order_status === "completed"
    ).length;

    /* ==============================
       FILTERS
    ============================== */

    const params = await searchParams;

    const search = params.search?.trim().toLowerCase() ?? "";
    const status = params.status ?? "all";
    const payment = params.payment ?? "all";
    const sort = params.sort ?? "newest";

    let orders = [...allOrders];

    if (search) {
        orders = orders.filter((order) => {
            const orderNumber = order.id
                .slice(0, 8)
                .toLowerCase();

            const fullId = order.id.toLowerCase();

            const customerName =
                order.customer_name?.toLowerCase() ?? "";

            const customerEmail =
                order.customer_email?.toLowerCase() ?? "";

            const stripe =
                order.stripe_session_id?.toLowerCase() ?? "";

            const productMatch =
                order.norva_order_items?.some((item) =>
                    item.product_name
                        .toLowerCase()
                        .includes(search)
                ) ?? false;

            return (
                orderNumber.includes(search) ||
                fullId.includes(search) ||
                customerName.includes(search) ||
                customerEmail.includes(search) ||
                stripe.includes(search) ||
                productMatch
            );
        });
    }

    if (status !== "all") {
        orders = orders.filter(
            (order) => order.order_status === status
        );
    }

    if (payment !== "all") {
        orders = orders.filter(
            (order) => order.payment_status === payment
        );
    }

    switch (sort) {
        case "oldest":
            orders.sort(
                (a, b) =>
                    new Date(a.created_at).getTime() -
                    new Date(b.created_at).getTime()
            );
            break;

        case "total-high":
            orders.sort(
                (a, b) =>
                    Number(b.total) - Number(a.total)
            );
            break;

        case "total-low":
            orders.sort(
                (a, b) =>
                    Number(a.total) - Number(b.total)
            );
            break;

        case "customer":
            orders.sort((a, b) =>
                (a.customer_name ?? "").localeCompare(
                    b.customer_name ?? ""
                )
            );
            break;

        default:
            orders.sort(
                (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
            );
    }

    const filtersActive =
        Boolean(params.search) ||
        status !== "all" ||
        payment !== "all" ||
        sort !== "newest";

    /* ==============================
       UI
    ============================== */

    return (
        <main className="min-h-screen bg-[#F4F0E8] text-[#181714]">
            {/* HEADER */}
            <header className="border-b border-black/10 bg-[#F8F5EF]">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-7 md:px-10">
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
                            className="hidden text-[9px] uppercase tracking-[0.2em] text-black/35 transition hover:text-[#A48654] sm:block"
                        >
                            View store ↗
                        </Link>

                        <div className="hidden h-4 w-px bg-black/10 sm:block" />

                        <LogoutButton />
                    </div>
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
                            active
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
                        />
                    </div>
                </nav>
            </header>

            {/* HERO */}
            <section className="border-b border-black/10">
                <div className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-16">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-[#A48654]">
                        NØRVA Commerce
                    </p>

                    <div className="mt-5 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="text-5xl font-light tracking-[-0.05em] md:text-7xl">
                                Customer
                                <br />

                                <span className="font-serif italic text-[#A48654]">
                  orders.
                </span>
                            </h1>

                            <p className="mt-6 max-w-lg text-sm font-light leading-7 text-black/45">
                                Search, filter and manage purchases,
                                payments and fulfilment across the
                                NØRVA store.
                            </p>
                        </div>

                        <div className="text-left md:text-right">
                            <p className="text-[8px] uppercase tracking-[0.2em] text-black/25">
                                Live commerce
                            </p>

                            <p className="mt-2 text-sm font-light">
                                {allOrders.length} total orders
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS */}
            <section className="border-b border-black/10 bg-[#EEE8DD]">
                <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-6">
                    <Stat
                        label="Orders"
                        value={allOrders.length}
                    />

                    <Stat
                        label="New"
                        value={newOrders}
                        accent
                    />

                    <Stat
                        label="Processing"
                        value={processingOrders}
                    />

                    <Stat
                        label="Shipped"
                        value={shippedOrders}
                    />

                    <Stat
                        label="Completed"
                        value={completedOrders}
                    />

                    <Stat
                        label="Revenue"
                        value={`€${formatMoney(totalRevenue)}`}
                    />
                </div>
            </section>

            {/* CONTENT */}
            <section className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-20">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.28em] text-[#A48654]">
                            Order management
                        </p>

                        <h2 className="mt-3 text-3xl font-light tracking-[-0.03em]">
                            All orders
                        </h2>
                    </div>

                    <p className="text-[9px] uppercase tracking-[0.18em] text-black/30">
                        Showing {orders.length} of {allOrders.length}
                    </p>
                </div>

                {/* FILTERS */}
                <form
                    method="GET"
                    className="mt-10 space-y-3"
                >
                    <input
                        type="search"
                        name="search"
                        defaultValue={params.search ?? ""}
                        placeholder="Search order, customer, email or product..."
                        className="w-full border border-black/10 bg-[#F8F5EF] px-5 py-4 text-sm font-light outline-none transition placeholder:text-black/25 focus:border-[#A48654]"
                    />

                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto]">
                        {/* STATUS */}
                        <select
                            name="status"
                            defaultValue={status}
                            className={selectClass}
                        >
                            <option value="all">
                                All statuses
                            </option>

                            <option value="new">
                                New
                            </option>

                            <option value="processing">
                                Processing
                            </option>

                            <option value="shipped">
                                Shipped
                            </option>

                            <option value="completed">
                                Completed
                            </option>

                            <option value="cancelled">
                                Cancelled
                            </option>
                        </select>

                        {/* PAYMENT */}
                        <select
                            name="payment"
                            defaultValue={payment}
                            className={selectClass}
                        >
                            <option value="all">
                                All payments
                            </option>

                            <option value="paid">
                                Paid
                            </option>

                            <option value="unpaid">
                                Unpaid
                            </option>

                            <option value="pending">
                                Pending
                            </option>

                            <option value="failed">
                                Failed
                            </option>

                            <option value="refunded">
                                Refunded
                            </option>
                        </select>

                        {/* SORT */}
                        <select
                            name="sort"
                            defaultValue={sort}
                            className={selectClass}
                        >
                            <option value="newest">
                                Newest first
                            </option>

                            <option value="oldest">
                                Oldest first
                            </option>

                            <option value="total-high">
                                Total · High to low
                            </option>

                            <option value="total-low">
                                Total · Low to high
                            </option>

                            <option value="customer">
                                Customer · A–Z
                            </option>
                        </select>

                        <button
                            type="submit"
                            className="bg-[#181714] px-7 py-4 text-[8px] uppercase tracking-[0.2em] text-white transition hover:bg-[#A48654]"
                        >
                            Apply filters
                        </button>
                    </div>
                </form>

                {filtersActive && (
                    <div className="mt-4 flex justify-end">
                        <Link
                            href="/admin/norva/orders"
                            className="text-[8px] uppercase tracking-[0.18em] text-black/35 transition hover:text-[#A48654]"
                        >
                            Clear filters ×
                        </Link>
                    </div>
                )}

                {/* ORDERS */}
                <div className="mt-10 border-t border-black/10">
                    {orders.length === 0 ? (
                        <div className="border-b border-black/10 py-24 text-center">
                            <p className="text-sm font-light text-black/40">
                                {filtersActive
                                    ? "No orders match these filters."
                                    : "No NØRVA orders yet."}
                            </p>

                            {filtersActive && (
                                <Link
                                    href="/admin/norva/orders"
                                    className="mt-5 inline-block text-[8px] uppercase tracking-[0.2em] text-[#A48654]"
                                >
                                    Clear filters →
                                </Link>
                            )}
                        </div>
                    ) : (
                        orders.map((order) => {
                            const date = new Date(order.created_at);

                            const orderNumber = order.id
                                .slice(0, 8)
                                .toUpperCase();

                            const itemCount =
                                order.norva_order_items?.reduce(
                                    (sum, item) =>
                                        sum + Number(item.quantity),
                                    0
                                ) ?? 0;

                            return (
                                <article
                                    key={order.id}
                                    className="group border-b border-black/10 py-8 md:py-10"
                                >
                                    {/* TOP */}
                                    <div className="grid gap-8 lg:grid-cols-[0.75fr_1.2fr_0.65fr_0.85fr] lg:items-start">
                                        {/* ORDER */}
                                        <div>
                                            <SmallLabel>
                                                Order
                                            </SmallLabel>

                                            <p className="mt-3 text-lg font-medium tracking-[0.04em]">
                                                #{orderNumber}
                                            </p>

                                            <p className="mt-2 text-[10px] leading-5 text-black/35">
                                                {date.toLocaleDateString(
                                                    "en-GB",
                                                    {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    }
                                                )}

                                                {" · "}

                                                {date.toLocaleTimeString(
                                                    "en-GB",
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    }
                                                )}
                                            </p>
                                        </div>

                                        {/* CUSTOMER */}
                                        <div>
                                            <SmallLabel>
                                                Customer
                                            </SmallLabel>

                                            <p className="mt-3 text-sm">
                                                {order.customer_name ||
                                                    "Guest customer"}
                                            </p>

                                            <p className="mt-2 break-all text-xs text-black/35">
                                                {order.customer_email ||
                                                    "No email"}
                                            </p>
                                        </div>

                                        {/* TOTAL */}
                                        <div>
                                            <SmallLabel>
                                                Total
                                            </SmallLabel>

                                            <p className="mt-3 text-lg font-medium">
                                                {order.currency?.toUpperCase() ||
                                                    "EUR"}{" "}
                                                {formatMoney(
                                                    Number(order.total)
                                                )}
                                            </p>

                                            <PaymentBadge
                                                status={
                                                    order.payment_status ??
                                                    "unknown"
                                                }
                                            />
                                        </div>

                                        {/* STATUS */}
                                        <div>
                                            <OrderStatus
                                                orderId={order.id}
                                                initialStatus={order.order_status ?? "new"}
                                            />
                                        </div>
                                    </div>

                                    {/* PRODUCTS */}
                                    <div className="mt-8 border-t border-black/[0.07] pt-5">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center justify-between gap-4">
                                                <p className="text-[8px] uppercase tracking-[0.2em] text-black/25">
                                                    {itemCount}{" "}
                                                    {itemCount === 1
                                                        ? "product"
                                                        : "products"}
                                                </p>

                                                <p className="text-[8px] uppercase tracking-[0.16em] text-black/20">
                                                    Order #{orderNumber}
                                                </p>
                                            </div>

                                            {order.norva_order_items &&
                                                order.norva_order_items.length >
                                                0 && (
                                                    <div className="grid gap-px overflow-hidden border border-black/[0.07] bg-black/[0.07]">
                                                        {order.norva_order_items.map(
                                                            (item) => (
                                                                <div
                                                                    key={item.id}
                                                                    className="grid gap-3 bg-[#F8F5EF] px-4 py-4 sm:grid-cols-[1fr_80px_120px] sm:items-center"
                                                                >
                                                                    <div className="flex items-center gap-3">
                                    <span className="font-serif text-base italic text-[#A48654]">
                                      {item.quantity}×
                                    </span>

                                                                        <span className="text-xs text-black/60">
                                      {item.product_name}
                                    </span>
                                                                    </div>

                                                                    <div>
                                                                        <SmallLabel>
                                                                            Unit
                                                                        </SmallLabel>

                                                                        <p className="mt-1 text-[10px]">
                                                                            {order.currency?.toUpperCase() ||
                                                                                "EUR"}{" "}
                                                                            {formatMoney(
                                                                                Number(
                                                                                    item.unit_price
                                                                                )
                                                                            )}
                                                                        </p>
                                                                    </div>

                                                                    <div className="sm:text-right">
                                                                        <SmallLabel>
                                                                            Line total
                                                                        </SmallLabel>

                                                                        <p className="mt-1 text-[10px] font-medium">
                                                                            {order.currency?.toUpperCase() ||
                                                                                "EUR"}{" "}
                                                                            {formatMoney(
                                                                                Number(
                                                                                    item.line_total
                                                                                )
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    </div>

                                    {/* META */}
                                    <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <p className="max-w-full truncate text-[8px] uppercase tracking-[0.12em] text-black/15">
                                            Stripe ·{" "}
                                            {order.stripe_session_id ||
                                                "No session"}
                                        </p>

                                        <p className="text-[8px] uppercase tracking-[0.15em] text-black/20">
                                            ID · {order.id}
                                        </p>
                                    </div>
                                </article>
                            );
                        })
                    )}
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-black/10 px-6 py-8 md:px-10">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 text-[8px] uppercase tracking-[0.2em] text-black/25 sm:flex-row sm:items-center sm:justify-between">
          <span>
            NØRVA · Copenhagen · 2026
          </span>

                    <span>
            Commerce administration
          </span>
                </div>
            </footer>
        </main>
    );
}

/* ==============================
   COMPONENTS
============================== */

const selectClass =
    "border border-black/10 bg-[#F8F5EF] px-5 py-4 text-[9px] uppercase tracking-[0.15em] text-black/55 outline-none transition focus:border-[#A48654]";

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
    value: string | number;
    accent?: boolean;
}) {
    return (
        <div className="border-b border-r border-black/10 p-6 lg:border-b-0 md:p-7">
            <p className="text-[8px] uppercase tracking-[0.2em] text-black/35">
                {label}
            </p>

            <p
                className={`mt-4 text-3xl font-light ${
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

function PaymentBadge({
                          status,
                      }: {
    status: string;
}) {
    const normalized =
        status.toLowerCase();

    const paid = normalized === "paid";
    const failed =
        normalized === "failed";
    const refunded =
        normalized === "refunded";

    const dotClass = paid
        ? "bg-[#6C8A63]"
        : failed
            ? "bg-[#A45B4B]"
            : refunded
                ? "bg-[#A48654]"
                : "bg-black/30";

    const textClass = paid
        ? "text-[#6C8A63]"
        : failed
            ? "text-[#A45B4B]"
            : refunded
                ? "text-[#A48654]"
                : "text-black/40";

    return (
        <div className="mt-2 inline-flex items-center gap-2">
      <span
          className={`h-1.5 w-1.5 rounded-full ${dotClass}`}
      />

            <span
                className={`text-[8px] uppercase tracking-[0.18em] ${textClass}`}
            >
        {status}
      </span>
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