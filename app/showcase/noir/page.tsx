import Link from "next/link";

const dishes = [
    {
        number: "01",
        name: "Truffle Risotto",
        description:
            "Carnaroli rice, aged parmesan, black truffle and brown butter.",
        price: "98",
    },
    {
        number: "02",
        name: "Beef Tenderloin",
        description:
            "Dry-aged beef, smoked potato, seasonal greens and red wine jus.",
        price: "148",
    },
    {
        number: "03",
        name: "Wild Sea Bass",
        description:
            "Line-caught sea bass, beurre blanc, asparagus and lemon oil.",
        price: "126",
    },
    {
        number: "04",
        name: "Dark Chocolate",
        description:
            "70% chocolate, salted caramel, hazelnut and vanilla.",
        price: "62",
    },
];

export default function NoirShowcase() {
    return (
        <main className="min-h-screen bg-[#0b0a09] text-[#f3eee6]">
            <Link
                href="/#projects"
                className="fixed bottom-5 left-5 z-[100] flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.15em] text-white/70 shadow-2xl backdrop-blur-xl transition hover:border-white/30 hover:bg-black hover:text-white"
            >
                <span>←</span>
                Back to FORMORA
            </Link>
            {/* NAVIGATION */}
            <header className="absolute left-0 top-0 z-50 w-full">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7 lg:px-10">
                    <a
                        href="#top"
                        className="font-serif text-2xl tracking-[0.22em] text-white"
                    >
                        NOIR
                    </a>

                    <nav className="hidden items-center gap-9 text-[11px] uppercase tracking-[0.2em] text-white/55 md:flex">
                        <a href="#story" className="transition hover:text-white">
                            Our story
                        </a>
                        <a href="#menu" className="transition hover:text-white">
                            Menu
                        </a>
                        <a href="#experience" className="transition hover:text-white">
                            Experience
                        </a>
                        <a href="#contact" className="transition hover:text-white">
                            Contact
                        </a>
                    </nav>

                    <a
                        href="#reservation"
                        className="border border-white/30 px-5 py-3 text-[10px] uppercase tracking-[0.2em] transition hover:bg-white hover:text-black"
                    >
                        Reserve a table
                    </a>
                </div>
            </header>

            {/* HERO */}
            <section
                id="top"
                className="relative flex min-h-screen items-end overflow-hidden"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=2200&q=90')",
                    }}
                />

                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0a09] via-black/10 to-black/40" />

                <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 lg:px-10 lg:pb-28">
                    <p className="mb-6 text-[10px] uppercase tracking-[0.4em] text-[#d0b68a]">
                        Contemporary fine dining · Cluj-Napoca
                    </p>

                    <h1 className="max-w-5xl font-serif text-[18vw] font-light leading-[0.73] tracking-[-0.06em] sm:text-8xl lg:text-[150px]">
                        Taste
                        <br />
                        <span className="italic text-[#d0b68a]">the night.</span>
                    </h1>

                    <div className="mt-10 flex flex-col gap-6 border-t border-white/20 pt-6 md:flex-row md:items-center md:justify-between">
                        <p className="max-w-md text-sm leading-7 text-white/55">
                            An intimate dining experience built around fire, seasonality and
                            exceptional ingredients.
                        </p>

                        <a
                            href="#story"
                            className="text-[10px] uppercase tracking-[0.25em] text-white/70 transition hover:text-white"
                        >
                            Discover NOIR ↓
                        </a>
                    </div>
                </div>
            </section>

            {/* STORY */}
            <section
                id="story"
                className="mx-auto grid max-w-7xl gap-16 px-6 py-28 lg:grid-cols-2 lg:px-10 lg:py-40"
            >
                <div>
                    <p className="text-[10px] uppercase tracking-[0.35em] text-[#b99b6b]">
                        Our philosophy
                    </p>

                    <h2 className="mt-8 max-w-xl font-serif text-5xl font-light leading-[1.05] tracking-[-0.03em] md:text-7xl">
                        Simplicity is the
                        <span className="italic text-[#c8ab7c]"> ultimate luxury.</span>
                    </h2>
                </div>

                <div className="flex flex-col justify-end lg:pl-16">
                    <p className="max-w-lg text-base leading-8 text-[#aaa39a]">
                        NOIR is a contemporary restaurant where local ingredients meet
                        modern European technique. Every plate begins with a simple idea:
                        respect the ingredient and remove everything that does not belong.
                    </p>

                    <p className="mt-7 max-w-lg text-base leading-8 text-[#77716a]">
                        Our menu changes with the seasons, guided by small producers,
                        natural flavours and the quiet rhythm of the kitchen.
                    </p>

                    <div className="mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-7">
                        <div>
                            <p className="font-serif text-3xl">12</p>
                            <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-white/30">
                                Tables
                            </p>
                        </div>

                        <div>
                            <p className="font-serif text-3xl">4</p>
                            <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-white/30">
                                Seasons
                            </p>
                        </div>

                        <div>
                            <p className="font-serif text-3xl">1</p>
                            <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-white/30">
                                Experience
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* IMAGE BREAK */}
            <section className="px-3 md:px-6">
                <div
                    className="h-[65vh] min-h-[500px] bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2200&q=90')",
                    }}
                />
            </section>

            {/* MENU */}
            <section
                id="menu"
                className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40"
            >
                <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.35em] text-[#b99b6b]">
                            À la carte
                        </p>

                        <h2 className="mt-7 font-serif text-6xl font-light tracking-[-0.04em] md:text-7xl">
                            The
                            <br />
                            <span className="italic text-[#c8ab7c]">menu.</span>
                        </h2>

                        <p className="mt-8 max-w-xs text-sm leading-7 text-white/35">
                            A selection from our seasonal menu. Ingredients and dishes may
                            change daily.
                        </p>
                    </div>

                    <div className="border-t border-white/15">
                        {dishes.map((dish) => (
                            <div
                                key={dish.number}
                                className="group grid grid-cols-[40px_1fr_auto] gap-4 border-b border-white/10 py-7 md:py-9"
                            >
                <span className="pt-1 text-[9px] text-white/25">
                  {dish.number}
                </span>

                                <div>
                                    <h3 className="font-serif text-2xl transition group-hover:text-[#d0b68a] md:text-3xl">
                                        {dish.name}
                                    </h3>

                                    <p className="mt-3 max-w-lg text-xs leading-6 text-white/35 md:text-sm">
                                        {dish.description}
                                    </p>
                                </div>

                                <p className="font-serif text-lg text-[#c8ab7c]">
                                    {dish.price}
                                    <span className="ml-1 text-[10px] text-white/30">RON</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* EXPERIENCE */}
            <section
                id="experience"
                className="border-y border-white/10 bg-[#11100e]"
            >
                <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
                    <div
                        className="min-h-[600px] bg-cover bg-center"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1600&q=90')",
                        }}
                    />

                    <div className="flex items-center px-7 py-24 md:px-16 lg:px-20">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.35em] text-[#b99b6b]">
                                The experience
                            </p>

                            <h2 className="mt-8 max-w-lg font-serif text-5xl font-light leading-[1.05] md:text-6xl">
                                Dinner should be
                                <span className="italic text-[#c8ab7c]"> remembered.</span>
                            </h2>

                            <p className="mt-8 max-w-md text-sm leading-7 text-white/40">
                                Low light. Warm conversation. A kitchen working quietly behind
                                the scenes. NOIR was designed for evenings that deserve a
                                little more time.
                            </p>

                            <div className="mt-10 flex gap-10">
                                <div>
                                    <p className="font-serif text-xl">Tue — Sun</p>
                                    <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-white/30">
                                        Open
                                    </p>
                                </div>

                                <div>
                                    <p className="font-serif text-xl">18:00 — 23:30</p>
                                    <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-white/30">
                                        Dinner
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* QUOTE */}
            <section className="mx-auto max-w-5xl px-6 py-28 text-center lg:py-40">
                <p className="font-serif text-4xl italic leading-tight text-[#d0b68a] md:text-6xl">
                    “Cooking is the art of turning a moment into a memory.”
                </p>

                <p className="mt-8 text-[9px] uppercase tracking-[0.3em] text-white/25">
                    The NOIR philosophy
                </p>
            </section>

            {/* RESERVATION */}
            <section
                id="reservation"
                className="relative overflow-hidden border-t border-white/10"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-25"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=2200&q=90')",
                    }}
                />

                <div className="absolute inset-0 bg-[#090807]/80" />

                <div className="relative mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40">
                    <div className="grid gap-14 lg:grid-cols-2 lg:items-end">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.35em] text-[#b99b6b]">
                                Reservations
                            </p>

                            <h2 className="mt-7 font-serif text-6xl font-light leading-[0.95] md:text-8xl">
                                Your table
                                <br />
                                <span className="italic text-[#c8ab7c]">awaits.</span>
                            </h2>
                        </div>

                        <div className="lg:pl-16">
                            <p className="max-w-md text-sm leading-7 text-white/45">
                                Join us for an intimate evening at NOIR. For parties larger
                                than six guests, please contact the restaurant directly.
                            </p>

                            <a
                                href="mailto:reservations@example.com"
                                className="mt-9 inline-flex border border-[#c8ab7c] bg-[#c8ab7c] px-8 py-4 text-[10px] font-medium uppercase tracking-[0.22em] text-black transition hover:bg-transparent hover:text-[#c8ab7c]"
                            >
                                Reserve a table
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer id="contact" className="border-t border-white/10 bg-[#080706]">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
                    <div className="grid gap-12 md:grid-cols-3">
                        <div>
                            <p className="font-serif text-3xl tracking-[0.2em]">NOIR</p>

                            <p className="mt-5 max-w-xs text-xs leading-6 text-white/30">
                                Contemporary fine dining in the heart of Cluj-Napoca.
                            </p>
                        </div>

                        <div>
                            <p className="text-[9px] uppercase tracking-[0.25em] text-white/25">
                                Visit
                            </p>

                            <p className="mt-5 text-sm leading-7 text-white/50">
                                Cluj-Napoca
                                <br />
                                Romania
                            </p>
                        </div>

                        <div>
                            <p className="text-[9px] uppercase tracking-[0.25em] text-white/25">
                                Contact
                            </p>

                            <div className="mt-5 text-sm leading-7 text-white/50">
                                <p>reservations@example.com</p>
                                <p>+40 700 000 000</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 flex flex-col gap-5 border-t border-white/10 pt-7 text-[9px] uppercase tracking-[0.2em] text-white/20 sm:flex-row sm:items-center sm:justify-between">
                        <p>© 2026 NOIR Restaurant</p>

                        <Link
                            href="/"
                            className="transition hover:text-[#c8ab7c]"
                        >
                            A showcase by FORMORA →
                        </Link>
                    </div>
                </div>
            </footer>
        </main>
    );
}