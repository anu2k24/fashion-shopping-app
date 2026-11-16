import React, { useState } from 'react';
import './FilterPanel.css';
import { FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
 /* gf
  eslint-disable-next-line no-unused-vars*/
import { motion, AnimatePresence } from 'framer-motion';

const FilterPanel = ({ filters, isOpen, onClose, selectedFilters, onFilterChange, clearAll }) => {
    const [expandedSections, setExpandedSections] = useState({});

    const toggleSection = (filterId) => {
        setExpandedSections(prev => ({
            ...prev,
            [filterId]: !prev[filterId]
        }));
    };

    return (
        <aside className={`filter-panel ${isOpen ? 'open' : ''}`}>
            <div className="filter-header">
                <h3>Filters</h3>
                <button className="close-btn" onClick={onClose}><FiX /></button>
            </div>

            <div className="filter-actions-top">
                <button className="btn-clear" onClick={clearAll}>Clear All</button>
            </div>

            <div className="filter-content">
                {filters && filters.map((filter) => {
                    const isExpanded = expandedSections[filter.id] || false;
                    const hasSelection = selectedFilters[filter.id] && selectedFilters[filter.id].length > 0;

                    return (
                        <div key={filter.id} className={`filter-group-accordion ${isExpanded ? 'expanded' : ''}`}>
                            <button
                                className="filter-accordion-trigger"
                                onClick={() => toggleSection(filter.id)}
                            >
                                <span className={`filter-label ${hasSelection ? 'active-label' : ''}`}>
                                    {filter.label}
                                    {hasSelection && <span className="selection-dot"></span>}
                                </span>
                                <span className="accordion-icon">
                                    {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                                </span>
                            </button>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="accordion-content"
                                    >
                                        <div className="filter-options">
                                            {filter.options && filter.options.map((option, index) => (
                                                <label key={`${filter.id}-${option}-${index}`} className="checkbox-container">
                                                    {option}
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedFilters[filter.id]?.includes(option) || false}
                                                        onChange={() => onFilterChange(filter.id, option)}
                                                    />
                                                    <span className="checkmark"></span>
                                                </label>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>

            <div className="filter-actions-bottom-mobile">
                <button className="btn btn-primary full-width" onClick={onClose}>Apply Filters</button>
            </div>
        </aside>
    );
};

export default FilterPanel;
