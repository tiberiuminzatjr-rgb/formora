import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { adminGuard } from "@/lib/auth/admin";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

function createSlug(value: string) {
    return value
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/* =========================================================
   PATCH — UPDATE PRODUCT
========================================================= */

export async function PATCH(
    request: Request,
    context: RouteContext
) {
    try {
        // Verify authentication
        const supabaseAuth = await createClient();

        const {
            data: { user },
            error: authError,
        } = await supabaseAuth.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized." },
                { status: 401 }
            );
        }

        // Only Formora admins may manage NØRVA data (service-role bypasses RLS).
        const forbidden = await adminGuard();
        if (forbidden) return forbidden;

        const { id } = await context.params;

        if (!id) {
            return NextResponse.json(
                { error: "Missing product ID." },
                { status: 400 }
            );
        }

        const body = await request.json();

        const {
            name,
            description,
            price,
            category,
            material,
            image_url,
            stock,
            featured,
            active,
        } = body;

        /* -------------------------
           VALIDATION
        ------------------------- */

        const cleanName =
            typeof name === "string" ? name.trim() : "";

        if (!cleanName) {
            return NextResponse.json(
                { error: "Product name is required." },
                { status: 400 }
            );
        }

        const numericPrice = Number(price);

        if (
            !Number.isFinite(numericPrice) ||
            numericPrice < 0
        ) {
            return NextResponse.json(
                { error: "Invalid product price." },
                { status: 400 }
            );
        }

        const numericStock = Number(stock);

        if (
            !Number.isInteger(numericStock) ||
            numericStock < 0
        ) {
            return NextResponse.json(
                { error: "Invalid product stock." },
                { status: 400 }
            );
        }

        const slug = createSlug(cleanName);

        if (!slug) {
            return NextResponse.json(
                { error: "Could not generate product slug." },
                { status: 400 }
            );
        }

        /* -------------------------
           UPDATE
        ------------------------- */

        const supabaseAdmin = createAdminClient();

        const { data: product, error } =
            await supabaseAdmin
                .from("norva_products")
                .update({
                    name: cleanName,
                    slug,

                    description:
                        typeof description === "string" &&
                        description.trim()
                            ? description.trim()
                            : null,

                    price: numericPrice,

                    category:
                        typeof category === "string" &&
                        category.trim()
                            ? category.trim()
                            : null,

                    material:
                        typeof material === "string" &&
                        material.trim()
                            ? material.trim()
                            : null,

                    image_url:
                        typeof image_url === "string" &&
                        image_url.trim()
                            ? image_url.trim()
                            : null,

                    stock: numericStock,
                    featured: Boolean(featured),
                    active: Boolean(active),
                })
                .eq("id", id)
                .select()
                .single();

        if (error || !product) {
            console.error(
                "NØRVA product update error:",
                error
            );

            if (error?.code === "23505") {
                return NextResponse.json(
                    {
                        error:
                            "Another product already uses this name or slug.",
                    },
                    { status: 409 }
                );
            }

            return NextResponse.json(
                { error: "Could not update product." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            product,
        });
    } catch (error) {
        console.error(
            "NØRVA PATCH product error:",
            error
        );

        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}

/* =========================================================
   DELETE — DELETE PRODUCT
========================================================= */

export async function DELETE(
    _request: Request,
    context: RouteContext
) {
    try {
        // Verify authentication
        const supabaseAuth = await createClient();

        const {
            data: { user },
            error: authError,
        } = await supabaseAuth.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized." },
                { status: 401 }
            );
        }

        // Only Formora admins may manage NØRVA data (service-role bypasses RLS).
        const forbidden = await adminGuard();
        if (forbidden) return forbidden;

        const { id } = await context.params;

        if (!id) {
            return NextResponse.json(
                { error: "Missing product ID." },
                { status: 400 }
            );
        }

        const supabaseAdmin = createAdminClient();

        // Make sure the product exists
        const { data: existingProduct } =
            await supabaseAdmin
                .from("norva_products")
                .select("id, name")
                .eq("id", id)
                .maybeSingle();

        if (!existingProduct) {
            return NextResponse.json(
                { error: "Product not found." },
                { status: 404 }
            );
        }

        // Delete product
        const { error } = await supabaseAdmin
            .from("norva_products")
            .delete()
            .eq("id", id);

        if (error) {
            console.error(
                "NØRVA product delete error:",
                error
            );

            return NextResponse.json(
                {
                    error:
                        "Could not delete product. It may be referenced by an existing order.",
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            deletedProduct: {
                id: existingProduct.id,
                name: existingProduct.name,
            },
        });
    } catch (error) {
        console.error(
            "NØRVA DELETE product error:",
            error
        );

        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}