import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Shield } from "lucide-react";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import VehicleCategories from "@/components/vehicle-categories";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import FeaturedVehicles from "@/components/featured-vehicles";
import { Recommendations } from "@/components/recommendations";

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState("all");

  return (
    <div className="min-h-screen">
      <Navigation />
      <Header />
      
      <HeroSection selectedRegion={selectedRegion} onRegionChange={setSelectedRegion} />
      
      <VehicleCategories selectedRegion={selectedRegion} />
      <FeaturedVehicles selectedRegion={selectedRegion} />
      
      {/* قسم التوصيات الذكية */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <Recommendations
            limit={6}
            title="Smart Recommendations"
            titleAr="توصيات ذكية مخصصة لك"
          />
        </div>
      </section>
      
      {/* قسم خدمات الضيافة */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              خدمات الضيافة والطعام
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              خدمات طعام وضيافة متكاملة لرحلاتك ومناسباتك الخاصة
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* خدمات الضيافة */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-8 h-8 text-orange-600 dark:text-orange-400">🍽️</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  خدمات الضيافة
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  خدمات ضيافة شاملة للمناسبات والرحلات بأعلى معايير الجودة
                </p>
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                  <p className="text-orange-800 dark:text-orange-200 text-sm">
                    لا توجد خدمات متاحة حالياً. سجل كمقدم خدمة لإضافة عروضك.
                  </p>
                </div>
              </div>
            </div>
            
            {/* كافيه متنقل */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-8 h-8 text-purple-600 dark:text-purple-400">☕</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  كافيه متنقل
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  خدمة قهوة ومشروبات متنقلة تصل إليك في أي مكان
                </p>
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                  <p className="text-purple-800 dark:text-purple-200 text-sm">
                    لا توجد خدمات متاحة حالياً. سجل كمقدم خدمة لإضافة عروضك.
                  </p>
                </div>
              </div>
            </div>
            
            {/* أكل المجموعات */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-8 h-8 text-green-600 dark:text-green-400">🍱</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  أكل المجموعات
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  وجبات جماعية مخصصة للرحلات والمجموعات الكبيرة
                </p>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    لا توجد خدمات متاحة حالياً. سجل كمقدم خدمة لإضافة عروضك.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* رسالة عدم توفر مركبات */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              لا توجد مركبات متاحة حالياً
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              نحن نعمل على إضافة شركاء جدد لتوفير أفضل التجارب السياحية. 
              إذا كنت تملك مركبات سياحية، يمكنك التسجيل كشريك معنا من خلال رابط التسجيل أسفل الصفحة.
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}