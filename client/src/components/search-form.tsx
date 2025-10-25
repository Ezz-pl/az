import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import type { SearchFilters } from "@/lib/types";

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  className?: string;
  selectedRegion?: string;
  onRegionChange?: (region: string) => void;
}

export default function SearchForm({ onSearch, className = "", selectedRegion = "all", onRegionChange }: SearchFormProps) {
  const [regions] = useState([
    { value: "all", label: "جميع المناطق" },
    { value: "riyadh", label: "الرياض" },
    { value: "mecca", label: "مكة المكرمة" },
    { value: "medina", label: "المدينة المنورة" },
    { value: "qassim", label: "القصيم" },
    { value: "eastern", label: "الشرقية" },
    { value: "asir", label: "عسير" },
    { value: "tabuk", label: "تبوك" },
    { value: "hail", label: "حائل" },
    { value: "northern_borders", label: "الحدود الشمالية" },
    { value: "jazan", label: "جازان" },
    { value: "najran", label: "نجران" },
    { value: "baha", label: "الباحة" },
    { value: "jouf", label: "الجوف" }
  ]);
  const [filters, setFilters] = useState<SearchFilters>({
    category: "all",
    tripType: "all",
    vehicleType: "all",
    startDate: "",
    endDate: "",
    search: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleChange = (field: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleTripTypeChange = (value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      tripType: value,
      vehicleType: "all" // Reset vehicle type when trip type changes
    }));
  };

  const getVehicleOptions = () => {
    switch (filters.tripType) {
      case "land":
        return [
          { value: "all", label: "جميع الأنواع البرية" },
          { value: "tents_only", label: "خيمة" },
          { value: "with_car", label: "سيارة" },
          { value: "atv", label: "دباب بري" }
        ];
      case "sea":
        return [
          { value: "all", label: "جميع الأنواع البحرية" },
          { value: "boat", label: "قارب" },
          { value: "yacht", label: "يخت" },
          { value: "jetski", label: "دباب بحر" }
        ];
      case "both":
        return [
          { value: "all", label: "جميع الأنواع" },
          { value: "tents_only", label: "خيمة" },
          { value: "with_car", label: "سيارة" },
          { value: "atv", label: "دباب بري" },
          { value: "boat", label: "قارب" },
          { value: "yacht", label: "يخت" },
          { value: "jetski", label: "دباب بحر" }
        ];
      default:
        return [
          { value: "all", label: "اختر نوع الرحلة أولاً" }
        ];
    }
  };

  return (
    <Card className={`bg-white rounded-xl shadow-lg ${className}`}>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 text-right">
            {/* اختيار المنطقة */}
            <div className="md:col-span-1">
              <Label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                المنطقة
              </Label>
              <Select
                value={selectedRegion}
                onValueChange={onRegionChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المنطقة" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(region => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-1">
              <Label htmlFor="tripType" className="block text-sm font-medium text-gray-700 mb-2">
                نوع الرحلة
              </Label>
              <Select
                value={filters.tripType}
                onValueChange={handleTripTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الرحلة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  <SelectItem value="land">برية</SelectItem>
                  <SelectItem value="sea">بحرية</SelectItem>
                  <SelectItem value="both">برية والبحرية</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-1">
              <Label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-2">
                نوع المركبة
              </Label>
              <Select
                value={filters.vehicleType}
                onValueChange={(value) => handleChange("vehicleType", value)}
                disabled={!filters.tripType || filters.tripType === "all"}
              >
                <SelectTrigger className={!filters.tripType || filters.tripType === "all" ? "opacity-50" : ""}>
                  <SelectValue placeholder={filters.tripType && filters.tripType !== "all" ? "اختر النوع" : "اختر نوع الرحلة أولاً"} />
                </SelectTrigger>
                <SelectContent>
                  {getVehicleOptions().map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-1">
              <Label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                تاريخ الاستلام
              </Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="w-full"
              />
            </div>

            <div className="md:col-span-1">
              <Label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                تاريخ التسليم
              </Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className="w-full"
              />
            </div>

            <div className="md:col-span-1">
              <Label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                البحث
              </Label>
              <Input
                id="search"
                type="text"
                placeholder="ابحث عن مركبة..."
                value={filters.search}
                onChange={(e) => handleChange("search", e.target.value)}
                className="w-full"
              />
            </div>

            <div className="md:col-span-1 flex items-end">
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                <Search className="w-4 h-4 ml-2" />
                بحث
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
