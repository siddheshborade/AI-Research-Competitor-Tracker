import React, { useState, useMemo } from "react";
import { IntelligenceCard } from "./IntelligenceCard";
import { FilterToolbar } from "./FilterToolbar";
import { EmptyState } from "../common/EmptyState";
import { useResearch } from "../../context/ResearchContext";
import { Sparkles, Layers } from "lucide-react";

export function IntelligenceFeed() {
  const { intelligenceItems, setActiveView } = useResearch();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedPriority, setSelectedPriority] = useState("ALL");
  const [selectedVerification, setSelectedVerification] = useState("ALL");

  const filteredItems = useMemo(() => {
    return intelligenceItems.filter((item) => {
      // Search match
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        item.title.toLowerCase().includes(query) ||
        item.what.toLowerCase().includes(query) ||
        item.why.toLowerCase().includes(query) ||
        item.soWhat.toLowerCase().includes(query) ||
        (item.competitor && item.competitor.toLowerCase().includes(query));

      // Category match
      const matchesCategory =
        selectedCategory === "ALL" ||
        item.category.toUpperCase() === selectedCategory.toUpperCase();

      // Priority match
      const matchesPriority =
        selectedPriority === "ALL" ||
        item.priority.toUpperCase() === selectedPriority.toUpperCase();

      // Verification match
      const matchesVerification =
        selectedVerification === "ALL" ||
        item.verificationState === selectedVerification;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPriority &&
        matchesVerification
      );
    });
  }, [
    intelligenceItems,
    searchTerm,
    selectedCategory,
    selectedPriority,
    selectedVerification,
  ]);

  return (
    <div className="space-y-6">
      {/* Filtering Toolbar */}
      <FilterToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedPriority={selectedPriority}
        setSelectedPriority={setSelectedPriority}
        selectedVerification={selectedVerification}
        setSelectedVerification={setSelectedVerification}
      />

      {/* Feed List */}
      {filteredItems.length === 0 ? (
        <EmptyState
          title="No Intelligence Signals Match Filters"
          description="Try broadening your search query or reset the priority/category filters to inspect all synthesized intelligence."
          actionLabel="Launch New Research Run"
          onAction={() => setActiveView("studio")}
        />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredItems.map((item) => (
            <IntelligenceCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default IntelligenceFeed;
