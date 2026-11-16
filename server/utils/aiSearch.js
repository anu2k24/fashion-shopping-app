/**
 * AI Search Utility for Natural Language Product Queries
 * Handles normalization, fuzzy typo correction, filter extraction,
 * and product filtering with fallback logic.
 */

const fs = require('fs');
const path = require('path');
const Fuse = require("fuse.js");
// ─── CONFIGURATION ──────────────────────────────────────────────────────────

const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');
let PRODUCT_CACHE = null;

function readProducts() {
    if (PRODUCT_CACHE) return PRODUCT_CACHE;

    if (!fs.existsSync(productsFilePath)) return [];

    try {
        const data = fs.readFileSync(productsFilePath, 'utf-8');
        PRODUCT_CACHE = JSON.parse(data || '[]');
        return PRODUCT_CACHE;
    } catch (err) {
        console.error('Error reading products:', err);
        return [];
    }
}
// Price keywords mapping
const PRICE_KEYWORDS = {
    below: '<=',
    under: '<=',
    above: '>=',
    over: '>=',
    between: 'between',
    'under or equal': '<=',
    'below or equal': '<=',
    'above or equal': '>=',
    'over or equal': '>=',
};

// Expanded search keywords for normalization & typo correction
const SEARCH_KEYWORDS = {
    // Genders
    women: ['women', 'woman', 'ladies', 'female', 'girls', 'girl', 'womens'],
    men: ['men', 'man', 'mens', 'male', 'boys', 'boy', 'mens'],
    kids: ['kids', 'kid', 'children', 'child', 'baby', 'babies'],

    // Clothing types
    lehenga: ['lehenga', 'lehanga', 'lehengha'],
    saree: ['saree', 'sari', 'sare'],
    kurta: ['kurta', 'kurtha', 'kurtah'],
    kurti: ['kurti', 'kurthi', 'kurtah'],
    churidar: ['churidar', 'churedar', 'churidhar', 'churidhar'],
    jeans: ['jeans', 'jean', 'jins', 'jens'],
    shirt: ['shirt', 'shirts', 'shrt', 'shrit', 'sirt'],
    tshirt: ['t-shirt', 't-shirts', 't shirt', 't shirts', 'tshirt', 'tshirts', 't shrit', 't-shrit', 'tee', 'tees'],
    jacket: ['jacket', 'jackets', 'jakit', 'jaket'],
    trousers: ['trouser', 'trousers', 'trowser', 'trowsers'],
    leggings: ['legging', 'leggings', 'legeng', 'leging'],
    dress: ['dress', 'dresses', 'gown', 'gowns', 'frock', 'frocks'],
    top: ['top', 'tops'],
    pant: ['pant', 'pants'],
    bodysuit: ['bodysuit', 'body suit', 'bodysuits'],

    // Jewellery types
    ring: ['ring', 'rings', 'rng'],
    bangle: ['bangle', 'bangles', 'bangl'],
    earring: ['earring', 'earrings', 'earing', 'earings'],
    necklace: ['necklace', 'necklaces', 'neckless', 'necklesses'],
    bracelet: ['bracelet', 'bracelets', 'braclet', 'braclets'],

    // Materials
    gold: ['gold', 'golden', 'gld'],
    silver: ['silver', 'silvr', 'slvr'],
    diamond: ['diamond', 'diamonds', 'dimond', 'dimonds'],

    // Category synonyms
    jewellery: ['jewellery', 'jewelry', 'ornament', 'ornaments', 'jewelery'],
    clothing: ['clothing', 'clothes', 'cloths', 'apparel', 'wear', 'garments'],
};

// Jewellery product types
const JEWELLERY_TYPES = new Set(['ring', 'bangle', 'earring', 'necklace', 'bracelet']);

// All valid product types for validation
const VALID_PRODUCT_TYPES = new Set([
    'tshirt', 'shirt', 'jeans', 'kurta', 'saree', 'lehenga',
    'kurti', 'churidar', 'jacket', 'trousers', 'leggings',
    'dress', 'top', 'pant', 'bodysuit',
    'ring', 'bangle', 'earring', 'necklace', 'bracelet'
]);

// ─── HELPER FUNCTIONS ───────────────────────────────────────────────────────

