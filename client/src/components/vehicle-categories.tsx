import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tent, Ship, Zap, Coffee } from "lucide-react";
import type { Category } from "@shared/schema";

const categoryIcons = {
  desert_camping: Tent,
  marine_trips: Ship,
  atv_adventures: Zap,
  catering: Coffee,
};

interface VehicleCategoriesProps {
  selectedRegion?: string;
}

export default function VehicleCategories({ selectedRegion = "all" }: VehicleCategoriesProps) {
  const [, setLocation] = useLocation();
  
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories', selectedRegion]
  });

  const handleCategoryClick = (slug: string) => {
    setLocation(`/vehicles?category=${slug}`);
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">اختر نوع مغامرتك</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="group cursor-pointer">
                <CardContent className="p-8 text-center">
                  <Skeleton className="w-16 h-16 mx-auto mb-4 rounded-full" />
                  <Skeleton className="h-6 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-neutral">اختر نوع مغامرتك</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories?.map((category) => {
            const IconComponent = categoryIcons[category.slug as keyof typeof categoryIcons] || Tent;
            
            return (
              <Card 
                key={category.id} 
                className="group cursor-pointer overflow-hidden relative transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                onClick={() => handleCategoryClick(category.slug)}
                style={{ 
                  background: `linear-gradient(135deg, ${category.color}20, ${category.color}10)`
                }}
              >
                {category.bgImage && (
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                    style={{ backgroundImage: `url(${category.bgImage})` }}
                  />
                )}
                <CardContent className="relative p-8 text-center">
                  <div className="mb-6">
                    <div 
                      className="w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300"
                      style={{ backgroundColor: category.color }}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: category.color }}>
                    {category.nameAr}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {category.descriptionAr}
                  </p>
                  <div 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.vehicleCount} خيار متاح
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
