const products = [
    // --- Women ---
    {
        id: 1,
        name: "Classic Silk Dress",
        category: "Dress",
        productType: "Dress",
        gender: "Women",
        price: 2499,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000",
        tags: ["New", "Last 7 Days"],
        filters: { size: "M", sleeve: "Sleeveless", neck: "Round Neck", offers: "Discounted Items", offerType: "Flat Discount", discount: "30% – 50%", arrival: "Last 7 Days" }
    },
    {
        id: 2,
        name: "Floral Summer Top",
        category: "Top",
        productType: "Top",
        gender: "Women",
        price: 899,
        image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1000",
        tags: ["Best Seller"],
        filters: { size: "S", sleeve: "Half Sleeve", neck: "V-Neck", offers: "Buy 1 Get 1", offerType: "Buy 1 Get 1", discount: "50%+", arrival: "Last 30 Days" }
    },
    {
        id: 3,
        name: "Elegant Evening Gown",
        category: "Dress",
        productType: "Dress",
        gender: "Women",
        price: 4999,
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000",
        tags: [],
        filters: { size: "L", sleeve: "Sleeveless", neck: "V-Neck", price: "2000+", arrival: "Last 15 Days" }
    },
    {
        id: 11,
        name: "Designer Lehenga",
        category: "Lehenga",
        productType: "Lehenga",
        gender: "Women",
        price: 8999,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYotsLi899_TeJbZzLh0ijLjN43TRk3qgWHUF1CUNGkw&s=10",
        tags: ["Premium"],
        filters: { size: "L", type: "Wedding", price: "2000+", arrival: "Last 30 Days" }
    },
    {
        id: 12,
        name: "Chic Bodysuit",
        category: "Bodysuit",
        productType: "Bodysuit",
        gender: "Women",
        price: 1599,
        image: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=1000",
        tags: ["New"],
        filters: { size: "M", sleeve: "Sleeveless", price: "1000-1999", offerType: "Flat Discount", discount: "10% – 20%", arrival: "Last 7 Days" }
    },
{    "id": 1768021026072,
        "name": "churidar",
        "category": "churidar",
        "productType":"churidar",
        "gender":"Women",
        "price": 2000,
        "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm2Ji9r7mFkOZwbubgzP7e6oHTNlTUrcbUZuufW1lorA&s=10",
    
        "tags": ["New"],
        "filters": { size: "M", sleeve: "Sleeveless", price: "1000-1999", offerType: "Flat Discount", discount: "10% – 20%", arrival: "Last 7 Days"}

        },
    // --- Men ---
    {
        id: 4,
        name: "Urban Denim Jacket",
        category: "Jacket",
        productType: "Jacket",
        gender: "Men",
        price: 2999,
        image: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?q=80&w=1000",
        tags: ["New"],
        filters: { size: "XL", sleeve: "Full Sleeve", offers: "Special Deals", offerType: "Special Deals", discount: "10% – 20%", arrival: "Last 7 Days" }
    },
    {
        id: 5,
        name: "Casual Cotton Shirt",
        category: "Shirt",
        productType: "Shirt",
        gender: "Men",
        price: 1299,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000",
        tags: [],
        filters: { size: "M", sleeve: "Half Sleeve", neck: "Polo Neck", offerType: "Buy 2 Offer", discount: "30% – 50%", arrival: "Last 30 Days" }
    },
    {
        id: 6,
        name: "Tailored Trousers",
        category: "Trousers",
        productType: "Pant",
        gender: "Men",
        price: 1899,
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1000",
        tags: [],
        filters: { size: "32", price: "1000-1999", arrival: "Last 30 Days" }
    },
    {
        id: 13,
        name: "Classic White Tee",
        category: "T-Shirt",
        productType: "T-Shirt",
        gender: "Men",
        price: 899,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000",
        tags: ["Best Seller"],
        filters: { size: "L", neck: "Round Neck", price: "Under 999", offerType: "Buy 1 Get 1", discount: "50%+", arrival: "Last 15 Days" }
    },

    // --- Kids ---
    {
        id: 7,
        name: "Cute Printed Tee",
        category: "T-Shirt",
        productType: "T-Shirt",
        gender: "Kids",
        price: 599,
        image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=1000",
        tags: ["Sale"],
        filters: { age: "3-5 Years", size: "3-4", offers: "Kids Combo Offer", offerType: "Combo Deals", discount: "30% – 50%" }
    },
    {
        id: 8,
        name: "Party Frock",
        category: "Dress",
        productType: "Dress",
        gender: "Kids",
        price: 1599,
        image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1000",
        tags: [],
        filters: { age: "6-8 Years", size: "7-8", offers: "Flat Discount", offerType: "Flat Discount", discount: "10% – 20%", arrival: "Last 15 Days" }
    },
    {
        id: 14,
        name: "Boys Denim Shirt",
        category: "Shirt",
        productType: "Shirt",
        gender: "Kids",
        price: 1199,
        image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSaJpBLeW5NqVkbR8iehLfXD3jbqSkmZyeKgO4QhyeSzKUK0t-yDcXI4yrLn2lkx2e3EFMoJ7KoOzkj5O9TSHLwDEVB01-0szOy3wXcr-s89m7sZQAV9eGJmvt5fvr8WzTbmcofKA&usqp=CAc",
        tags: ["New"],
        filters: { age: "6-8 Years", size: "7-8", offers: "Special Deals", arrival: "Last 7 Days" }
    },

    // --- Jewellery ---
    {
        id: 9,
        name: "Gold Plated Necklace",
        category: "Necklace",
        productType: "Jewellery",
        gender: "Jewellery",
        price: 12999,
        image:"https://www.everestgoldcovering.com/image/catalog/Necklace/nlc1145-beautiful-gold-plated-jewellery-with-guarantee-dubai-necklace-set-online-1.jpg",
        tags: ["New"],
        filters: { material: "Gold", occasion: "Wedding" }
    },
    {
        id: 10,
        name: "Diamond Studs",
        category: "Earrings",
        productType: "Jewellery",
        gender: "Jewellery",
        price: 25000,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000",
        tags: ["Premium"],
        filters: { material: "Diamond", occasion: "Party", offerType: "Special Deals", discount: "10% – 20%" }
    },
    {
        id: 15,
        name: "Silver Charm Bracelet",
        category: "Bracelets",
        productType: "Jewellery",
        gender: "Jewellery",
        price: 2499,
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000",
        tags: ["New"],
        filters: { material: "Silver", occasion: "Daily Wear", offerType: "Flat Discount", discount: "30% - 50%", arrival: "Last 7 Days" }
    }
];

export default products;
