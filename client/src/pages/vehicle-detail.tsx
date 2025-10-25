import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import BookingModal from "@/components/booking-modal";
import ReviewSystem from "@/components/review-system";
import LocationMap from "@/components/location-map";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { MapPin, Users, Star, Calendar, Shield, Clock, DollarSign } from "lucide-react";
import type { Vehicle } from "@shared/schema";

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  const { data: vehicle, isLoading } = useQuery<Vehicle>({
    queryKey: [`/api/vehicles/${id}`]
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="w-full h-96 rounded-xl mb-6" />
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-2/3 mb-6" />
                <div className="space-y-4">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-8 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-32 w-full" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">المركبة غير موجودة</h1>
            <p className="text-gray-600">لم يتم العثور على المركبة المطلوبة</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Vehicle Image */}
              <div className="relative rounded-xl overflow-hidden mb-6">
                <img 
                  src={vehicle.imageUrl} 
                  alt={vehicle.nameAr}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-primary text-primary-foreground">
                    {vehicle.categoryAr}
                  </Badge>
                </div>
              </div>

              {/* Vehicle Title and Rating */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-3xl font-bold">{vehicle.nameAr}</h1>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{vehicle.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{vehicle.locationAr}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>يتسع لـ {vehicle.capacity} أشخاص</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>وصف المركبة</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{vehicle.descriptionAr}</p>
                </CardContent>
              </Card>

              {/* Features */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>المميزات المتاحة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {vehicle.featuresAr?.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Policies */}
              <Card>
                <CardHeader>
                  <CardTitle>شروط الاستئجار</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">التأمين</h4>
                        <p className="text-sm text-gray-600">جميع المركبات مؤمنة بالكامل ضد الأضرار والحوادث</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">مواعيد الاستلام</h4>
                        <p className="text-sm text-gray-600">يمكن استلام المركبة من الساعة 9 صباحاً حتى 6 مساءً</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">الدفع</h4>
                        <p className="text-sm text-gray-600">يجب دفع 50% من قيمة الحجز مقدماً والباقي عند الاستلام</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>احجز الآن</span>
                    <Badge variant={vehicle.available ? "default" : "secondary"}>
                      {vehicle.available ? "متاح" : "غير متاح"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        {vehicle.pricePerDay} ريال
                      </div>
                      <div className="text-sm text-gray-600">لكل يوم</div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">السعر الأساسي</span>
                        <span className="font-semibold">{vehicle.pricePerDay} ريال</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">رسوم الخدمة</span>
                        <span className="font-semibold">مجاناً</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">التأمين</span>
                        <span className="font-semibold">مشمول</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <Button 
                      className="w-full bg-accent hover:bg-accent/90"
                      onClick={() => setIsBookingModalOpen(true)}
                      disabled={!vehicle.available}
                    >
                      <Calendar className="w-4 h-4 ml-2" />
                      {vehicle.available ? "احجز الآن" : "غير متاح"}
                    </Button>
                    
                    <div className="text-center text-sm text-gray-500">
                      لن يتم خصم أي مبلغ حتى تأكيد الحجز
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* نظام المواقع والخرائط */}
          <div className="mt-12">
            <LocationMap 
              vehicleId={vehicle.id} 
              regionId={1} 
              height="500px"
            />
          </div>

          {/* نظام التقييمات */}
          <div className="mt-12">
            <ReviewSystem
              serviceType="vehicle"
              serviceId={vehicle.id}
              serviceName={vehicle.nameAr}
              allowReviews={true}
            />
          </div>
        </div>
      </div>
      
      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        vehicle={vehicle}
      />
      
      <Footer />
    </div>
  );
}
