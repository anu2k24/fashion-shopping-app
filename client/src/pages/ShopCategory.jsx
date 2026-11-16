import React, { useState, useEffect, useMemo, useLayoutEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { FiFilter } from 'react-icons/fi';
import axios from 'axios';
import FilterPanel from '../components/FilterPanel';
import ProductCard from '../components/ProductCard';
import { filterConfig, bannerConfig } from '../data/config';
import './ShopCategory.css';

const ShopCategory = ({ category: categoryProp }) => {
    const { category: categoryParam } = useParams();
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({});
    const [sortBy, setSortBy] = useState('newest');

    // Get category from props or URL params - default to empty string if undefined
    const category = categoryProp || categoryParam || '';

    // Config based on category prop (passed from App.jsx routing) - safely handle undefined
    const configKey = category ? category.toLowerCase() : '';

    // Safe access to config
    const currentFilters = configKey && filterConfig[configKey] ? filterConfig[configKey] : [];
    let currentBanner = configKey && bannerConfig[configKey] ? bannerConfig[configKey] : null;

    // Handle search category
    if (configKey === 'search') {
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get('q');
        currentBanner = {
            title: query ? `Results for "${query}"` : "Search Results",
            subtitle: "Curated collections based on your search",
            image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000",
            isSearch: true
        };
    }

    // Fetch Products from API
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let url = 'http://localhost:5000/api/products';
                if (configKey === 'search') {
                    const searchParams = new URLSearchParams(location.search);
                    const q = searchParams.get('q');
                    if (q) {
                        url = `http://localhost:5000/api/search?q=${encodeURIComponent(q)}`;
                    }
                }
                const res = await axios.get(url);
                setProducts(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, [configKey, location.search]);

    // Reset filters when category changes
     
    useLayoutEffect(() => {
        if (category) {
            setSelectedFilters({});
            window.scrollTo(0, 0);
        }
    }, [category, location.search]);

    const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

    const handleFilterChange = (filterId, option) => {
        setSelectedFilters(prev => {
            const current = prev[filterId] || [];
            const isSelected = current.includes(option);
            if (isSelected) {
                return { ...prev, [filterId]: current.filter(item => item !== option) };
            } else {
                return { ...prev, [filterId]: [...current, option] };
            }
        });
    };

    const clearAllFilters = () => {
        setSelectedFilters({});
    };

    const filteredProducts = useMemo(() => {
        if (!configKey || !products.length) return [];

        let filtered = products.filter(p => {
            // Category filtering logic
            const dataGenderMap = {
                'women': 'Women',
                'men': 'Men',
                'kids': 'Kids',
                'jewellery': 'Jewellery'
            };

            // Strict filtering for standard category pages
            if (dataGenderMap[configKey]) {
                if (p.gender !== dataGenderMap[configKey]) return false;
            }

            // Apply selected side filters
            for (const [key, selectedOptions] of Object.entries(selectedFilters)) {
                if (selectedOptions.length > 0) {
                    let productValue = p[key];

                    if (productValue === undefined) {
                        productValue = p.filters?.[key];
                    }

                    // Special case: "Category" filter on mixed pages might match p.gender
                    if (key === 'category' && (configKey === 'new-arrivals' || configKey === 'offers')) {
                        if (!selectedOptions.includes(p.gender)) return false;
                        continue;
                    }

                    // General array inclusion check
                    if (!selectedOptions.includes(productValue)) {
                        return false;
                    }
                }
            }

            return true;
        });

        // Sorting
        if (sortBy === 'price-low-high') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high-low') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'newest') {
            filtered.sort((a, b) => b.id - a.id);
        }

        return filtered;
    }, [configKey, selectedFilters, sortBy, products]);

    // Early return if no valid banner
    if (!currentBanner) {
        return <div className="container p-12 text-center">Category Not Found</div>;
    }
    
    if (loading) return <div className="container p-12 text-center">Loading Products...</div>;

    return (
        <div className="shop-category-page">
            {/* Hero Banner */}
            <div className="category-hero" style={{ backgroundImage: `url(${currentBanner.image})` }}>
                <div className="hero-overlay-dark"></div>
                <div className="category-hero-content container">
                    <h1>{currentBanner.title}</h1>
                    <p>{currentBanner.subtitle}</p>
                    {currentBanner.isSearch && (
                        <Link to="/" className="back-home-btn">
                            ← Back to Home
                        </Link>
                    )}
                </div>
            </div>

            <div className="container shop-layout">
                {/* Sidebar Filters */}
                <FilterPanel
                    filters={currentFilters}
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    selectedFilters={selectedFilters}
                    onFilterChange={handleFilterChange}
                    clearAll={clearAllFilters}
                />

                {/* Main Content */}
                <div className="shop-main">
                    {/* Sort Bar */}
                    <div className="shop-header">
                        <div className="shop-header-left">
                            <button className="filter-toggle-btn" onClick={toggleFilter}>
                                <FiFilter /> Filter
                            </button>
                            <span>{filteredProducts.length} Results</span>
                        </div>

                        <div className="sort-dropdown-container">
                            <span className="sort-label">Sort by:</span>
                            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="newest">New Arrivals</option>
                                <option value="price-low-high">Price: Low to High</option>
                                <option value="price-high-low">Price: High to Low</option>
                                <option value="popularity">Popularity</option>
                            </select>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="products-grid">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        ) : (
                            <div className="no-products">
                                <h3>No products found</h3>
                                <p>Try clearing your filters.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopCategory;
