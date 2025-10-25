import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Car, Eye, CheckCircle, Clock, XCircle } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

export default function PartnerDashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('partnerToken');
    const partner = localStorage.getItem('partner');
    
    if (!token || !partner) {
      window.location.href = '/partner-login';
      return;
    }
    
    setUser(JSON.parse(partner));
  }, []);

  // جلب إحصائيات الشريك
  const { data: stats } = useQuery({
    queryKey: ['/api/partners/stats'],
    enabled: !!user
  });

  // جلب مركبات الشريك
  const { data: vehicles = [] } = useQuery({
    queryKey: ['/api/partners/vehicles'],
    enabled: !!user,
    select: (data) => Array.isArray(data) ? data : []
  });

  const logout = () => {
    localStorage.removeItem('partnerToken');
    localStorage.removeItem('partner');
    window.location.href = '/partner-login';
  };

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">جاري التحميل...</div>;
  }

  const getStatusBadge = (isActive: boolean, isApproved: boolean) => {
    if (isApproved && isActive) {
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> معتمدة</Badge>;
    } else if (isApproved && !isActive) {
      return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> غير نشطة</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800"><Clock className="w-3 h-3 mr-1" /> قيد المراجعة</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم الشريك</h1>
            <p className="text-gray-600 mt-2">مرحباً {user.businessName}</p>
          </div>
          <Button onClick={logout} variant="outline">
            تسجيل خروج
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Car className="h-8 w-8 text-blue-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">إجمالي المركبات</p>
                  <p className="text-2xl font-bold">{vehicles?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">المركبات المعتمدة</p>
                  <p className="text-2xl font-bold">
                    {vehicles?.filter((v: any) => v.isApproved && v.isActive).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">قيد المراجعة</p>
                  <p className="text-2xl font-bold">
                    {vehicles?.filter((v: any) => !v.isApproved).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-purple-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">إجمالي المشاهدات</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="vehicles" className="space-y-6">
          <TabsList>
            <TabsTrigger value="vehicles">المركبات</TabsTrigger>
            <TabsTrigger value="bookings">الحجوزات</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>إدارة المركبات</CardTitle>
                    <CardDescription>
                      أضف وأدر مركباتك السياحية
                    </CardDescription>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    إضافة مركبة جديدة
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {vehicles && vehicles.length > 0 ? (
                  <div className="space-y-4">
                    {vehicles.map((vehicle: any) => (
                      <div key={vehicle.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{vehicle.nameAr || vehicle.name}</h3>
                            <p className="text-gray-600 text-sm mt-1">
                              {vehicle.descriptionAr || vehicle.description}
                            </p>
                            <div className="mt-2 space-x-4 space-x-reverse">
                              <span className="text-sm text-gray-500">
                                السعر: {vehicle.pricePerDay} ريال/يوم
                              </span>
                              <span className="text-sm text-gray-500">
                                الركاب: {vehicle.maxPassengers}
                              </span>
                            </div>
                          </div>
                          <div className="text-left">
                            {getStatusBadge(vehicle.isActive, vehicle.isApproved)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Car className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد مركبات</h3>
                    <p className="mt-1 text-sm text-gray-500">ابدأ بإضافة مركبتك الأولى</p>
                    <div className="mt-6">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        إضافة مركبة جديدة
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>الحجوزات</CardTitle>
                <CardDescription>
                  تابع حجوزات عملائك
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Clock className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد حجوزات</h3>
                  <p className="mt-1 text-sm text-gray-500">ستظهر الحجوزات هنا عند وصولها</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات الحساب</CardTitle>
                <CardDescription>
                  أدر معلومات حسابك وشركتك
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">اسم الشركة</label>
                    <p className="text-gray-900">{user.businessName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">البريد الإلكتروني</label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">رقم الهاتف</label>
                    <p className="text-gray-900">{user.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">حالة الحساب</label>
                    <div className="mt-1">
                      {user.status === 'approved' ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          معتمد
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Clock className="w-3 h-3 mr-1" />
                          قيد المراجعة
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}