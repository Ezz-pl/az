import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BookingModal from "./booking-modal";
import { Star, MapPin, Users } from "lucide-react";
import type { Vehicle } from "@shared/schema";

interface VehicleCardProps {
  vehicle: Vehicle;
  className?: string;
}

export default function VehicleCard({ vehicle, className = "" }: VehicleCardProps) {
  const [, setLocation] = useLocation();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleCardClick = () => {
    setLocation(`/vehicle/${vehicle.id}`);
  };

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookingModalOpen(true);
  };

  return (
    <>
      <Card 
        className={`overflow-hidden hover:shadow-xl transition-shadow cursor-pointer card-hover ${className}`}
        onClick={handleCardClick}
      >
        <div className="relative">
          <img 
            src={vehicle.imageUrl} 
            alt={vehicle.nameAr}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-4 right-4">
            <Badge className="bg-primary text-primary-foreground">
              {vehicle.categoryAr}
            </Badge>
          </div>
          {!vehicle.available && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Badge variant="secondary" className="text-lg">
                غير متاح
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-neutral">{vehicle.nameAr}</h3>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{vehicle.rating}</span>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4 line-clamp-2">{vehicle.descriptionAr}</p>
          
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{vehicle.locationAr}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{vehicle.capacity} أشخاص</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-right">
              <span className="text-2xl font-bold text-primary">{vehicle.pricePerDay}</span>
              <span className="text-gray-600"> ريال/يوم</span>
            </div>
            <Button 
              className="bg-accent hover:bg-accent/90 text-white btn-hover-scale"
              onClick={handleBookNow}
              disabled={!vehicle.available}
            >
              {vehicle.available ? "احجز الآن" : "غير متاح"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        vehicle={vehicle}
      />
    </>
  );
}
