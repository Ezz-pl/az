import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star, Mountain, Waves, TreePine } from "lucide-react";

const destinations = [
  {
    id: 1,
    name: "جبل المونور",
    nameAr: "جبل المونور",
    description: "A majestic mountain offering breathtaking views and challenging trails",
    descriptionAr: "جبل مهيب يوفر مناظر خلابة ومسارات مثيرة للتحدي",
    type: "mountain",
    typeAr: "جبل",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    difficulty: "moderate",
    difficultyAr: "متوسط",
    rating: 4.8,
    features: ["Mountain Climbing", "Scenic Views", "Photography"],
    featuresAr: ["تسلق الجبال", "مناظر خلابة", "التصوير"],
    bestTime: "October to March",
    bestTimeAr: "أكتوبر إلى مارس"
  },
  {
    id: 2,
    name: "جبال أجا",
    nameAr: "جبال أجا",
    description: "Historic mountain range with ancient inscriptions and stunning landscapes",
    descriptionAr: "سلسلة جبال تاريخية مع نقوش قديمة ومناظر طبيعية مذهلة",
    type: "mountain",
    typeAr: "جبل",
    imageUrl: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=600&fit=crop",
    difficulty: "easy",
    difficultyAr: "سهل",
    rating: 4.9,
    features: ["Ancient Inscriptions", "Easy Trails", "Historical Sites"],
    featuresAr: ["نقوش قديمة", "مسارات سهلة", "مواقع تاريخية"],
    bestTime: "November to February",
    bestTimeAr: "نوفمبر إلى فبراير"
  },
  {
    id: 3,
    name: "سد السلف",
    nameAr: "سد السلف",
    description: "Beautiful reservoir perfect for fishing and water activities",
    descriptionAr: "سد جميل مثالي للصيد والأنشطة المائية",
    type: "reservoir",
    typeAr: "سد",
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
    difficulty: "easy",
    difficultyAr: "سهل",
    rating: 4.7,
    features: ["Fishing", "Water Activities", "Picnic Areas"],
    featuresAr: ["الصيد", "الأنشطة المائية", "مناطق النزهة"],
    bestTime: "All year round",
    bestTimeAr: "طوال العام"
  },
  {
    id: 4,
    name: "منازل حاتم الطائي",
    nameAr: "منازل حاتم الطائي",
    description: "Historic ruins of the famous Arab poet known for his generosity",
    descriptionAr: "أطلال تاريخية للشاعر العربي المشهور بكرمه",
    type: "historical",
    typeAr: "تاريخي",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    difficulty: "easy",
    difficultyAr: "سهل",
    rating: 4.6,
    features: ["Historical Ruins", "Cultural Heritage", "Photography"],
    featuresAr: ["أطلال تاريخية", "تراث ثقافي", "التصوير"],
    bestTime: "October to April",
    bestTimeAr: "أكتوبر إلى أبريل"
  }
];

const typeIcons = {
  mountain: Mountain,
  reservoir: Waves,
  historical: TreePine,
};

const difficultyColors = {
  easy: "bg-green-100 text-green-800",
  moderate: "bg-yellow-100 text-yellow-800",
  challenging: "bg-red-100 text-red-800",
};

interface DestinationSuggestionsProps {
  region?: string;
  className?: string;
}

export default function DestinationSuggestions({ region = "hail", className = "" }: DestinationSuggestionsProps) {
  const getDifficultyColor = (difficulty: string) => {
    return difficultyColors[difficulty as keyof typeof difficultyColors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className={`py-16 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            اقتراحات الوجهات السياحية
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            اكتشف أجمل المواقع السياحية في منطقة حائل واحجز سيارتك للوصول إليها
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {destinations.map((destination) => {
            const IconComponent = typeIcons[destination.type as keyof typeof typeIcons];
            
            return (
              <Card 
                key={destination.id}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="relative">
                  <img 
                    src={destination.imageUrl} 
                    alt={destination.nameAr}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className={getDifficultyColor(destination.difficulty)}>
                      {destination.difficultyAr}
                    </Badge>
                  </div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-full">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{destination.nameAr}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{destination.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {destination.descriptionAr}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>أفضل وقت للزيارة: {destination.bestTimeAr}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>{destination.typeAr}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {destination.featuresAr.slice(0, 2).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="bg-primary/10 p-3 rounded-lg text-center">
                    <p className="text-sm text-primary font-medium">
                      احجز سيارتك الآن للوصول إلى هذا الموقع
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-xl inline-block">
            <h3 className="text-2xl font-bold mb-2">هل تريد زيارة هذه الأماكن؟</h3>
            <p className="text-lg mb-4">احجز سيارتك الآن واستمتع بالمغامرة</p>
            <button className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              احجز الآن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}