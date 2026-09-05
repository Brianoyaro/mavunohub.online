/**
 * Generate XML sitemaps for the furniture application.
 *
 * Generates:
 *
 * public/
 * ├── sitemap.xml
 * ├── sitemap-products.xml
 * └── sitemap-categories.xml
 *
 * The script queries Sequelize directly, so product URLs are always
 * generated from the current database contents.
 */

require("dotenv").config();

const fs = require("fs");
const path = require("path");

const { Product, sequelize } = require("../models");

// ---------------------------------------------------------
// Configuration
// ---------------------------------------------------------

const SITE_URL = (
    process.env.FRONTEND_URL ||
    process.env.SITE_URL ||
    "http://localhost:5173"
).replace(/\/+$/, "");

const OUTPUT_DIR = path.resolve(
    __dirname,
    "../public"
);

const PRODUCT_SITEMAP_FILE = path.join(
    OUTPUT_DIR,
    "sitemap-products.xml"
);

const CATEGORY_SITEMAP_FILE = path.join(
    OUTPUT_DIR,
    "sitemap-categories.xml"
);

const SITEMAP_INDEX_FILE = path.join(
    OUTPUT_DIR,
    "sitemap.xml"
);

// ---------------------------------------------------------
// XML helpers
// ---------------------------------------------------------

const escapeXml = (value) => {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
};

const formatDate = (date) => {
    if (!date) {
        return new Date().toISOString().split("T")[0];
    }

    return new Date(date).toISOString().split("T")[0];
};

const createUrlEntry = ({
    loc,
    lastmod,
    changefreq = "weekly",
    priority = "0.5",
}) => {
    return `  <url>
    <loc>${escapeXml(loc)}</loc>
    ${lastmod ? `<lastmod>${formatDate(lastmod)}</lastmod>` : ""}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
};

const createUrlSet = (urls) => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${urls.join("\n")}
</urlset>
`;
};

const createSitemapIndex = (sitemaps) => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${sitemaps
    .map(
        ({ loc, lastmod }) => `  <sitemap>
    <loc>${escapeXml(loc)}</loc>
    ${
        lastmod
            ? `<lastmod>${formatDate(lastmod)}</lastmod>`
            : ""
    }
  </sitemap>`
    )
    .join("\n")}
</sitemapindex>
`;
};

// ---------------------------------------------------------
// Ensure output directory exists
// ---------------------------------------------------------

const ensureOutputDirectory = () => {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, {
            recursive: true,
        });
    }
};

// ---------------------------------------------------------
// Generate static/application URLs
// ---------------------------------------------------------

const generateStaticUrls = () => {
    return [
        createUrlEntry({
            loc: `${SITE_URL}/`,
            changefreq: "daily",
            priority: "1.0",
        }),
    ];
};

// ---------------------------------------------------------
// Generate product URLs
// ---------------------------------------------------------

const generateProductSitemap = async () => {
    const products = await Product.findAll({
        attributes: [
            "id",
            "name",
            "updatedAt",
            "createdAt",
        ],
        order: [["id", "ASC"]],
        raw: true,
    });

    const urls = [
        ...generateStaticUrls(),
        ...products.map((product) =>
            createUrlEntry({
                loc: `${SITE_URL}/products/${product.id}`,
                lastmod:
                    product.updatedAt ||
                    product.createdAt,
                changefreq: "weekly",
                priority: "0.8",
            })
        ),
    ];

    const xml = createUrlSet(urls);

    fs.writeFileSync(
        PRODUCT_SITEMAP_FILE,
        xml,
        "utf8"
    );

    console.log(
        `✓ Generated product sitemap: ${products.length} products`
    );

    return products;
};

// ---------------------------------------------------------
// Generate category/filter URLs dynamically
// ---------------------------------------------------------

const generateCategorySitemap = async () => {
    /**
     * We intentionally query the database instead of importing
     * the enum definitions.
     *
     * This means the sitemap continues working if your enums
     * change later.
     */

    const [categories, types, materials] =
        await Promise.all([
            Product.findAll({
                attributes: ["category"],
                group: ["category"],
                raw: true,
            }),

            Product.findAll({
                attributes: ["type"],
                group: ["type"],
                raw: true,
            }),

            Product.findAll({
                attributes: ["material"],
                group: ["material"],
                raw: true,
            }),
        ]);

    const urls = [];

    // -----------------------------------------------------
    // Category URLs
    // -----------------------------------------------------

    categories
        .map((item) => item.category)
        .filter(Boolean)
        .forEach((category) => {
            urls.push(
                createUrlEntry({
                    loc: `${SITE_URL}/products?category=${encodeURIComponent(
                        category
                    )}`,
                    changefreq: "weekly",
                    priority: "0.6",
                })
            );
        });

    // -----------------------------------------------------
    // Type URLs
    // -----------------------------------------------------

    types
        .map((item) => item.type)
        .filter(Boolean)
        .forEach((type) => {
            urls.push(
                createUrlEntry({
                    loc: `${SITE_URL}/products?type=${encodeURIComponent(
                        type
                    )}`,
                    changefreq: "weekly",
                    priority: "0.6",
                })
            );
        });

    // -----------------------------------------------------
    // Material URLs
    // -----------------------------------------------------

    materials
        .map((item) => item.material)
        .filter(Boolean)
        .forEach((material) => {
            urls.push(
                createUrlEntry({
                    loc: `${SITE_URL}/products?material=${encodeURIComponent(
                        material
                    )}`,
                    changefreq: "weekly",
                    priority: "0.5",
                })
            );
        });

    const xml = createUrlSet(urls);

    fs.writeFileSync(
        CATEGORY_SITEMAP_FILE,
        xml,
        "utf8"
    );

    console.log(
        `✓ Generated category sitemap: ${urls.length} URLs`
    );
};

// ---------------------------------------------------------
// Generate sitemap index
// ---------------------------------------------------------

const generateSitemapIndex = () => {
    const now = new Date();

    const xml = createSitemapIndex([
        {
            loc: `${SITE_URL}/sitemap-products.xml`,
            lastmod: now,
        },
        {
            loc: `${SITE_URL}/sitemap-categories.xml`,
            lastmod: now,
        },
    ]);

    fs.writeFileSync(
        SITEMAP_INDEX_FILE,
        xml,
        "utf8"
    );

    console.log("✓ Generated sitemap index");
};

// ---------------------------------------------------------
// Main
// ---------------------------------------------------------

const generateSitemaps = async () => {
    console.log("\n----------------------------------------");
    console.log("Generating application sitemaps");
    console.log("----------------------------------------");
    console.log(`Site: ${SITE_URL}`);
    console.log(`Output: ${OUTPUT_DIR}`);
    console.log("----------------------------------------\n");

    try {
        ensureOutputDirectory();

        await sequelize.authenticate();

        console.log("✓ Database connection established");

        await generateProductSitemap();

        await generateCategorySitemap();

        generateSitemapIndex();

        console.log(
            "\n✓ Sitemap generation completed successfully.\n"
        );
    } catch (error) {
        console.error(
            "\n✗ Failed to generate sitemaps:"
        );

        console.error(error);

        process.exitCode = 1;
    } finally {
        await sequelize.close();
    }
};

generateSitemaps();