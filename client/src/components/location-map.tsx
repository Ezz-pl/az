import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Clock, Phone, Car, Utensils, ChefHat, Fuel, Users, WifiIcon } from "lucide-react";

interface LocationData {
  id: number;
  name: string;
  nameAr: string;
  address: string;
  addressAr: string;
  latitude: number;
  longitude: number;
  type: "pickup_point" | "destination" | "service_area";
  serviceTypes: string[];
  amenities: string[];
  amenitiesAr: string[];
  accessible: boolean;
  workingHours?: string;
  contactPhone?: string;
  images?: string[];
  verified: boolean;
}

interface LocationMapProps {
  vehicleId?: number;
  partnerId?: number;
  regionId?: number;
  showServiceAreas?: boolean;
  height?: string;
}

const amenityIcons: Record<string, any> = {
  parking: Car,
  restrooms: Users,
  fuel_station: Fuel,
  restaurant: Utensils,
  wifi: WifiIcon,
  cooking: ChefHat
};

const typeLabels = {
  pickup_point: "نقطة استلام",
  destination: "وجهة سياحية", 
  service_area: "منطقة خدمة"
};

const typeColors = {
  pickup_point: "bg-blue-500",
  destination: "bg-green-500",
  service_area: "bg-purple-500"
};

export default function LocationMap({ vehicleId, partnerId, regionId, showServiceAreas = false, height = "400px" }: LocationMapProps) {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 24.7136, lng: 46.6753 }); // الرياض
  const [isLoading, setIsLoading] = useState(true);

  // محاكاة بيانات المواقع (في التطبيق الحقيقي ستأتي من API)
  useEffect(() => {
    const mockLocations: LocationData[] = [
      {
        id: 1,
        name: "Desert Adventure Base - Riyadh",
        nameAr: "قاعدة مغامرات الصحراء - الرياض",
        address: "Exit 5, Riyadh-Dammam Highway",
        addressAr: "المخرج 5، طريق الرياض-الدمام",
        latitude: 24.7136,
        longitude: 46.6753,
        type: "pickup_point",
        serviceTypes: ["vehicle"],
        amenities: ["parking", "restrooms", "fuel_station"],
        amenitiesAr: ["موقف سيارات", "دورات مياه", "محطة وقود"],
        accessible: true,
        workingHours: "24/7",
        contactPhone: "+966 11 123 4567",
        verified: true
      },
      {
        id: 2,
        name: "Red Sea Marina - Jeddah",
        nameAr: "مارينا البحر الأحمر - جدة",
        address: "Corniche Road, North Obhur",
        addressAr: "طريق الكورنيش، أبحر الشمالية",
        latitude: 21.6971,
        longitude: 39.1039,
        type: "pickup_point",
        serviceTypes: ["vehicle", "catering"],
        amenities: ["parking", "restrooms", "restaurant", "wifi"],
        amenitiesAr: ["موقف سيارات", "دورات مياه", "مطعم", "واي فاي"],
        accessible: true,
        workingHours: "6:00 AM - 10:00 PM",
        contactPhone: "+966 12 234 5678",
        verified: true
      },
      {
        id: 3,
        name: "Asir Mountains Camp",
        nameAr: "مخيم جبال عسير",
        address: "Abha-Khamis Mushait Road",
        addressAr: "طريق أبها-خميس مشيط",
        latitude: 18.2465,
        longitude: 42.5047,
        type: "destination",
        serviceTypes: ["vehicle", "catering", "cooking"],
        amenities: ["parking", "restrooms", "cooking", "wifi"],
        amenitiesAr: ["موقف سيارات", "دورات مياه", "منطقة طبخ", "واي فاي"],
        accessible: false,
        workingHours: "Sunrise to Sunset",
        verified: true
      },
      {
        id: 4,
        name: "Eastern Province Service Hub",
        nameAr: "مركز خدمات المنطقة الشرقية",
        address: "King Fahd Road, Dammam",
        addressAr: "طريق الملك فهد، الدمام",
        latitude: 26.4207,
        longitude: 50.0888,
        type: "service_area",
        serviceTypes: ["catering", "cooking"],
        amenities: ["parking", "restrooms", "restaurant", "cooking"],
        amenitiesAr: ["موقف سيارات", "دورات مياه", "مطعم", "منطقة طبخ"],
        accessible: true,
        workingHours: "5:00 AM - 11:00 PM",
        contactPhone: "+966 13 345 6789",
        verified: true
      },
      {
        id: 5,
        name: "Hail Adventure Point",
        nameAr: "نقطة مغامرات حائل",
        address: "Aja Mountains Access Road",
        addressAr: "طريق الوصول لجبال أجا",
        latitude: 27.5114,
        longitude: 41.7208,
        type: "pickup_point",
        serviceTypes: ["vehicle"],
        amenities: ["parking", "restrooms", "fuel_station"],
        amenitiesAr: ["موقف سيارات", "دورات مياه", "محطة وقود"],
        accessible: true,
        workingHours: "7:00 AM - 7:00 PM",
        contactPhone: "+966 16 456 7890",
        verified: true
      }
    ];

    // تصفية حسب المعايير
    let filteredLocations = mockLocations;
    
    if (regionId) {
      // تصفية حسب المنطقة (محاكاة)
      filteredLocations = filteredLocations.filter(loc => {
        if (regionId === 1) return loc.latitude > 24 && loc.latitude < 26; // الرياض
        if (regionId === 2) return loc.latitude > 21 && loc.latitude < 22; // مكة
        return true;
      });
    }

    if (vehicleId && !showServiceAreas) {
      filteredLocations = filteredLocations.filter(loc => 
        loc.serviceTypes.includes("vehicle") && 
        (loc.type === "pickup_point" || loc.type === "destination")
      );
    }

    if (partnerId && showServiceAreas) {
      filteredLocations = filteredLocations.filter(loc => 
        loc.serviceTypes.includes("catering") || loc.serviceTypes.includes("cooking")
      );
    }

    setLocations(filteredLocations);
    
    // تحديد مركز الخريطة
    if (filteredLocations.length > 0) {
      const avgLat = filteredLocations.reduce((sum, loc) => sum + loc.latitude, 0) / filteredLocations.length;
      const avgLng = filteredLocations.reduce((sum, loc) => sum + loc.longitude, 0) / filteredLocations.length;
      setMapCenter({ lat: avgLat, lng: avgLng });
    }

    setIsLoading(false);
  }, [vehicleId, partnerId, regionId, showServiceAreas]);

  // فتح الخرائط الخارجية
  const openInMaps = (location: LocationData) => {
    const query = encodeURIComponent(`${location.nameAr}, ${location.addressAr}`);
    const coords = `${location.latitude},${location.longitude}`;
    
    // محاولة فتح خرائط Google أو Apple حسب الجهاز
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${coords}`;
    const appleMapsUrl = `https://maps.apple.com/?q=${query}&ll=${coords}`;
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const url = isIOS ? appleMapsUrl : googleMapsUrl;
    
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>جاري تحميل المواقع...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* خريطة تفاعلية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <MapPin className="w-5 h-5" />
            المواقع والخرائط
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* محاكاة الخريطة */}
          <div 
            className="relative bg-gradient-to-br from-blue-100 to-green-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
            style={{ height }}
          >
            <div className="text-center p-8">
              <MapPin className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">خريطة تفاعلية</h3>
              <p className="text-gray-600 mb-4">
                سيتم عرض الخريطة التفاعلية هنا مع جميع المواقع المتاحة
              </p>
              <p className="text-sm text-gray-500">
                المركز: {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
              </p>
              
              {/* نقاط المواقع المحاكاة */}
              <div className="grid grid-cols-3 gap-4 mt-6 max-w-md mx-auto">
                {locations.slice(0, 6).map((location, index) => (
                  <button
                    key={location.id}
                    onClick={() => setSelectedLocation(location)}
                    className={`w-4 h-4 rounded-full ${typeColors[location.type]} animate-pulse shadow-lg`}
                    title={location.nameAr}
                    style={{
                      position: 'relative',
                      left: `${(index % 3) * 30 - 30}px`,
                      top: `${Math.floor(index / 3) * 30 - 15}px`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* قائمة المواقع */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((location) => (
          <Card 
            key={location.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedLocation?.id === location.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedLocation(location)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 text-right">
                  <h3 className="font-bold text-lg mb-1">{location.nameAr}</h3>
                  <p className="text-sm text-gray-600 mb-2">{location.addressAr}</p>
                  
                  <div className="flex items-center gap-2 justify-end mb-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${typeColors[location.type]} text-white border-0`}
                    >
                      {typeLabels[location.type]}
                    </Badge>
                    
                    {location.verified && (
                      <Badge variant="secondary" className="text-xs">
                        ✓ مؤكد
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className={`w-3 h-3 rounded-full ${typeColors[location.type]} mt-1`} />
              </div>

              {/* معلومات إضافية */}
              <div className="space-y-2">
                {location.workingHours && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{location.workingHours}</span>
                  </div>
                )}

                {location.contactPhone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{location.contactPhone}</span>
                  </div>
                )}

                {/* المرافق */}
                <div className="flex flex-wrap gap-1 justify-end">
                  {location.amenities.slice(0, 4).map((amenity, index) => {
                    const IconComponent = amenityIcons[amenity];
                    return IconComponent ? (
                      <div 
                        key={amenity}
                        className="p-1 bg-gray-100 rounded"
                        title={location.amenitiesAr[index] || amenity}
                      >
                        <IconComponent className="w-3 h-3 text-gray-600" />
                      </div>
                    ) : null;
                  })}
                  {location.amenities.length > 4 && (
                    <div className="p-1 bg-gray-100 rounded text-xs text-gray-600">
                      +{location.amenities.length - 4}
                    </div>
                  )}
                </div>

                {/* أزرار الإجراءات */}
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      openInMaps(location);
                    }}
                    className="flex-1 text-xs"
                  >
                    <Navigation className="w-3 h-3 ml-1" />
                    توجيه
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs"
                  >
                    <MapPin className="w-3 h-3 ml-1" />
                    تفاصيل
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* تفاصيل الموقع المحدد */}
      {selectedLocation && (
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-right">
              <MapPin className="w-5 h-5 text-blue-500" />
              {selectedLocation.nameAr}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-right">
                <h4 className="font-medium mb-3">معلومات الموقع</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">العنوان:</span> {selectedLocation.addressAr}</p>
                  <p><span className="font-medium">النوع:</span> {typeLabels[selectedLocation.type]}</p>
                  {selectedLocation.workingHours && (
                    <p><span className="font-medium">ساعات العمل:</span> {selectedLocation.workingHours}</p>
                  )}
                  {selectedLocation.contactPhone && (
                    <p><span className="font-medium">الهاتف:</span> {selectedLocation.contactPhone}</p>
                  )}
                  <p><span className="font-medium">إمكانية الوصول:</span> {selectedLocation.accessible ? "متاح" : "غير متاح"}</p>
                </div>
              </div>

              <div className="text-right">
                <h4 className="font-medium mb-3">المرافق المتوفرة</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedLocation.amenitiesAr.map((amenity, index) => {
                    const IconComponent = amenityIcons[selectedLocation.amenities[index]];
                    return (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        {IconComponent && <IconComponent className="w-4 h-4 text-green-600" />}
                        <span>{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={() => openInMaps(selectedLocation)} className="flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                فتح في الخرائط
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSelectedLocation(null)}
              >
                إغلاق التفاصيل
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {locations.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">لا توجد مواقع متاحة</h3>
            <p className="text-gray-500">
              لم يتم العثور على مواقع في هذه المنطقة أو للخدمة المحددة
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}