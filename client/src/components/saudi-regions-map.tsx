import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

const saudiRegions = [
  { 
    id: "riyadh", 
    nameAr: "الرياض", 
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&q=80&fit=crop",
    description: "العاصمة والمنطقة الوسطى"
  },
  { 
    id: "makkah", 
    nameAr: "مكة المكرمة", 
    imageUrl: "https://images.unsplash.com/photo-1564069114553-7215e1ff1890?w=300&h=200&q=80&fit=crop",
    description: "جدة والساحل الغربي"
  },
  { 
    id: "madinah", 
    nameAr: "المدينة المنورة", 
    imageUrl: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=300&h=200&q=80&fit=crop",
    description: "المدينة المنورة ونواحيها"
  },
  { 
    id: "eastern", 
    nameAr: "المنطقة الشرقية", 
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&q=80&fit=crop",
    description: "الدمام والخبر والظهران"
  },
  { 
    id: "asir", 
    nameAr: "عسير", 
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&q=80&fit=crop",
    description: "أبها والجبال الخضراء"
  },
  { 
    id: "hail", 
    nameAr: "حائل", 
    imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=300&h=200&q=80&fit=crop",
    description: "جبال أجا وسلمى"
  },
  { 
    id: "tabuk", 
    nameAr: "تبوك", 
    imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=300&h=200&q=80&fit=crop",
    description: "البحر الأحمر ونيوم"
  },
  { 
    id: "jazan", 
    nameAr: "جازان", 
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&q=80&fit=crop",
    description: "الساحل الجنوبي وجزر فرسان"
  },
  { 
    id: "qassim", 
    nameAr: "القصيم", 
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&q=80&fit=crop",
    description: "بريدة وعنيزة"
  },
  { 
    id: "al_baha", 
    nameAr: "الباحة", 
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&q=80&fit=crop",
    description: "الغابات والجبال"
  },
  { 
    id: "najran", 
    nameAr: "نجران", 
    imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=300&h=200&q=80&fit=crop",
    description: "التراث والمواقع الأثرية"
  },
  { 
    id: "northern_borders", 
    nameAr: "الحدود الشمالية", 
    imageUrl: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=300&h=200&q=80&fit=crop",
    description: "عرعر والحدود الشمالية"
  }
];

interface SaudiRegionsMapProps {
  selectedRegion: string;
  onRegionChange: (regionId: string) => void;
}

export default function SaudiRegionsMap({ selectedRegion, onRegionChange }: SaudiRegionsMapProps) {
  return (
    <div className="w-full bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            اختر منطقتك في المملكة العربية السعودية
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            اكتشف المغامرات والأنشطة المتاحة في كل منطقة
          </p>
          <Badge className="bg-green-600 text-white px-6 py-2 text-lg">
            <MapPin className="w-5 h-5 mr-2" />
            12 منطقة متاحة
          </Badge>
        </div>

        {/* شبكة أكبر وأوضح للمناطق */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {saudiRegions.map((region) => (
            <Card
              key={region.id}
              className={`cursor-pointer transition-all duration-300 overflow-hidden hover:shadow-xl transform hover:scale-105 ${
                selectedRegion === region.id 
                  ? "ring-4 ring-green-500 shadow-2xl scale-105" 
                  : "hover:shadow-lg"
              }`}
              onClick={() => onRegionChange(region.id)}
            >
              <div className="relative">
                <img 
                  src={region.imageUrl} 
                  alt={region.nameAr}
                  className="w-full h-40 md:h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* اسم المنطقة */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-bold text-center text-xl mb-2">
                    {region.nameAr}
                  </h3>
                  <p className="text-sm text-center opacity-90 leading-relaxed">
                    {region.description}
                  </p>
                </div>
                
                {/* أيقونة الموقع */}
                <div className="absolute top-2 right-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    selectedRegion === region.id ? 'bg-green-500' : 'bg-white/80'
                  }`}>
                    <MapPin className={`w-4 h-4 ${
                      selectedRegion === region.id ? 'text-white' : 'text-gray-700'
                    }`} />
                  </div>
                </div>
                
                {/* تأكيد الاختيار */}
                {selectedRegion === region.id && (
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                    <Badge className="bg-green-600 text-white font-bold px-4 py-2">
                      ✓ مختارة
                    </Badge>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* معلومات المنطقة المختارة */}
        {selectedRegion && selectedRegion !== "all" && (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-green-800 mb-2">
                    {saudiRegions.find(r => r.id === selectedRegion)?.nameAr}
                  </h3>
                  <p className="text-gray-700">
                    {saudiRegions.find(r => r.id === selectedRegion)?.description}
                  </p>
                </div>
                <Badge className="bg-green-600 text-white px-6 py-3 text-base">
                  <MapPin className="w-5 h-5 mr-2" />
                  سيتم عرض المحتوى الخاص بهذه المنطقة فقط
                </Badge>
              </CardContent>
            </Card>
          </div>
        )}

        {/* زر عرض كل المناطق */}
        {selectedRegion !== "all" && (
          <div className="text-center mt-8">
            <button
              onClick={() => onRegionChange("all")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              عرض جميع المناطق
            </button>
          </div>
        )}
      </div>
    </div>
  );
}