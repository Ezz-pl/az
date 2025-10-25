import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import VehicleCard from "./vehicle-card";
import { ArrowLeft } from "lucide-react";
import type { Vehicle } from "@shared/schema";

interface FeaturedVehiclesProps {
  selectedRegion?: string;
}

export default function FeaturedVehicles({ selectedRegion = "all" }: FeaturedVehiclesProps) {
  const [, setLocation] = useLocation();
  
  const { data: vehicles, isLoading } = useQuery<Vehicle[]>({
    queryKey: ['/api/vehicles', selectedRegion],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedRegion && selectedRegion !== 'all') {
        params.append('region', selectedRegion);
      }
      const response = await fetch(`/api/vehicles?${params}`);
      if (!response.ok) throw new Error('Failed to fetch vehicles');
      return response.json();
    }
  });

  const featuredVehicles = vehicles?.slice(0, 6) || [];

  const handleViewAll = () => {
    setLocation('/vehicles');
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-neutral">اختر مغامرتك</h2>
          <Button 
            variant="ghost" 
            onClick={handleViewAll}
            className="text-primary hover:text-primary/80 transition-colors"
          >
            عرض الكل
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredVehicles.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto bg-white rounded-lg border border-blue-200 p-8">
              <div className="text-blue-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6l4 2M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">
                لا توجد مغامرات متاحة بعد
              </h3>
              <p className="text-blue-600 mb-6">
                نحن نعمل مع أفضل الشركاء لإضافة مغامرات رائعة قريباً
              </p>
              <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
                <p className="text-blue-800 font-medium mb-2">هل أنت مقدم خدمات؟</p>
                <p className="text-blue-600 text-sm mb-3">انضم إلينا وابدأ في تحقيق الأرباح</p>
                <a 
                  href="/partner-register" 
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  سجل كشريك
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
