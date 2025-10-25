import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ChevronDown } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const saudiRegions = [
  { 
    id: "all", 
    nameAr: "جميع المناطق", 
    nameEn: "All Regions", 
    color: "#10B981",
    description: "استكشف جميع المناطق",
    vehicleTypes: ["جميع الأنواع"],
    imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&q=80"
  },
  { 
    id: "riyadh", 
    nameAr: "منطقة الرياض", 
    nameEn: "Riyadh Region", 
    color: "#3B82F6",
    description: "العاصمة ومحيطها",
    vehicleTypes: ["كشتات صحراوية", "سيارات فاخرة", "رحلات نهارية"],
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80"
  },
  { 
    id: "makkah", 
    nameAr: "منطقة مكة المكرمة", 
    nameEn: "Makkah Region", 
    color: "#8B5CF6",
    description: "جدة والساحل الغربي",
    vehicleTypes: ["يخوت فاخرة", "دبابات بحرية", "قوارب صيد", "رحلات بحرية"],
    imageUrl: "https://images.unsplash.com/photo-1564069114553-7215e1ff1890?w=400&q=80"
  },
  { 
    id: "madinah", 
    nameAr: "منطقة المدينة المنورة", 
    nameEn: "Madinah Region", 
    color: "#10B981",
    description: "المدينة المنورة وضواحيها",
    vehicleTypes: ["رحلات دينية", "كشتات صحراوية"],
    imageUrl: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400&q=80"
  },
  { 
    id: "qassim", 
    nameAr: "منطقة القصيم", 
    nameEn: "Qassim Region", 
    color: "#F59E0B",
    description: "بريدة وعنيزة",
    vehicleTypes: ["كشتات زراعية", "جولات ريفية"],
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80"
  },
  { 
    id: "eastern", 
    nameAr: "المنطقة الشرقية", 
    nameEn: "Eastern Province", 
    color: "#06B6D4",
    description: "الدمام والخبر والظهران",
    vehicleTypes: ["رحلات بحرية", "صيد الخليج", "دبابات بحرية"],
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80"
  },
  { 
    id: "asir", 
    nameAr: "منطقة عسير", 
    nameEn: "Asir Region", 
    color: "#84CC16",
    description: "أبها والجبال الخضراء",
    vehicleTypes: ["رحلات جبلية", "تلفريك", "مغامرات الطبيعة"],
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80"
  },
  { 
    id: "tabuk", 
    nameAr: "منطقة تبوك", 
    nameEn: "Tabuk Region", 
    color: "#6366F1",
    description: "البحر الأحمر والجبال",
    vehicleTypes: ["رحلات بحرية", "مغامرات جبلية", "مواقع أثرية"],
    imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80"
  },
  { 
    id: "hail", 
    nameAr: "منطقة حائل", 
    nameEn: "Hail Region", 
    color: "#D97706",
    description: "جبال أجا وسلمى",
    vehicleTypes: ["كشتات صحراوية", "دبابات جبلية", "مغامرات البر"],
    imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&q=80"
  },
  { 
    id: "northern_borders", 
    nameAr: "منطقة الحدود الشمالية", 
    nameEn: "Northern Borders", 
    color: "#7C3AED",
    description: "عرعر والحدود الشمالية",
    vehicleTypes: ["رحلات استكشافية", "كشتات حدودية"],
    imageUrl: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=400&q=80"
  },
  { 
    id: "jazan", 
    nameAr: "منطقة جازان", 
    nameEn: "Jazan Region", 
    color: "#DC2626",
    description: "الساحل الجنوبي والجزر",
    vehicleTypes: ["رحلات بحرية", "جزر فرسان", "صيد تقليدي"],
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80"
  },
  { 
    id: "najran", 
    nameAr: "منطقة نجران", 
    nameEn: "Najran Region", 
    color: "#059669",
    description: "التراث والمواقع الأثرية",
    vehicleTypes: ["رحلات تراثية", "مغامرات صحراوية"],
    imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&q=80"
  },
  { 
    id: "al_baha", 
    nameAr: "منطقة الباحة", 
    nameEn: "Al Baha Region", 
    color: "#7C2D12",
    description: "غابات وجبال خضراء",
    vehicleTypes: ["رحلات الغابات", "مغامرات جبلية", "استجمام طبيعي"],
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80"
  },
];

interface RegionSelectorProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