function readProducts() {
    if (!fs.existsSync(productsFilePath)) return [];
    try {
        const data = fs.readFileSync(productsFilePath, 'utf-8');
        return JSON.parse(data || '[]');
    } catch (err) {
        console.error('Error reading products:', err);
        return [];
    }
}

/**
 * Normalize a query string:
 * - Lowercase
 * - Remove extra spaces
 * - Fix common typos by replacing with canonical terms
 * - Unify price expressions
 */
function normalizeQuery(query) {
    let normalized = query.toLowerCase().trim().replace(/\s+/g, ' ');

    // Normalize price expressions first (e.g., "under" → "below")
    normalized = normalized.replace(/\bunder\b/g, 'below');
    normalized = normalized.replace(/\bover\b/g, 'above');

    // Fix typos by replacing known variants with canonical terms
    // We iterate through SEARCH_KEYWORDS and replace all variants with the canonical key
    for (const [canonical, variants] of Object.entries(SEARCH_KEYWORDS)) {
        for (const variant of variants) {
            // Use word boundary for single words, but be careful with hyphenated
            const escaped = variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escaped}\\b`, 'g');
            normalized = normalized.replace(regex, canonical);
        }
    }

    return normalized;
}

/**
 * Calculate Levenshtein distance for fuzzy matching fallback
 */
function levenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            matrix[i][j] = b.charAt(i - 1) === a.charAt(j - 1)
                ? matrix[i - 1][j - 1]
                : Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
        }
    }
    return matrix[b.length][a.length];
}

/**
 * Fuzzy match a word against a set of valid options
 */
function fuzzyMatch(word, options, maxDistance = 2) {
    let best = null;
    let bestScore = Infinity;
    for (const opt of options) {
        const dist = levenshtein(word, opt);
        if (dist < bestScore && dist <= maxDistance) {
            bestScore = dist;
            best = opt;
        }
    }
    return best;
}

// ─── FILTER EXTRACTION ──────────────────────────────────────────────────────

/**
 * Extract structured filters from normalized query using regex + keyword matching.
 * This is the fallback parser that works without any external AI API.
 */
function extractFiltersFallback(query) {
    const filters = {
        gender: null,
        productType: null,
        category: null,
        price: {
            operator: null,
            value: null,
            min: null,
            max: null,
        },
        material: null,
    };

    // ── Gender ──
    if (/\b(men|man|male|boys)\b/.test(query)) filters.gender = 'Men';
    else if (/\b(women|woman|ladies|female|girls)\b/.test(query)) filters.gender = 'Women';
    else if (/\b(kids|kid|children|child|baby|babies)\b/.test(query)) filters.gender = 'Kids';

    // ── Product Type ──
    // Check for jewellery types first
    const jewelleryMatches = ['ring', 'bangle', 'earring', 'necklace', 'bracelet'].filter(t =>
        new RegExp(`\\b${t}s?\\b`).test(query)
    );
    if (jewelleryMatches.length > 0) {
        filters.productType = jewelleryMatches[0];
        filters.category = 'jewellery';
    }

    // Check clothing types
    const clothingMatches = [
        'tshirt', 'shirt', 'jeans', 'kurta', 'saree', 'lehenga',
        'kurti', 'churidar', 'jacket', 'trousers', 'leggings',
        'dress', 'top', 'pant', 'bodysuit'
    ].filter(t => new RegExp(`\\b${t}s?\\b`).test(query));

    if (clothingMatches.length > 0) {
        filters.productType = clothingMatches[0];
        if (!filters.category) filters.category = 'clothing';
    }

    // ── Material ──
    if (/\bgold(en)?\b/.test(query)) filters.material = 'Gold';
    else if (/\bsilver\b/.test(query)) filters.material = 'Silver';
    else if (/\bdiamond\b/.test(query)) filters.material = 'Diamond';

    // ── Price ──
    // Patterns:
    // "below 3000", "under 3000", "above 2000", "over 2000"
    // ">2000", "<= 5000"
    // "1000-3000", "1000 to 3000", "between 1000 and 3000"

    // Range pattern: "1000-3000" or "1000 to 3000" or "between 1000 and 3000"
    const rangeMatch = query.match(/(\d+)\s*(?:-|to|and)\s*(\d+)/);
    const betweenMatch = query.match(/between\s+(\d+)\s+and\s+(\d+)/);

    if (betweenMatch) {
        filters.price.operator = 'between';
        filters.price.min = parseInt(betweenMatch[1], 10);
        filters.price.max = parseInt(betweenMatch[2], 10);
    } else if (rangeMatch) {
        filters.price.operator = 'between';
        filters.price.min = parseInt(rangeMatch[1], 10);
        filters.price.max = parseInt(rangeMatch[2], 10);
    } else {
        // Single value patterns
        const belowMatch = query.match(/(?:below|under)\s+(\d+)/);
        const aboveMatch = query.match(/(?:above|over)\s+(\d+)/);
        const lteMatch = query.match(/<=?\s*(\d+)/);
        const gteMatch = query.match(/>=?\s*(\d+)/);
        const gtMatch = query.match(/>\s*(\d+)/);
        const ltMatch = query.match(/<\s*(\d+)/);
        const eqMatch = query.match(/=\s*(\d+)/);
        const plainNumber = query.match(/\b(\d{3,5})\b/); // 3-5 digit numbers likely prices

        if (belowMatch) {
            filters.price.operator = '<=';
            filters.price.value = parseInt(belowMatch[1], 10);
        } else if (aboveMatch) {
            filters.price.operator = '>=';
            filters.price.value = parseInt(aboveMatch[1], 10);
        } else if (lteMatch) {
            filters.price.operator = '<=';
            filters.price.value = parseInt(lteMatch[1], 10);
        } else if (gteMatch) {
            filters.price.operator = '>=';
            filters.price.value = parseInt(gteMatch[1], 10);
        } else if (ltMatch) {
            filters.price.operator = '<';
            filters.price.value = parseInt(ltMatch[1], 10);
        } else if (gtMatch) {
            filters.price.operator = '>';
            filters.price.value = parseInt(gtMatch[1], 10);
        } else if (eqMatch) {
            filters.price.operator = '=';
            filters.price.value = parseInt(eqMatch[1], 10);
        } else if (plainNumber) {
            // If no explicit operator but number present, treat as <=
            filters.price.operator = '<=';
            filters.price.value = parseInt(plainNumber[1], 10);
        }
    }

    // ── Category inference from productType ──
    if (filters.productType && !filters.category) {
        if (JEWELLERY_TYPES.has(filters.productType)) {
            filters.category = 'jewellery';
        } else {
            filters.category = 'clothing';
        }
    }

    // ── Jewellery special case: if category is jewellery but no gender, set to Jewellery ──
    if (filters.category === 'jewellery' && !filters.gender) {
        filters.gender = 'Jewellery';
    }

    return filters;
}

// ─── GEMINI AI PARSER (OPTIONAL) ────────────────────────────────────────────

/**
 * Attempt to parse query using Gemini API.
 * Falls back to null if API key is missing or request fails.
 */
async function tryGeminiParse(query, apiKey) {
    if (!apiKey) return null;

    const prompt = `
You are a product search parser for an e-commerce fashion website.
Extract structured filters from the user's natural language query.

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "gender": "Men | Women | Kids | Jewellery | null",
  "productType": "tshirt | shirt | jeans | kurta | saree | lehenga | earring | necklace | bracelet | ring | bangle | dress | top | jacket | trousers | leggings | pant | bodysuit | null",
  "category": "clothing | jewellery | null",
  "price": {
    "operator": "< | <= | > | >= | between | null",
    "value": number | null,
    "min": number | null,
    "max": number | null
  },
  "material": "Gold | Silver | Diamond | null"
}

Rules:
- If productType is earring, necklace, bracelet, ring, or bangle → category must be "jewellery"
- Otherwise category is "clothing"
- For jewellery items without explicit gender, use "Jewellery"
- "below X" or "under X" → operator "<=", value X
- "above X" or "over X" → operator ">=", value X
- "X-Y" or "between X and Y" → operator "between", min X, max Y
- For price like "under 1000" → value is 1000, operator is "<="

User query: "${query}"
`;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: 'application/json' },
                }),
            }
        );

        if (!response.ok) {
            console.warn('Gemini API error:', response.status, await response.text());
            return null;
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) return null;

        const parsed = JSON.parse(text);
        return sanitizeFilters(parsed);
    } catch (err) {
        console.warn('Gemini parse failed, using fallback:', err.message);
        return null;
    }
}

/**
 * Sanitize and normalize filters returned from AI
 */
function sanitizeFilters(filters) {
    const result = {
        gender: filters.gender || null,
        productType: filters.productType || null,
        category: filters.category || null,
        price: {
            operator: filters.price?.operator || null,
            value: filters.price?.value || null,
            min: filters.price?.min || null,
            max: filters.price?.max || null,
        },
        material: filters.material || null,
    };

    // Normalize gender capitalization
    if (result.gender) {
        const g = result.gender.toLowerCase();
        if (g === 'men' || g === 'man' || g === 'male' || g === 'boys') result.gender = 'Men';
        else if (g === 'women' || g === 'woman' || g === 'ladies' || g === 'female' || g === 'girls') result.gender = 'Women';
        else if (g === 'kids' || g === 'kid' || g === 'children' || g === 'child') result.gender = 'Kids';
        else if (g === 'jewellery' || g === 'jewelry') result.gender = 'Jewellery';
    }

    // Normalize productType
    if (result.productType) {
        const pt = result.productType.toLowerCase().replace(/[-\s]/g, '');
        if (VALID_PRODUCT_TYPES.has(pt)) result.productType = pt;
        else if (pt === 'tshirt' || pt === 'tee' || pt === 'tees') result.productType = 'tshirt';
        else if (pt === 'earring' || pt === 'earings') result.productType = 'earring';
    }

    // Enforce category rules
    if (result.productType && JEWELLERY_TYPES.has(result.productType)) {
        result.category = 'jewellery';
    } else if (result.productType) {
        result.category = 'clothing';
    }

    // Jewellery default gender
    if (result.category === 'jewellery' && !result.gender) {
        result.gender = 'Jewellery';
    }

    return result;
}

// ─── PRODUCT FILTERING ──────────────────────────────────────────────────────

function matchesGender(product, gender) {
    if (!gender) return true;

    const prodGender = (product.gender || '').toLowerCase();
    const prodCategory = (product.category || '').toLowerCase();
    const prodType = (product.productType || '').toLowerCase();
    const isJewelleryProduct = JEWELLERY_TYPES.has(prodType) || prodCategory === 'jewellery' || prodType === 'jewellery';

    // If user searches for jewellery explicitly, match jewellery products
    if (gender === 'Jewellery') {
        return isJewelleryProduct || prodGender === 'jewellery';
    }

    // If the product is jewellery but user specified a gender (e.g., "women earrings"),
    // allow the match since jewellery is often unisex in catalogues
    if (isJewelleryProduct && prodGender === 'jewellery') {
        return true;
    }

    // Standard case-insensitive match
    return prodGender === gender.toLowerCase();
}

function matchesCategory(product, category) {
    if (!category) return true;
    const prodCategory = (product.category || '').toLowerCase();
    const prodType = (product.productType || '').toLowerCase();

    if (category === 'jewellery') {
        return prodCategory === 'jewellery' ||
               JEWELLERY_TYPES.has(prodType) ||
               prodType === 'jewellery';
    }
    if (category === 'clothing') {
        return prodCategory !== 'jewellery' && !JEWELLERY_TYPES.has(prodType) && prodType !== 'jewellery';
    }
    return prodCategory === category.toLowerCase();
}

function matchesProductType(product, productType) {
    if (!productType) return true;
    const pt = productType.toLowerCase();
    const prodType = (product.productType || '').toLowerCase();
    const prodCategory = (product.category || '').toLowerCase();

    // Direct match
    if (prodType === pt || prodCategory === pt) return true;

    // Plural handling
    if (prodType === pt + 's' || prodCategory === pt + 's') return true;
    if (pt.endsWith('s') && (prodType === pt.slice(0, -1) || prodCategory === pt.slice(0, -1))) return true;

    // T-shirt variations
    if (pt === 'tshirt' && (prodType.includes('t-shirt') || prodType.includes('t shirt') || prodType.includes('tee'))) return true;

    return false;
}

function matchesMaterial(product, material) {
    if (!material) return true;
    // Check in filters.material or product name
    const prodMaterial = product.filters?.material || '';
    const prodName = product.name || '';
    const mat = material.toLowerCase();
    return prodMaterial.toLowerCase().includes(mat) || prodName.toLowerCase().includes(mat);
}

function matchesPrice(product, priceFilter) {
    if (!priceFilter || !priceFilter.operator) return true;
    const price = product.price;
    if (price == null) return true;

    switch (priceFilter.operator) {
        case '<': return price < priceFilter.value;
        case '<=': return price <= priceFilter.value;
        case '>': return price > priceFilter.value;
        case '>=': return price >= priceFilter.value;
        case '=': return price === priceFilter.value;
        case 'between':
            return price >= (priceFilter.min || 0) && price <= (priceFilter.max || Infinity);
        default: return true;
    }
}

function filterProducts(products, filters) {
    return products.filter(product => {
        return matchesGender(product, filters.gender) &&
               matchesCategory(product, filters.category) &&
               matchesProductType(product, filters.productType) &&
               matchesMaterial(product, filters.material) &&
               matchesPrice(product, filters.price);
    });
}

// ─── RESPONSE FORMATTING ────────────────────────────────────────────────────

function formatResponse(filters, products) {
    const lines = ['🔍 Searching for:'];

    if (filters.gender && filters.gender !== 'Jewellery') {
        lines.push(`• ${filters.gender}`);
    }
    if (filters.productType) {
        const displayType = filters.productType.charAt(0).toUpperCase() + filters.productType.slice(1);
        lines.push(`• ${displayType}`);
    }
    if (filters.category && !filters.productType) {
        const displayCat = filters.category.charAt(0).toUpperCase() + filters.category.slice(1);
        lines.push(`• ${displayCat}`);
    }
    if (filters.material) {
        lines.push(`• Material: ${filters.material}`);
    }
    if (filters.price?.operator) {
        const { operator, value, min, max } = filters.price;
        let priceStr = '';
        if (operator === 'between' && min != null && max != null) {
            priceStr = `Price ₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
        } else if (value != null) {
            const opMap = { '<': '<', '<=': '<=', '>': '>', '>=': '>=', '=': '=' };
            priceStr = `Price ${opMap[operator] || operator} ₹${value.toLocaleString()}`;
        }
        if (priceStr) lines.push(`• ${priceStr}`);
    }

    lines.push('');

    if (products.length > 0) {
        lines.push(`✅ Found ${products.length} product${products.length > 1 ? 's' : ''}`);
    } else {
        lines.push('❌ No matching products found. Try different filters.');
    }

    return lines.join('\n');
}

