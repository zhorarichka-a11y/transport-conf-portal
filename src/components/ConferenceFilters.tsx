import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface ConferenceFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  university: string;
  onUniversityChange: (value: string) => void;
  format: string;
  onFormatChange: (value: string) => void;
  universities: string[];
  formats: string[];
  onReset: () => void;
}

export const ConferenceFilters = ({
  search,
  onSearchChange,
  university,
  onUniversityChange,
  format,
  onFormatChange,
  universities,
  formats,
  onReset,
}: ConferenceFiltersProps) => {
  const hasFilters = search || university || format;

  return (
    <div className="rounded-lg border bg-card p-4 mb-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Поиск</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Название или тематика..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* University filter */}
        <div className="space-y-2">
          <Label>Университет</Label>
          <Select value={university} onValueChange={onUniversityChange}>
            <SelectTrigger>
              <SelectValue placeholder="Все вузы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все вузы</SelectItem>
              {universities.map((uni) => (
                <SelectItem key={uni} value={uni}>
                  {uni}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Format filter */}
        <div className="space-y-2">
          <Label>Формат</Label>
          <Select value={format} onValueChange={onFormatChange}>
            <SelectTrigger>
              <SelectValue placeholder="Все форматы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все форматы</SelectItem>
              {formats.map((fmt) => (
                <SelectItem key={fmt} value={fmt}>
                  {fmt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reset button */}
        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={onReset}
            disabled={!hasFilters}
            className="w-full gap-2"
          >
            <X className="h-4 w-4" />
            Сбросить
          </Button>
        </div>
      </div>
    </div>
  );
};
