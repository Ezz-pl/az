import { Card, CardContent } from "@/components/ui/card";
import { Shield, Clock, DollarSign, Star, Users, Car } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "أمان وموثوقية",
    description: "جميع مركباتنا مفحوصة ومؤمنة بالكامل لضمان سلامتك",
    color: "text-primary"
  },
  {
    icon: Clock,
    title: "متاح 24/7",
    description: "خدمة العملاء متاحة على مدار الساعة لمساعدتك",
    color: "text-secondary"
  },
  {
    icon: DollarSign,
    title: "أسعار تنافسية",
    description: "أفضل الأسعار مع خيارات دفع مرنة ومتنوعة",
    color: "text-accent"
  },
  {
    icon: Star,
    title: "خدمة مميزة",
    description: "نقدم أفضل تجربة استئجار للمركبات الترفيهية",
    color: "text-yellow-500"
  },
  {
    icon: Users,
    title: "فريق خبراء",
    description: "فريق من الخبراء لمساعدتك في اختيار المركبة المناسبة",
    color: "text-green-500"
  },
  {
    icon: Car,
    title: "أسطول متنوع",
    description: "مجموعة واسعة من المركبات لتناسب جميع أنواع المغامرات",
    color: "text-blue-500"
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-neutral">لماذا تختار رحلاتي؟</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow card-hover">
              <CardContent className="p-6">
                <div className={`w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 ${feature.color}`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-neutral">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