// ─── MAIN EXPORT ────────────────────────────────────────────────────────────
async function processAiSearch(query, geminiApiKey,safeSort)
{
    const normalized = normalizeQuery(query);

    // Try Gemini first
    let filters = await tryGeminiParse(normalized, geminiApiKey);

    // Fallback
    if (!filters) {
        filters = extractFiltersFallback(normalized);
    }

  
const products = readProducts();
    // ✅ Step 1: Filter
    const filtered = filterProducts(products, filters);

    // ✅ Step 2: Fuse (SMART SEARCH)
    


   const cleanQuery = normalized
    .replace(/\d+/g, "")
    .replace(/\b(below|above|under|over|between|and)\b/g, "")
    .trim();

let finalResults = filtered;

// 👉 ONLY use Fuse if filter gives NO results
if (cleanQuery.length > 0 && filtered.length > 0) {

    const fuse = new Fuse(filtered, {
        keys: [
            { name: "name", weight: 0.7 },
            { name: "category", weight: 0.2 },
            { name: "productType", weight: 0.1 }
        ],
        threshold: 0.4
    });

    const fuseResults = fuse.search(cleanQuery).map(r => r.item);

    // fallback if fuse gives nothing
    if (fuseResults.length > 0) {
        finalResults = fuseResults;
    }
}
// expensive,cheapest,smart
// 🔽 SORT LOGIC (FINAL CONTROL HERE)
// 🔽 SORT LOGIC (FINAL CONTROL HERE)
const direction = safeSort === "price_high" ? -1 : 1;

finalResults.sort((a, b) => direction * ((a.price ?? 0) - (b.price ?? 0)));

    // ✅ Step 3: Response
    const message = formatResponse(filters, finalResults);

    return {
        success: true,
        filters,
        products: finalResults,
        message,
    };

}

module.exports = {
    normalizeQuery,
    extractFiltersFallback,
    tryGeminiParse,
    filterProducts,
    formatResponse,
    processAiSearch,
    readProducts,
};

