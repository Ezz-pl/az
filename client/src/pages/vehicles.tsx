import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import VehicleCard from "@/components/vehicle-card";
import SearchForm from "@/components/search-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import type { Vehicle } from "@shared/schema";
import type { SearchFilters } from "@/lib/types";

export default function Vehicles() {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [searchTerm, setSearchTerm] = useState("");

  const { data: vehicles, isLoading } = useQuery<Vehicle[]>({
    queryKey: ['/api/vehicles', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      
      const response = await fetch(`/api/vehicles?${params}`);
      if (!response.ok) throw new Error('Failed to fetch vehicles');
      return response.json();
    }
  });

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category: category === "all" ? undefined : category }));
  };

  const filteredVehicles = vehicles || [];

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">جميع المركبات</h1>
            
            {/* Search and Filter Section */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="ابحث عن مركبة..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={handleSearch} className="bg-primary hover:bg-primary/90">
                        <Search className="w-4 h-4 ml-2" />
                        بحث
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Select onValueChange={handleCategoryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="نوع المركبة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الأنواع</SelectItem>
                        <SelectItem value="offroad">سيارات برية</SelectItem>
                        <SelectItem value="boat">قوارب</SelectItem>
                        <SelectItem value="jetski">دبابات بحر</SelectItem>
                        <SelectItem value="atv">دبابات برية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            <div className="text-right mb-6">
              <p className="text-gray-600">
                {isLoading ? "جاري البحث..." : `${filteredVehicles.length} مركبة متاحة`}
              </p>
            </div>

            {/* Vehicles Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="w-full h-48" />
                    <div className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-10 w-24" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : filteredVehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">
                  لم يتم العثور على مركبات تطابق البحث
                </div>
                <Button 
                  onClick={() => {
                    setFilters({});
                    setSearchTerm("");
                  }}
                  variant="outline"
                >
                  إعادة تعيين البحث
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