export default function RegionSelector({ selectedRegion, onRegionChange }: RegionSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedRegionData = saudiRegions.find(r => r.id === selectedRegion) || saudiRegions[0];

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              اختر منطقتك في المملكة العربية السعودية
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              ابحث عن المغامرات والمركبات الترفيهية حسب المنطقة
            </p>
            <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              <MapPin className="w-4 h-4 mr-2" />
              13 منطقة متاحة للاستكشاف
            </div>
          </div>

          {/* Region Selector */}
          <div className="space-y-4">
            {/* Mobile/Tablet View - Dropdown */}
            <div className="md:hidden">
              <Select value={selectedRegion} onValueChange={onRegionChange}>
                <SelectTrigger className="w-full h-12 text-right">
                  <SelectValue>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: selectedRegionData.color }}
                        />
                        <span className="font-medium">{selectedRegionData.nameAr}</span>
                      </div>
                      <MapPin className="w-4 h-4 text-gray-500" />
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {saudiRegions.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: region.color }}
                        />
                        <span>{region.nameAr}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Desktop View - Enhanced Grid with Cards */}
            <div className="hidden md:block">
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {saudiRegions.slice(0, isExpanded ? saudiRegions.length : 8).map((region) => (
                  <Card
                    key={region.id}
                    className={`cursor-pointer transition-all duration-300 overflow-hidden ${
                      selectedRegion === region.id 
                        ? "border-2 border-green-500 shadow-xl transform scale-105" 
                        : "border border-gray-200 hover:border-green-300 hover:shadow-lg"
                    }`}
                    onClick={() => onRegionChange(region.id)}
                  >
                    {/* صورة المنطقة */}
                    <div className="relative h-32 overflow-hidden">
                      <img 
                        src={region.imageUrl} 
                        alt={region.nameAr}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-2 right-2">
                        <div 
                          className="w-3 h-3 rounded-full border-2 border-white shadow-lg"
                          style={{ backgroundColor: region.color }}
                        />
                      </div>
                      <div className="absolute bottom-2 right-2">
                        <MapPin className="w-4 h-4 text-white drop-shadow-lg" />
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className={`font-bold text-base mb-2 text-right ${
                        selectedRegion === region.id ? 'text-green-800' : 'text-gray-800'
                      }`}>
                        {region.nameAr}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-3 text-right">
                        {region.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1 justify-end">
                          {region.vehicleTypes.slice(0, 2).map((type, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className={`text-xs ${
                                selectedRegion === region.id 
                                  ? 'bg-green-100 text-green-700 border-green-200' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {type}
                            </Badge>
                          ))}
                          {region.vehicleTypes.length > 2 && (
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                selectedRegion === region.id 
                                  ? 'border-green-300 text-green-700' 
                                  : 'border-gray-300 text-gray-600'
                              }`}
                            >
                              +{region.vehicleTypes.length - 2}
                            </Badge>
                          )}
                        </div>
                        
                        {selectedRegion === region.id && (
                          <div className="text-center">
                            <Badge className="bg-green-600 text-white text-xs px-3 py-1">
                              منطقة مختارة
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Show More/Less Button */}
              {saudiRegions.length > 8 && (
                <div className="text-center mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <ChevronDown 
                      className={`w-4 h-4 mr-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                    />
                    {isExpanded ? "عرض أقل" : "عرض جميع المناطق"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Selected Region Info */}
          {selectedRegion !== "all" && (
            <div className="mt-8 p-6 bg-gradient-to-r from-white to-green-50 rounded-xl border-2 border-green-200 shadow-md">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center mb-3">
                  <div 
                    className="w-8 h-8 rounded-full mr-3"
                    style={{ backgroundColor: selectedRegionData.color }}
                  />
                  <h3 className="font-bold text-2xl text-gray-800">
                    {selectedRegionData.nameAr}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">
                  {selectedRegionData.description}
                </p>
                <Badge className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 text-sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  منطقة مختارة - عرض المحتوى حسب هذه المنطقة
                </Badge>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-green-100">
                <h4 className="font-medium text-gray-800 mb-3 text-center">
                  أنواع المركبات والخدمات المتاحة:
                </h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {selectedRegionData.vehicleTypes.map((type, index) => (
                    <Badge 
                      key={index} 
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  الآن ستظهر لك المركبات والخدمات المتاحة في {selectedRegionData.nameAr} فقط
                </p>
              </div>
            </div>
          )}
          
          {selectedRegion === "all" && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
              <h4 className="font-medium text-blue-800 mb-2">
                عرض جميع المناطق
              </h4>
              <p className="text-sm text-blue-600">
                يتم عرض المركبات والخدمات من جميع مناطق المملكة العربية السعودية
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}