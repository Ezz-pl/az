import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Star } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/navigation";

interface Region {
  id: number;
  name: string;
  nameAr: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  imageUrl?: string;
  active: boolean;
}

export default function Regions() {
  const { data: regions, isLoading } = useQuery<Region[]>({
    queryKey: ["/api/regions"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-900">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            استكشف المناطق السعودية
          </h1>
          <h2 className="text-2xl text-gray-600 dark:text-gray-300 mb-6">
            Explore Saudi Regions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            اكتشف أجمل المناطق في المملكة العربية السعودية وتمتع بتجارب مذهلة في الطبيعة والتراث
          </p>
        </div>

        {/* Regions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regions?.map((region) => (
            <Card key={region.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-green-400 to-blue-500 relative">
                {region.imageUrl ? (
                  <img 
                    src={region.imageUrl} 
                    alt={region.nameAr}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                    <MapPin className="w-16 h-16 text-white" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300" />
                <Badge className="absolute top-4 right-4 bg-white/90 text-green-800">
                  {region.active ? "متاح" : "قريباً"}
                </Badge>
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl text-right">
                  {region.nameAr}
                </CardTitle>
                <CardDescription className="text-left text-gray-600 dark:text-gray-300">
                  {region.name}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-right leading-relaxed">
                  {region.descriptionAr || region.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Link href={`/regions/${region.slug}`}>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      استكشف المنطقة
                    </Button>
                  </Link>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">منطقة مميزة</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
            <CardContent className="py-12">
              <h3 className="text-3xl font-bold mb-4">هل أنت مقدم خدمات؟</h3>
              <p className="text-xl mb-6 opacity-90">
                انضم إلى شبكة الشركاء لدينا وابدأ في تقديم خدماتك في منطقتك
              </p>
              <Link href="/partners/register">
                <Button size="lg" variant="secondary" className="text-green-700">
                  سجل كشريك
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}