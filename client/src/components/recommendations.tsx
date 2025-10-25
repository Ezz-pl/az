import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Star, Eye, Clock, MapPin } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface Recommendation {
  vehicleId: number;
  score: number;
  type: string;
  reason: string;
  metadata: any;
  vehicle: {
    id: number;
    name: string;
    nameAr: string;
    description: string;
    descriptionAr: string;
    pricePerDay: string;
    images: string[];
    rating: string;
    totalReviews: number;
    capacity: number;
    location: string;
    categoryId: number;
    regionId: number;
  };
}

interface RecommendationsProps {
  currentVehicleId?: number;
  categoryId?: number;
  regionId?: number;
  limit?: number;
  title?: string;
  titleAr?: string;
}

export function Recommendations({
  currentVehicleId,
  categoryId,
  regionId,
  limit = 6,
  title = "Recommended for You",
  titleAr = "موصى لك"
}: RecommendationsProps) {
  const [lang] = useState('ar'); // يمكن تغيير هذا حسب إعدادات المستخدم

  const { data: recommendations, isLoading, error } = useQuery({
    queryKey: ['recommendations', currentVehicleId, categoryId, regionId, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (currentVehicleId) params.append('vehicleId', currentVehicleId.toString());
      if (categoryId) params.append('categoryId', categoryId.toString());
      if (regionId) params.append('regionId', regionId.toString());
      params.append('limit', limit.toString());

      const response = await apiRequest(`GET`, `/api/recommendations?${params}`);
      return response.json();
    },
    enabled: true
  });

  // تتبع عرض التوصيات
  useEffect(() => {
    if (recommendations?.length) {
      recommendations.forEach(async (rec) => {
        try {
          await apiRequest('POST', `/api/recommendations/${rec.vehicleId}/shown`);
        } catch (error) {
          console.log('Failed to track recommendation view:', error);
        }
      });
    }
  }, [recommendations]);

  // تتبع النقر على مركبة
  const handleVehicleClick = async (rec: Recommendation) => {
    try {
      // تتبع النقر على التوصية
      await apiRequest('POST', `/api/recommendations/${rec.vehicleId}/clicked`);
      
      // تتبع التفاعل العام
      await apiRequest('POST', '/api/interactions/track', {
        vehicleId: rec.vehicleId,
        interactionType: 'click',
        source: 'recommendation',
        metadata: {
          recommendationType: rec.type,
          score: rec.score
        }
      });

      // الانتقال إلى صفحة المركبة
      window.location.href = `/vehicles/${rec.vehicleId}`;
    } catch (error) {
      console.error('Failed to track recommendation click:', error);
      // الانتقال حتى لو فشل التتبع
      window.location.href = `/vehicles/${rec.vehicleId}`;
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <div className="h-48 bg-gray-300 rounded-t-lg"></div>
            <CardHeader>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-300 rounded"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !recommendations?.length) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <Eye className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">
            {lang === 'ar' ? 'لا توجد توصيات متاحة حالياً' : 'No recommendations available'}
          </p>
          <p className="text-sm">
            {lang === 'ar' 
              ? 'قم بالبحث والتصفح لنتمكن من تقديم توصيات مخصصة لك'
              : 'Browse and search to get personalized recommendations'
            }
          </p>
        </div>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'similar': return 'bg-blue-100 text-blue-800';
      case 'trending': return 'bg-red-100 text-red-800';
      case 'personalized': return 'bg-green-100 text-green-800';
      case 'popular': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    if (lang === 'ar') {
      switch (type) {
        case 'similar': return 'مشابه';
        case 'trending': return 'رائج';
        case 'personalized': return 'مخصص';
        case 'popular': return 'شائع';
        default: return 'موصى به';
      }
    } else {
      switch (type) {
        case 'similar': return 'Similar';
        case 'trending': return 'Trending';
        case 'personalized': return 'For You';
        case 'popular': return 'Popular';
        default: return 'Recommended';
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {lang === 'ar' ? titleAr : title}
        </h2>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            ذكي
          </Badge>
          <Badge variant="outline" className="text-xs">
            {recommendations.length} توصية
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec) => (
          <Card 
            key={rec.vehicleId} 
            className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => handleVehicleClick(rec)}
          >
            {rec.vehicle.images?.[0] && (
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img
                  src={rec.vehicle.images[0]}
                  alt={lang === 'ar' ? rec.vehicle.nameAr : rec.vehicle.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge className={getTypeColor(rec.type)}>
                    {getTypeLabel(rec.type)}
                  </Badge>
                </div>
                {rec.score > 0.8 && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-yellow-100 text-yellow-800">
                      ⭐ مميز
                    </Badge>
                  </div>
                )}
              </div>
            )}

            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold line-clamp-1">
                {lang === 'ar' ? rec.vehicle.nameAr : rec.vehicle.name}
              </CardTitle>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" fill="currentColor" />
                  <span>{parseFloat(rec.vehicle.rating).toFixed(1)}</span>
                  <span>({rec.vehicle.totalReviews})</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{rec.vehicle.location}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {rec.reason}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-primary">
                  {parseInt(rec.vehicle.pricePerDay).toLocaleString()} ريال
                  <span className="text-sm font-normal text-gray-500">/يوم</span>
                </div>
                <Button 
                  size="sm" 
                  className="hover:bg-primary-dark transition-colors"
                >
                  عرض التفاصيل
                </Button>
              </div>

              {rec.metadata && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {rec.metadata.views && (
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{rec.metadata.views} مشاهدة</span>
                      </div>
                    )}
                    {rec.metadata.bookingCount && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{rec.metadata.bookingCount} حجز</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Recommendations;