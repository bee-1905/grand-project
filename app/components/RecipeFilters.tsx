"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RecipeFiltersProps {
  sortBy: string;
  onSortChange: (value: string) => void;
}

export default function RecipeFilters({ sortBy, onSortChange }: RecipeFiltersProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="text-sm font-medium">Sort by:</span>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select sorting" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="title">
            <SelectItem value="title">Title (A-Z)</SelectItem>
            <SelectItem value="title-desc">Title (Z-A)</SelectItem>
            <SelectItem value="createdAt">Date (Newest)</SelectItem>
            <SelectItem value="createdAt-desc">Date (Oldest)</SelectItem>
          </SelectItem>
          </SelectContent>
      </Select>
    </div>
  );
}