import { useState } from "react";
import { useLocation } from "wouter";
import SearchForm from "./search-form";

interface HeroSectionProps {
  selectedRegion?: string;
  onRegionChange?: (region: string) => void;
}

export default function HeroSection({ selectedRegion = "all", onRegionChange }: HeroSectionProps) {
  const [, setLocation] = useLocation();

  const handleSearch = (filters: any) => {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== "all") {
      params.append("category", filters.category);
    }
    if (filters.search) {
      params.append("search", filters.search);
    }
    
    setLocation(`/vehicles?${params.toString()}`);
  };

  return (
    <section className="gradient-hero text-white py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 animate-fade-in leading-tight">
            اكتشف مغامرتك القادمة
          </h1>
          <p className="text-xl md:text-3xl mb-12 opacity-95 animate-fade-in leading-relaxed max-w-4xl mx-auto">
            احجز مغامرتك القادمة مع أفضل الشركاء في المملكة
          </p>
          
          <div className="animate-fade-in">
            <SearchForm 
              onSearch={handleSearch} 
              selectedRegion={selectedRegion} 
              onRegionChange={onRegionChange}
              className="gradient-card shadow-2xl" 
            />
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-2xl font-bold">مغامرات البر</div>
              <div className="text-lg opacity-90">مخيمات وقوافل صحراوية</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-2xl font-bold">الرحلات البحرية</div>
              <div className="text-lg opacity-90">قوارب ويخوت ورياضات مائية</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-2xl font-bold">مغامرات الدبابات</div>
              <div className="text-lg opacity-90">دبابات وكوادز وطرق وعرة</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
