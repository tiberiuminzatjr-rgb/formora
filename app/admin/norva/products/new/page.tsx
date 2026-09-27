"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

export default function NewNorvaProductPage() {
    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [material, setMaterial] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [stock, setStock] = useState("0");
    const [featured, setFeatured] = useState(false);
    const [active, setActive] = useState(true);

    const [saving, setSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    function createSlug(value: string) {
        return value
            .toLowerCase()
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setSaving(true);
        setErrorMessage("");

        try {
            const cleanName = name.trim();

            if (!cleanName) {
                throw new Error("Product name is required.");
            }

            const numericPrice = Number(price);
            const numericStock = Number(stock);

            if (
                !Number.isFinite(numericPrice) ||
                numericPrice < 0
            ) {
                throw new Error("Enter a valid price.");
            }

            if (
                !Number.isInteger(numericStock) ||
                numericStock < 0
            ) {
                throw new Error(
                    "Stock must be a whole number of 0 or more."
                );
            }

            const response = await fetch(
                "/api/norva/admin/products",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: cleanName,
                        description: description.trim(),
                        price: numericPrice,
                        category: category.trim(),
                        material: material.trim(),
                        image_url: imageUrl.trim(),
                        stock: numericStock,
                        featured,
                        active,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    router.replace("/admin/norva/login");
                    router.refresh();
                    return;
                }

                throw new Error(
                    result.error || "Could not create product."
                );
            }

            router.push("/admin/norva/products");
            router.refresh();
        } catch (error) {
            console.error(
                "NØRVA Add Product error:",
                error
            );

            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Could not create product."
            );

            setSaving(false);
        }
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
                        Catalogue
                    </p>

                    <h1 className="mt-4 text-5xl font-light tracking-[-0.05em] md:text-6xl">
                        Add{" "}
                        <span className="font-serif italic text-[#A48654]">
              product.
            </span>
                    </h1>

                    <p className="mt-5 max-w-xl text-sm font-light leading-7 text-black/45">
                        Create a new piece for the NØRVA collection.
                        You can keep it as a draft or publish it
                        immediately.
                    </p>
                </div>
            </section>

            {/* FORM */}
            <section className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
                <form
                    onSubmit={handleSubmit}
                    className="grid gap-12 lg:grid-cols-[1fr_320px]"
                >
                    {/* LEFT */}
                    <div className="space-y-10">
                        {/* BASIC INFORMATION */}
                        <div>
                            <div className="mb-7">
                                <p className="text-[9px] uppercase tracking-[0.25em] text-[#A48654]">
                                    01
                                </p>

                                <h2 className="mt-2 text-2xl font-light">
                                    Product information
                                </h2>
                            </div>

                            <div className="space-y-6">
                                <Field label="Product name">
                                    <input
                                        value={name}
                                        onChange={(event) =>
                                            setName(event.target.value)
                                        }
                                        required
                                        placeholder="e.g. Oslo Lounge Chair"
                                        className={inputClass}
                                    />
                                </Field>

                                <Field label="Description">
                  <textarea
                      value={description}
                      onChange={(event) =>
                          setDescription(
                              event.target.value
                          )
                      }
                      rows={6}
                      placeholder="Describe the piece, its form and character..."
                      className={`${inputClass} resize-none`}
                  />
                                </Field>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <Field label="Category">
                                        <input
                                            value={category}
                                            onChange={(event) =>
                                                setCategory(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Living"
                                            className={inputClass}
                                        />
                                    </Field>

                                    <Field label="Material">
                                        <input
                                            value={material}
                                            onChange={(event) =>
                                                setMaterial(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Natural Oak · Bouclé"
                                            className={inputClass}
                                        />
                                    </Field>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-black/10" />

                        {/* COMMERCE */}
                        <div>
                            <div className="mb-7">
                                <p className="text-[9px] uppercase tracking-[0.25em] text-[#A48654]">
                                    02
                                </p>

                                <h2 className="mt-2 text-2xl font-light">
                                    Commerce
                                </h2>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <Field label="Price · EUR">
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={price}
                                        onChange={(event) =>
                                            setPrice(event.target.value)
                                        }
                                        required
                                        placeholder="890.00"
                                        className={inputClass}
                                    />
                                </Field>

                                <Field label="Stock">
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={stock}
                                        onChange={(event) =>
                                            setStock(event.target.value)
                                        }
                                        required
                                        className={inputClass}
                                    />
                                </Field>
                            </div>
                        </div>

                        <div className="h-px bg-black/10" />

                        {/* MEDIA */}
                        <div>
                            <div className="mb-7">
                                <p className="text-[9px] uppercase tracking-[0.25em] text-[#A48654]">
                                    03
                                </p>

                                <h2 className="mt-2 text-2xl font-light">
                                    Media
                                </h2>
                            </div>

                            <Field label="Image URL">
                                <input
                                    type="url"
                                    value={imageUrl}
                                    onChange={(event) =>
                                        setImageUrl(event.target.value)
                                    }
                                    placeholder="https://..."
                                    className={inputClass}
                                />
                            </Field>

                            {imageUrl && (
                                <div className="mt-6 overflow-hidden bg-[#E8E1D5]">
                                    <img
                                        src={imageUrl}
                                        alt="Product preview"
                                        className="aspect-[4/3] w-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <aside>
                        <div className="sticky top-8 border border-black/10 bg-[#EEE8DD] p-7">
                            <p className="text-[9px] uppercase tracking-[0.25em] text-[#A48654]">
                                Publishing
                            </p>

                            <div className="mt-7 space-y-6">
                                <Toggle
                                    label="Active"
                                    description="Show this product in the NØRVA store."
                                    checked={active}
                                    onChange={setActive}
                                />

                                <div className="h-px bg-black/10" />

                                <Toggle
                                    label="Featured"
                                    description="Highlight this piece in featured collections."
                                    checked={featured}
                                    onChange={setFeatured}
                                />
                            </div>

                            {errorMessage && (
                                <div className="mt-7 border border-[#A45B4B]/20 bg-[#A45B4B]/5 p-4">
                                    <p className="text-xs leading-5 text-[#8B493D]">
                                        {errorMessage}
                                    </p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={saving}
                                className="mt-8 w-full bg-[#181714] px-6 py-4 text-[9px] uppercase tracking-[0.22em] text-[#F8F5EF] transition hover:bg-[#A48654] disabled:cursor-wait disabled:opacity-50"
                            >
                                {saving
                                    ? "Saving..."
                                    : active
                                        ? "Publish product"
                                        : "Save draft"}
                            </button>

                            <Link
                                href="/admin/norva/products"
                                className="mt-4 block w-full border border-black/15 px-6 py-4 text-center text-[9px] uppercase tracking-[0.22em] text-black/45 transition hover:border-black/40 hover:text-black"
                            >
                                Cancel
                            </Link>

                            <div className="mt-7 border-t border-black/10 pt-6">
                                <p className="text-[8px] uppercase tracking-[0.18em] text-black/25">
                                    Product slug
                                </p>

                                <p className="mt-2 break-all text-[10px] text-black/45">
                                    {name
                                        ? createSlug(name)
                                        : "generated-from-product-name"}
                                </p>
                            </div>
                        </div>
                    </aside>
                </form>
            </section>

            <footer className="border-t border-black/10 px-6 py-8 md:px-10">
                <div className="mx-auto flex max-w-5xl justify-between text-[8px] uppercase tracking-[0.2em] text-black/25">
                    <span>NØRVA · Copenhagen · 2026</span>
                    <span>Product administration</span>
                </div>
            </footer>
        </main>
    );
}

const inputClass =
    "w-full border border-black/10 bg-[#F8F5EF] px-5 py-4 text-sm font-light text-[#181714] outline-none transition placeholder:text-black/20 focus:border-[#A48654]";

function Field({
                   label,
                   children,
               }: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <label className="block">
      <span className="mb-2 block text-[8px] uppercase tracking-[0.2em] text-black/35">
        {label}
      </span>

            {children}
        </label>
    );
}

function Toggle({
                    label,
                    description,
                    checked,
                    onChange,
                }: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <label className="flex cursor-pointer items-start justify-between gap-5">
            <div>
                <p className="text-xs font-medium">
                    {label}
                </p>

                <p className="mt-2 text-[10px] leading-5 text-black/35">
                    {description}
                </p>
            </div>

            <input
                type="checkbox"
                checked={checked}
                onChange={(event) =>
                    onChange(event.target.checked)
                }
                className="mt-1 h-4 w-4 accent-[#A48654]"
            />
        </label>
    );
}