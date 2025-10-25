import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* معلومات الشركة */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">منصة المغامرات السعودية</h3>
            <p className="text-gray-400 leading-relaxed">
              منصة شاملة لحجز أفضل المغامرات السياحية والترفيهية في جميع أنحاء المملكة العربية السعودية
            </p>
          </div>

          {/* الأقسام */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">الأقسام</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/vehicles" className="hover:text-white transition-colors">المركبات المتاحة</Link></li>
              <li><Link href="/regions" className="hover:text-white transition-colors">المناطق</Link></li>
              <li><Link href="/categories" className="hover:text-white transition-colors">التصنيفات</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">عن المنصة</Link></li>
            </ul>
          </div>

          {/* للشركاء */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">للشركاء</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/partner-register" className="hover:text-white transition-colors">سجل كشريك</Link></li>
              <li><Link href="/partner-login" className="hover:text-white transition-colors">دخول الشركاء</Link></li>
              <li><Link href="/host-portal" className="hover:text-white transition-colors">بوابة الشركاء</Link></li>
            </ul>
            
            <div className="pt-2 border-t border-gray-700">
              <h5 className="text-sm font-medium text-gray-300 mb-2">خدمات الضيافة</h5>
              <ul className="space-y-1 text-gray-400 text-sm">
                <li>• خدمات الضيافة</li>
                <li>• كافيه متنقل</li>
                <li>• أكل المجموعات</li>
              </ul>
            </div>
          </div>

          {/* تواصل معنا */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">تواصل معنا</h4>
            <div className="space-y-2 text-gray-400">
              <p>البريد الإلكتروني: info@saudi-adventures.com</p>
              <p>الهاتف: +966123456789</p>
              <p>واتساب: +966555123456</p>
              <p>المملكة العربية السعودية</p>
              <div className="pt-4 border-t border-gray-700 mt-4">
                <Link href="/admin-login" className="inline-block bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-xs font-medium transition-colors">
                  🛡️ إدارة المنصة
                </Link>
                <p className="text-xs text-gray-500 mt-1">للمدراء فقط</p>
              </div>
            </div>
          </div>
        </div>

        {/* خط الفصل */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 منصة المغامرات السعودية. جميع الحقوق محفوظة.
            </p>
            <div className="flex space-x-6 space-x-reverse">
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                الشروط والأحكام
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                سياسة الخصوصية
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}