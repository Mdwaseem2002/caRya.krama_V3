"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Search, ChevronDown, Sparkles, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getPublishedStoredCars, StoredCar } from "@/Admin/Upload/CarStorage";
import SearchShowen from "@/Details/SearchEngine/SearchShowen";

const BUDGET_RANGES = [
  { label: "Any Budget", min: 0, max: Infinity },
  { label: "Under ₹5 Lakh", min: 0, max: 500000 },
  { label: "₹5L - ₹10 Lakh", min: 500001, max: 1000000 },
  { label: "₹10L - ₹20 Lakh", min: 1000001, max: 2000000 },
  { label: "Over ₹20 Lakh", min: 2000001, max: Infinity },
];

const POPULAR_TAGS = ["SUV", "Sedan", "Under ₹10L", "Automatic", "Low KMs"];

// ── CUSTOM DROPDOWN COMPONENT ────────────────────────────────────────────────
function CustomDropdown({ 
  label, 
  options, 
  value, 
  onChange,
  className = "" 
}: { 
  label: string; 
  options: string[]; 
  value: string; 
  onChange: (val: string) => void;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative group/filter ${className}`}>
      <div className="text-[7.5px] md:text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5 md:mb-1 ml-1 truncate">{label}</div>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 hover:bg-slate-100 text-[#0f172a] font-bold text-[10px] sm:text-[11px] md:text-[12px] px-2 sm:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl border border-transparent outline-none flex items-center justify-between transition-all"
      >
        <span className="truncate">{value}</span>
        <ChevronDown className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} size={10} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-1 md:mt-2 bg-white border border-slate-100 rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl z-50 overflow-hidden py-1.5 md:py-2"
          >
            <div className="max-h-52 md:max-h-60 overflow-y-auto custom-scrollbar">
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 md:py-2.5 text-left text-[11px] md:text-[12px] font-bold flex items-center justify-between transition-colors ${
                    value === opt ? "bg-royal/5 text-royal" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="truncate pr-2">{opt}</span>
                  {value === opt && <Check size={10} className="text-royal shrink-0" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SearchEngine() {
  const [allCars, setAllCars] = useState<StoredCar[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBudget, setSelectedBudget] = useState(BUDGET_RANGES[0]);
  const [selectedBrand, setSelectedBrand] = useState("Any Brand");
  const [selectedFuel, setSelectedFuel] = useState("Any Fuel");
  const [showResults, setShowResults] = useState(false);

  // Fetch cars from storage
  useEffect(() => {
    getPublishedStoredCars().then(setAllCars).catch(console.error);
  }, []);

  // Dynamic filter options based on available cars
  const brands = useMemo(() => ["Any Brand", ...Array.from(new Set(allCars.map((c) => c.brand)))], [allCars]);
  const fuels = useMemo(() => ["Any Fuel", ...Array.from(new Set(allCars.map((c) => c.specs.fuelType)))], [allCars]);

  // Filtering Logic
  const filteredCars = useMemo(() => {
    return allCars.filter((car) => {
      const query = searchQuery.toLowerCase().trim();
      const matchQuery = 
        car.title.toLowerCase().includes(query) ||
        car.brand.toLowerCase().includes(query) ||
        car.model.toLowerCase().includes(query);
      
      const priceString = car.pricing.sellingPrice.replace(/[^0-9.]/g, "");
      const priceValue = parseFloat(priceString);
      
      // Determine if price is in Crore or Lakh (assuming logic for parsing "Crore")
      let absolutePrice = priceValue;
      if (car.pricing.sellingPrice.includes("Crore")) absolutePrice *= 10000000;
      else if (car.pricing.sellingPrice.includes("Lakh")) absolutePrice *= 100000;
      
      const matchBudget = absolutePrice >= selectedBudget.min && absolutePrice <= selectedBudget.max;
      
      const matchBrand = selectedBrand === "Any Brand" || car.brand === selectedBrand;
      const matchFuel = selectedFuel === "Any Fuel" || car.specs.fuelType === selectedFuel;

      return matchQuery && matchBudget && matchBrand && matchFuel;
    });
  }, [allCars, searchQuery, selectedBudget, selectedBrand, selectedFuel]);

  const handleSearch = () => {
    setShowResults(true);
    // Smooth scroll to results
    setTimeout(() => {
      document.getElementById("search-results-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleTagClick = (tag: string) => {
    if (tag === "SUV" || tag === "Sedan") {
      setSearchQuery(tag);
    } else if (tag === "Under ₹10L") {
      setSelectedBudget(BUDGET_RANGES[2]);
    } else if (tag === "Automatic") {
      setSearchQuery(tag);
    } else if (tag === "Low KMs") {
      setSearchQuery("Low");
    }
    handleSearch();
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-6 md:py-12">
      {/* ── HEADER ── */}
      <div className="text-center mb-6 md:mb-10">
        <h2 className="text-3xl md:text-6xl font-black tracking-tighter text-[#0f172a] mb-2 md:mb-4">
          Find Your <span className="text-royal">Perfect Car.</span>
        </h2>
        <p className="text-[10px] md:text-lg text-slate-500 font-bold uppercase tracking-[0.2em] opacity-70">
          Handpicked, inspected, and ready for you
        </p>
      </div>

      {/* ── SEARCH BAR CONTAINER ── */}
      <div className="relative bg-white rounded-[1.5rem] md:rounded-full p-2.5 md:p-2 shadow-[0_15px_45px_rgba(0,0,0,0.06)] flex flex-col md:flex-row items-center gap-2 md:gap-2 border border-gray-100/60 max-w-[600px] md:max-w-none mx-auto">
        
        {/* ROW 1 (Mobile Context) */}
        <div className="flex flex-row items-center w-full md:w-auto md:flex-grow gap-2 order-1">
          {/* Search Input Div */}
          <div className="flex-grow flex items-center gap-2 md:gap-4 px-4 md:px-6 py-3.5 md:py-0 group">
            <Search className="w-[18px] h-[18px] md:w-5 md:h-5 text-royal shrink-0" strokeWidth={2.5} />
            <input 
              type="text"
              placeholder="Search cars, brands, styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[#0f172a] font-bold text-sm md:text-base w-full placeholder:text-slate-400 placeholder:font-medium truncate"
            />
          </div>

          <div className="hidden md:block w-px h-10 bg-gray-100 shrink-0" />

          {/* Search Button (Mobile Inline) */}
          <div className="md:hidden pr-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              className="bg-royal text-white font-black uppercase text-[10px] px-5 py-2.5 rounded-lg shadow-lg shadow-blue-500/20 active:bg-blue-700"
            >
              Search
            </motion.button>
          </div>
        </div>

        {/* Filters Group (Row 2 on Mobile) */}
        <div className="flex flex-row items-center gap-x-1.5 sm:gap-x-3 w-full md:w-auto px-4 md:px-4 z-50 order-3 md:order-2 pb-2 md:pb-0">
          <CustomDropdown 
            label="Budget"
            options={BUDGET_RANGES.map(b => b.label)}
            value={selectedBudget.label}
            onChange={(val) => setSelectedBudget(BUDGET_RANGES.find(b => b.label === val) || BUDGET_RANGES[0])}
            className="flex-1 md:w-36"
          />
          <CustomDropdown 
            label="Brand"
            options={brands}
            value={selectedBrand}
            onChange={setSelectedBrand}
            className="flex-1 md:w-36"
          />
          <CustomDropdown 
            label="Fuel"
            options={fuels}
            value={selectedFuel}
            onChange={setSelectedFuel}
            className="flex-1 md:w-36"
          />
        </div>

        {/* Search Button (Desktop End) */}
        <div className="hidden md:block md:order-3">
          <motion.button
            whileHover={{ scale: 1.01, backgroundColor: "#1B4FD8" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSearch}
            className="bg-royal text-white font-black uppercase tracking-widest text-[11px] px-8 py-3.5 rounded-full shadow-lg shadow-blue-500/15 transition-all h-full flex items-center justify-center whitespace-nowrap"
          >
            Search
          </motion.button>
        </div>
      </div>

      {/* ── POPULAR TAGS ── */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-8 md:mt-10 mb-10 md:mb-12">
        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2 opacity-60">
          Popular:
        </span>
        {POPULAR_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className="px-4 md:px-6 py-2 md:py-2.5 rounded-full border border-gray-100 text-gray-500 font-bold text-[10px] md:text-xs hover:bg-royal hover:text-white hover:border-royal transition-all active:scale-95 bg-white shadow-sm"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* ── RESULTS SHOWEN ── */}
      <div id="search-results-section" className="scroll-mt-32">
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <SearchShowen filteredCars={filteredCars} query={searchQuery} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
