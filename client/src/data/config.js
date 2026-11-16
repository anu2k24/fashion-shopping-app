export const filterConfig = {
    women: [
        {
            id: "category",
            label: "Category",
            options: [
                "T-Shirt", "Top", "Dress", "Sweat Dress", "Jacket", "Bodysuit", "Lehenga", "Kurti", "Suit Set", "Churidar"
            ]
        },
        {
            id: "gender",
            label: "Gender Type",
            options: ["Women", "Unisex"]
        },
        {
            id: "size",
            label: "Size",
            options: ["XS", "S", "M", "L", "XL", "XXL"]
        },
        {
            id: "sleeve",
            label: "Sleeve Type",
            options: ["Half Sleeve", "Full Sleeve", "Sleeveless"]
        },
        {
            id: "neck",
            label: "Neck Type",
            options: ["Round Neck", "Polo Neck", "V-Neck"]
        },
        {
            id: "price",
            label: "Price Range",
            options: ["Under ₹999", "₹1000 – ₹1999", "₹2000+"]
        },
        {
            id: "offers",
            label: "Offers",
            options: ["Buy 1 Get 1", "Flat ₹1099", "Discounted Items"]
        }
    ],
    men: [
        {
            id: "category",
            label: "Category",
            options: [
                "T-Shirt", "Shirt", "Jeans", "Pant", "Casual Pant", "Trousers", "Jacket", "Shorts"
            ]
        },
        {
            id: "size",
            label: "Size",
            options: ["S", "M", "L", "XL", "XXL"]
        },
        {
            id: "sleeve",
            label: "Sleeve Type",
            options: ["Half Sleeve", "Full Sleeve"]
        },
        {
            id: "neck",
            label: "Neck Type",
            options: ["Round Neck", "Polo Neck"]
        },
        {
            id: "price",
            label: "Price Range",
            options: ["Under ₹1099"]
        },
        {
            id: "offers",
            label: "Offers",
            options: ["Buy 2 Offer", "Special Deals"]
        }
    ],
    kids: [
        {
            id: "category",
            label: "Category",
            options: [
                "T-Shirt", "Top", "Dress", "Shirt", "Shorts", "Pants", "Jackets"
            ]
        },
        {
            id: "age",
            label: "Age Group",
            options: ["0–2 Years", "3–5 Years", "6–8 Years", "9–12 Years"]
        },
        {
            id: "size",
            label: "Size",
            options: ["0–1", "1–2", "3–4", "5–6", "7–8", "9–10"]
        },
        {
            id: "sleeve",
            label: "Sleeve Type",
            options: ["Half Sleeve", "Full Sleeve"]
        },
        {
            id: "offers",
            label: "Offers",
            options: ["Kids Combo Offer", "Flat Discount"]
        }
    ],
    jewellery: [
        {
            id: "category",
            label: "Jewellery Type",
            options: ["Necklace", "Earrings", "Bangles", "Rings"]
        },
        {
            id: "material",
            label: "Material",
            options: ["Gold", "Silver", "Imitation", "Alloy"]
        },
        {
            id: "occasion",
            label: "Occasion",
            options: ["Daily Wear", "Party", "Wedding"]
        },
        {
            id: "price",
            label: "Price Range",
            options: ["Under ₹999", "₹1000–₹4999", "₹5000+"]
        },
        {
            id: "offers",
            label: "Offers",
            options: ["Flat Discount", "Special Jewellery Deals"]
        }
    ],
    'new-arrivals': [
        {
            id: "category",
            label: "Category",
            options: ["Women", "Men", "Kids", "Jewellery"]
        },
        {
            id: "productType",
            label: "Product Type",
            options: ["T-Shirt", "Dress", "Shirt", "Jewellery"]
        },
        {
            id: "gender",
            label: "Gender",
            options: ["Women", "Men", "Unisex"]
        },
        {
            id: "price",
            label: "Price Range",
            options: ["Under ₹999", "₹1000–₹1999", "₹2000+"]
        },
        {
            id: "arrival",
            label: "Arrival Time",
            options: ["Last 7 Days", "Last 15 Days", "Last 30 Days"]
        }
    ],
    'offers': [
        {
            id: "offerType",
            label: "Offer Type",
            options: ["Buy 1 Get 1", "Buy 2 Offer", "Flat Discount", "Special Deals"]
        },
        {
            id: "category",
            label: "Category",
            options: ["Women", "Men", "Kids", "Jewellery"]
        },
        {
            id: "discount",
            label: "Discount Percentage",
            options: ["10% – 20%", "30% – 50%", "50%+"]
        },
        {
            id: "price",
            label: "Price Range",
            options: ["Under ₹999", "₹1000–₹1999", "₹2000+"]
        }
    ]
};

export const bannerConfig = {
    women: {
        title: "Women's Collection",
        // Traditional Saree/Lehenga vibe
        image: "https://tse3.mm.bing.net/th/id/OIP.uOkRtWKwomLL5aCk4FjUZAHaDs?pid=Api&P=0&h=180",
        subtitle: "Elegance redefined for the modern woman."
    },
    men: {
        title: "Men's Collection",
        // Traditional Kurta/Sherwani vibe
        image: "https://www.achinbindlish.com/cdn/shop/articles/BLOG-BANNER-AB_10.png?v=1765800199&width=1920",
        subtitle: "Sharp styles for every occasion."
    },
    kids: {
        title: "Kids' Collection",
        // Cute/Traditional Kids vibe
        image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=2600",
        subtitle: "Comfort and fun for your little ones."
    },
    jewellery: {
        title: "Exquisite Jewellery",
        // High-end Jewellery vibe
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2600",
        subtitle: "Sparkle with elegance."
    },
    'new-arrivals': {
        title: "New Arrivals",
        image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2600",
        subtitle: "Discover the latest trends just landed."
    },
    offers: {
        title: "Special Offers",
        image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=2600",
        subtitle: "Grab the best deals before they are gone!"
    }
};
