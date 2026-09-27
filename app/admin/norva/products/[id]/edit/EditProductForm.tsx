"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

export default function EditProductForm({
                                            product,
                                        }: {
    product: Product;
}) {
    const router = useRouter();

    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(
        product.description ?? ""
    );
    const [price, setPrice] = useState(String(product.price));
    const [category, setCategory] = useState(
        product.category ?? ""
    );
    const [material, setMaterial] = useState(
        product.material ?? ""
    );
    const [imageUrl, setImageUrl] = useState(
        product.image_url ?? ""
    );
    const [stock, setStock] = useState(String(product.stock));
    const [featured, setFeatured] = useState(product.featured);
    const [active, setActive] = useState(product.active);

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setSaving(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const response = await fetch(
                `/api/norva/admin/products/${product.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: name.trim(),
                        description: description.trim(),
                        price: Number(price),
                        category: category.trim(),
                        material: material.trim(),
                        image_url: imageUrl.trim(),
                        stock: Number(stock),
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
                    result.error || "Could not update product."
                );
            }

            setSuccessMessage("Product updated successfully.");
            router.refresh();
        } catch (error) {
            console.error("NØRVA product update error:", error);

            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Could not update product."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        const confirmed = window.confirm(
            `Delete "${product.name}"?\n\nThis action cannot be undone.`
        );

        if (!confirmed) return;

        setDeleting(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const response = await fetch(
                `/api/norva/admin/products/${product.id}`,
                {
                    method: "DELETE",
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
                    result.error || "Could not delete product."
                );
            }

            router.push("/admin/norva/products");
            router.refresh();
        } catch (error) {
            console.error("NØRVA product delete error:", error);

            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Could not delete product."
            );

            setDeleting(false);
        }
    }

    return (
        <section className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
            <form
                onSubmit={handleSubmit}
                className="grid gap-12 lg:grid-cols-[1fr_320px]"
            >
                {/* LEFT */}
                <div className="space-y-10">
                    <div>
                        <SectionHeader number="01" title="Product information" />

                        <div className="space-y-6">
                            <Field label="Product name">
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className={inputClass}
                                />
                            </Field>

                            <Field label="Description">
                <textarea
                    value={description}
                    onChange={(e) =>
                        setDescription(e.target.value)
                    }
                    rows={6}
                    className={`${inputClass} resize-none`}
                />
                            </Field>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <Field label="Category">
                                    <input
                                        value={category}
                                        onChange={(e) =>
                                            setCategory(e.target.value)
                                        }
                                        className={inputClass}
                                    />
                                </Field>

                                <Field label="Material">
                                    <input
                                        value={material}
                                        onChange={(e) =>
                                            setMaterial(e.target.value)
                                        }
                                        className={inputClass}
                                    />
                                </Field>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-black/10" />

                    <div>
                        <SectionHeader number="02" title="Commerce" />

                        <div className="grid gap-6 sm:grid-cols-2">
                            <Field label="Price · EUR">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                    className={inputClass}
                                />
                            </Field>

                            <Field label="Stock">
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    required
                                    className={inputClass}
                                />
                            </Field>
                        </div>
                    </div>

                    <div className="h-px bg-black/10" />

                    <div>
                        <SectionHeader number="03" title="Media" />

                        <Field label="Image URL">
                            <input
                                type="url"
                                value={imageUrl}
                                onChange={(e) =>
                                    setImageUrl(e.target.value)
                                }
                                placeholder="https://..."
                                className={inputClass}
                            />
                        </Field>

                        {imageUrl && (
                            <div className="mt-6 overflow-hidden bg-[#E8E1D5]">
                                <img
                                    src={imageUrl}
                                    alt={name || "Product preview"}
                                    className="aspect-[4/3] w-full object-cover"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* SIDEBAR */}
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

                        {successMessage && (
                            <div className="mt-7 border border-[#74805C]/25 bg-[#74805C]/5 p-4">
                                <p className="text-xs leading-5 text-[#5F694B]">
                                    {successMessage}
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={saving || deleting}
                            className="mt-8 w-full bg-[#181714] px-6 py-4 text-[9px] uppercase tracking-[0.22em] text-[#F8F5EF] transition hover:bg-[#A48654] disabled:cursor-wait disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save changes"}
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
                                {product.slug}
                            </p>
                        </div>

                        {/* DANGER ZONE */}
                        <div className="mt-7 border-t border-black/10 pt-7">
                            <p className="text-[8px] uppercase tracking-[0.2em] text-[#A45B4B]">
                                Danger zone
                            </p>

                            <p className="mt-3 text-[10px] leading-5 text-black/35">
                                Permanently remove this product from the
                                NØRVA catalogue.
                            </p>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={saving || deleting}
                                className="mt-5 w-full border border-[#A45B4B]/30 px-5 py-4 text-[8px] uppercase tracking-[0.2em] text-[#A45B4B] transition hover:bg-[#A45B4B] hover:text-white disabled:opacity-40"
                            >
                                {deleting
                                    ? "Deleting..."
                                    : "Delete product"}
                            </button>
                        </div>
                    </div>
                </aside>
            </form>
        </section>
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

function SectionHeader({
                           number,
                           title,
                       }: {
    number: string;
    title: string;
}) {
    return (
        <div className="mb-7">
            <p className="text-[9px] uppercase tracking-[0.25em] text-[#A48654]">
                {number}
            </p>

            <h2 className="mt-2 text-2xl font-light">
                {title}
            </h2>
        </div>
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
                <p className="text-xs font-medium">{label}</p>

                <p className="mt-2 text-[10px] leading-5 text-black/35">
                    {description}
                </p>
            </div>

            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[#A48654]"
            />
        </label>
    );
}