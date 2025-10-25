import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  Car, 
  Calendar, 
  DollarSign, 
  Users, 
  Star,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Settings,
  LogOut
} from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

interface Partner {
  id: number;
  businessName: string;
  businessNameAr: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  isActive: boolean;
  rating: number;
  totalReviews: number;
  createdAt: string;
}

interface PartnerStats {
  totalBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  monthlyRevenue: number;
  averageRating: number;
  totalVehicles: number;
  activeVehicles: number;
}

interface Booking {
  id: number;
  bookingNumber: string;
  customerName: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export default function HostPortal() {
  const [, navigate] = useLocation();
  const [partner, setPartner] = useState<Partner | null>(null);

  // التحقق من تسجيل الدخول
  useEffect(() => {
    const token = localStorage.getItem('partner_token');
    const partnerData = localStorage.getItem('partner_data');
    
    if (!token || !partnerData) {
      navigate('/partner-login');
      return;
    }

    try {
      const parsedPartner = JSON.parse(partnerData);
      setPartner(parsedPartner);
    } catch (error) {
      console.error('Error parsing partner data:', error);
      navigate('/partner-login');
    }
  }, [navigate]);

  // جلب إحصائيات الشريك
  const { data: stats } = useQuery<PartnerStats>({
    queryKey: ["/api/partners/stats"],
    enabled: !!partner,
  });

  // جلب حجوزات الشريك
  const { data: bookings } = useQuery<Booking[]>({
    queryKey: ["/api/partners/bookings"],
    enabled: !!partner,
  });

  // جلب مركبات الشريك
  const { data: vehicles } = useQuery({
    queryKey: ["/api/partners/vehicles"],
    enabled: !!partner,
  });

  const handleLogout = () => {
    localStorage.removeItem('partner_token');
    localStorage.removeItem('partner_data');
    navigate('/');
  };

  if (!partner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                بوابة الشريك
              </h1>
              <p className="text-gray-600 mt-1">
                مرحباً {partner.contactName} - {partner.businessNameAr}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={partner.status === 'approved' ? 'default' : 'secondary'}>
                {partner.status === 'approved' ? 'مفعل' : partner.status}
              </Badge>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 ml-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي الحجوزات</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalBookings || 0}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">الإيرادات الشهرية</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.monthlyRevenue || 0} ر.س</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">التقييم</p>
                    <p className="text-2xl font-bold text-gray-900">{partner.rating}/5</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">المركبات النشطة</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.activeVehicles || 0}</p>
                  </div>
                  <Car className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="dashboard">لوحة التحكم</TabsTrigger>
              <TabsTrigger value="bookings">الحجوزات</TabsTrigger>
              <TabsTrigger value="vehicles">المركبات</TabsTrigger>
              <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
              <TabsTrigger value="analytics">التحليلات</TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Bookings */}
                <Card>
                  <CardHeader>
                    <CardTitle>أحدث الحجوزات</CardTitle>
                    <CardDescription>آخر 5 حجوزات تم استلامها</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {bookings && bookings.length > 0 ? (
                      <div className="space-y-4">
                        {bookings.slice(0, 5).map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">{booking.customerName}</p>
                              <p className="text-sm text-gray-600">{booking.vehicleName}</p>
                            </div>
                            <div className="text-left">
                              <p className="font-medium">{booking.totalPrice} ر.س</p>
                              <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                                {booking.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>لا توجد حجوزات حتى الآن</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>إحصائيات سريعة</CardTitle>
                    <CardDescription>ملخص الأداء الشهري</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">الحجوزات المعلقة</span>
                      <span className="font-medium">{stats?.pendingBookings || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">إجمالي الإيرادات</span>
                      <span className="font-medium">{stats?.totalRevenue || 0} ر.س</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">عدد التقييمات</span>
                      <span className="font-medium">{partner.totalReviews}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">معدل الإشغال</span>
                      <span className="font-medium">75%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>إدارة الحجوزات</CardTitle>
                  <CardDescription>جميع الحجوزات الخاصة بمركباتك</CardDescription>
                </CardHeader>
                <CardContent>
                  {bookings && bookings.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-right p-3">رقم الحجز</th>
                            <th className="text-right p-3">العميل</th>
                            <th className="text-right p-3">المركبة</th>
                            <th className="text-right p-3">التاريخ</th>
                            <th className="text-right p-3">المبلغ</th>
                            <th className="text-right p-3">الحالة</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.map((booking) => (
                            <tr key={booking.id} className="border-b">
                              <td className="p-3">{booking.bookingNumber}</td>
                              <td className="p-3">{booking.customerName}</td>
                              <td className="p-3">{booking.vehicleName}</td>
                              <td className="p-3">{new Date(booking.startDate).toLocaleDateString('ar-SA')}</td>
                              <td className="p-3">{booking.totalPrice} ر.س</td>
                              <td className="p-3">
                                <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                                  {booking.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">لا توجد حجوزات</h3>
                      <p>سيظهر هنا جميع الحجوزات الخاصة بمركباتك</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Vehicles Tab */}
            <TabsContent value="vehicles">
              <Card>
                <CardHeader>
                  <CardTitle>إدارة المركبات</CardTitle>
                  <CardDescription>المركبات المسجلة في حسابك</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <Car className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">لا توجد مركبات مسجلة</h3>
                    <p className="mb-4">لم يتم تسجيل أي مركبات في حسابك حتى الآن</p>
                    <Button>إضافة مركبة جديدة</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>معلومات الملف الشخصي</CardTitle>
                  <CardDescription>بيانات الشريك والشركة</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">اسم المسؤول</label>
                        <p className="text-gray-900 mt-1">{partner.contactName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">اسم الشركة</label>
                        <p className="text-gray-900 mt-1">{partner.businessNameAr}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                        <p className="text-gray-900 mt-1">{partner.email}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">رقم الجوال</label>
                        <p className="text-gray-900 mt-1">{partner.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">العنوان</label>
                        <p className="text-gray-900 mt-1">{partner.address}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">تاريخ الانضمام</label>
                        <p className="text-gray-900 mt-1">
                          {new Date(partner.createdAt).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t">
                    <Button className="ml-3">تعديل البيانات</Button>
                    <Button variant="outline">تغيير كلمة المرور</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>تحليلات الأداء</CardTitle>
                  <CardDescription>إحصائيات مفصلة عن أداء مركباتك</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">التحليلات غير متاحة حالياً</h3>
                    <p>سيتم توفير تحليلات مفصلة قريباً</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}