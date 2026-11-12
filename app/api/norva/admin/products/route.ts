import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { adminGuard } from "@/lib/auth/admin";

export async function POST(request: Request) {
    try {
        // 1. Verify that the request comes from an authenticated user
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

        // 2. Read product data
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

        // 3. Validate product name
        const cleanName =
            typeof name === "string" ? name.trim() : "";

        if (!cleanName) {
            return NextResponse.json(
                { error: "Product name is required." },
                { status: 400 }
            );
        }

        // 4. Validate price
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

        // 5. Validate stock
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

        // 6. Generate slug server-side
        const slug = cleanName
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        if (!slug) {
            return NextResponse.json(
                { error: "Could not generate product slug." },
                { status: 400 }
            );
        }

        // 7. Use service-role client ONLY on the server
        const supabaseAdmin = createAdminClient();

        const { data, error } = await supabaseAdmin
            .from("norva_products")
            .insert({
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
            .select()
            .single();

        if (error) {
            console.error(
                "NØRVA admin product insert error:",
                error
            );

            if (error.code === "23505") {
                return NextResponse.json(
                    {
                        error:
                            "A product with this name or slug already exists.",
                    },
                    { status: 409 }
                );
            }

            return NextResponse.json(
                { error: "Could not create product." },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                product: data,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(
            "NØRVA admin products API error:",
            error
        );

        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}