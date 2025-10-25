import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Users,
  UserPlus,
  Settings,
  FileText,
  MapPin,
  Car,
  BookOpen,
  Calendar,
  Shield,
  LogOut,
  Edit3,
  Trash2,
  Check,
  X,
  Eye,
  Plus,
  CheckCircle,
  Building2,
  Activity,
  BarChart3
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";

interface Admin {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

interface DashboardStats {
  totalCustomers: number;
  totalPartners: number;
  totalVehicles: number;
  totalBookings: number;
  pendingPartners: number;
  pendingBookings: number;
}

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // التحقق من وجود التوكن
    const token = localStorage.getItem("admin_token");
    const adminData = localStorage.getItem("admin_user");
    
    if (!token || !adminData) {
      navigate("/admin-login");
      return;
    }

    try {
      setAdmin(JSON.parse(adminData));
      loadDashboardStats(token);
    } catch (error) {
      console.error("Error parsing admin data:", error);
      navigate("/admin-login");
    }
  }, [navigate]);

  const loadDashboardStats = async (token: string) => {
    try {
      const response = await apiRequest("GET", "/api/admin/dashboard", null, {
        Authorization: `Bearer ${token}`
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    toast({
      title: "تم تسجيل الخروج",
      description: "شكراً لك، إلى اللقاء!"
    });
    navigate("/admin-login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">لوحة الإدارة</h1>
                <p className="text-sm text-gray-500">مرحباً {admin.name}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              خروج
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 lg:grid-cols-7 gap-2 h-auto p-1">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 px-4 py-2">
              <Settings className="w-4 h-4" />
              الإحصائيات
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2 px-4 py-2">
              <Users className="w-4 h-4" />
              العملاء
            </TabsTrigger>
            <TabsTrigger value="partners" className="flex items-center gap-2 px-4 py-2">
              <UserPlus className="w-4 h-4" />
              الشركاء
            </TabsTrigger>
            <TabsTrigger value="regions" className="flex items-center gap-2 px-4 py-2">
              <MapPin className="w-4 h-4" />
              المناطق
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2 px-4 py-2">
              <Car className="w-4 h-4" />
              التصنيفات
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2 px-4 py-2">
              <FileText className="w-4 h-4" />
              المحتوى
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 px-4 py-2">
              <Settings className="w-4 h-4" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي العملاء</CardTitle>
                  <Users className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalCustomers || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي الشركاء</CardTitle>
                  <UserPlus className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalPartners || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.pendingPartners || 0} في انتظار الموافقة
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي المركبات</CardTitle>
                  <Car className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalVehicles || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي الحجوزات</CardTitle>
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalBookings || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.pendingBookings || 0} في انتظار التأكيد
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>مرحباً في لوحة الإدارة المتكاملة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  يمكنك من خلال هذه اللوحة إدارة جميع جوانب المنصة:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    إدارة العملاء والشركاء
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    تحرير المحتوى والنصوص
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    إدارة المناطق والتصنيفات
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    مراجعة وموافقة الطلبات
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Management Tab */}
          <TabsContent value="content" className="space-y-6">
            <ContentManager />
          </TabsContent>

          {/* Customer Management */}
          <TabsContent value="customers">
            <CustomerManager />
          </TabsContent>

          {/* Partner Management */}
          <TabsContent value="partners">
            <PartnerManager />
          </TabsContent>

          <TabsContent value="regions">
            <RegionManager />
          </TabsContent>

          {/* Category Management */}
          <TabsContent value="categories">
            <CategoryManager />
          </TabsContent>

          {/* Settings Management */}
          <TabsContent value="settings">
            <SettingsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Content Manager Component
function ContentManager() {
  const { toast } = useToast();
  const [content, setContent] = useState<any[]>([]);
  const [editingContent, setEditingContent] = useState<any>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await apiRequest("GET", "/api/admin/content", null, {
        Authorization: `Bearer ${token}`
      });

      if (response.ok) {
        const data = await response.json();
        setContent(data);
      }
    } catch (error) {
      console.error("Failed to load content:", error);
    }
  };

  const saveContent = async (key: string, data: any) => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await apiRequest("PUT", `/api/admin/content/${key}`, data, {
        Authorization: `Bearer ${token}`
      });

      if (response.ok) {
        toast({
          title: "تم الحفظ بنجاح",
          description: "تم تحديث المحتوى"
        });
        loadContent();
        setEditingContent(null);
      }
    } catch (error) {
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ التغييرات",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة المحتوى</h2>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          إضافة محتوى جديد
        </Button>
      </div>

      <div className="grid gap-6">
        {content.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">{item.key}</CardTitle>
                  {item.titleAr && <p className="text-sm text-gray-600 mt-1">{item.titleAr}</p>}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingContent(item)}
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 line-clamp-3">{item.contentAr}</p>
              <div className="flex justify-between items-center mt-4">
                <Badge variant={item.isActive ? "default" : "secondary"}>
                  {item.isActive ? "نشط" : "غير نشط"}
                </Badge>
                <p className="text-xs text-gray-500">
                  آخر تحديث: {new Date(item.updatedAt).toLocaleDateString('ar')}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingContent && (
        <ContentEditModal
          content={editingContent}
          onSave={saveContent}
          onClose={() => setEditingContent(null)}
        />
      )}
    </div>
  );
}

// Customer Manager Component
function CustomerManager() {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await apiRequest("GET", "/api/admin/customers", null, {
        Authorization: `Bearer ${token}`
      });
      
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error("Failed to load customers:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">جاري التحميل...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة العملاء</h2>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          إضافة عميل جديد
        </Button>
      </div>

      <div className="grid gap-4">
        {customers.map((customer) => (
          <Card key={customer.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="font-semibold">{customer.name}</h3>
                  <p className="text-sm text-gray-600">{customer.email}</p>
                  <p className="text-sm text-gray-600">{customer.phone}</p>
                  <Badge variant={customer.isActive ? "default" : "secondary"}>
                    {customer.isActive ? "نشط" : "غير نشط"}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500">
                  انضم في: {new Date(customer.createdAt).toLocaleDateString('ar')}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {customers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">لا يوجد عملاء مسجلون حتى الآن</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Partner Manager Component
function PartnerManager() {
  const { toast } = useToast();
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [loginCredentials, setLoginCredentials] = useState<any>(null);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await apiRequest("GET", "/api/admin/partners", null, {
        Authorization: `Bearer ${token}`
      });
      
      if (response.ok) {
        const data = await response.json();
        setPartners(data);
      }
    } catch (error) {
      console.error("Failed to load partners:", error);
    } finally {
      setLoading(false);
    }
  };

  const approvePartner = async (partnerId: number) => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await apiRequest("PUT", `/api/admin/partners/${partnerId}/approve`, null, {
        Authorization: `Bearer ${token}`
      });
      
      if (response.ok) {
        const result = await response.json();
        setLoginCredentials(result.loginCredentials);
        toast({
          title: "تم قبول الشريك بنجاح! ✅",
          description: result.message
        });
        loadPartners();
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء قبول الشريك",
        variant: "destructive"
      });
    }
  };

  const rejectPartner = async (partnerId: number, reason: string) => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await apiRequest("PUT", `/api/admin/partners/${partnerId}/reject`, 
        { reason }, 
        { Authorization: `Bearer ${token}` }
      );
      
      if (response.ok) {
        const result = await response.json();
        toast({
          title: "تم رفض الشريك",
          description: result.message
        });
        loadPartners();
        setSelectedPartner(null);
        setRejectReason("");
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء رفض الشريك",
        variant: "destructive"
      });
    }
  };

  if (loading) return <div className="text-center py-8">جاري التحميل...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة الشركاء</h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-yellow-600">
            بالانتظار: {partners.filter(p => p.status === 'pending').length}
          </Badge>
          <Badge variant="outline" className="text-green-600">
            مقبول: {partners.filter(p => p.status === 'approved').length}
          </Badge>
          <Badge variant="outline" className="text-red-600">
            مرفوض: {partners.filter(p => p.status === 'rejected').length}
          </Badge>
        </div>
      </div>

      {/* عرض بيانات الدخول للشريك المقبول حديثاً */}
      {loginCredentials && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <h4 className="font-semibold">بيانات الدخول للشريك:</h4>
              <p><strong>البريد الإلكتروني:</strong> {loginCredentials.email}</p>
              <p><strong>كلمة المرور:</strong> {loginCredentials.password}</p>
              <p className="text-sm text-green-700">{loginCredentials.message}</p>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setLoginCredentials(null)}
              >
                إغلاق
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {partners.map((partner) => (
          <Card key={partner.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{partner.businessNameAr || partner.businessName}</h3>
                    <Badge variant={partner.status === 'approved' ? 'default' : 
                                 partner.status === 'pending' ? 'secondary' : 'destructive'}>
                      {partner.status === 'approved' ? 'مقبول ومفعل' : 
                       partner.status === 'pending' ? 'بانتظار المراجعة' : 'مرفوض'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <p><strong>المسؤول:</strong> {partner.contactName}</p>
                    <p><strong>البريد:</strong> {partner.email}</p>
                    <p><strong>الجوال:</strong> {partner.phone}</p>
                    <p><strong>تاريخ التسجيل:</strong> {new Date(partner.createdAt).toLocaleDateString('ar')}</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 min-w-[120px]">
                  {partner.status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => approvePartner(partner.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        قبول وتفعيل
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => setSelectedPartner(partner)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        رفض
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {partners.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">لا يوجد شركاء مسجلون حتى الآن</p>
          </div>
        )}
      </div>

      {/* مودال رفض الشريك */}
      {selectedPartner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>رفض الشريك</CardTitle>
              <CardDescription>
                سبب رفض طلب {selectedPartner.businessNameAr || selectedPartner.businessName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>سبب الرفض</Label>
                <Textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="أدخل سبب رفض الطلب..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedPartner(null);
                    setRejectReason("");
                  }}
                >
                  إلغاء
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => rejectPartner(selectedPartner.id, rejectReason)}
                  disabled={!rejectReason.trim()}
                >
                  رفض الطلب
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Category Manager Component
function CategoryManager() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await apiRequest("GET", "/api/admin/categories", null, {
        Authorization: `Bearer ${token}`
      });
      
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">جاري التحميل...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة التصنيفات</h2>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          إضافة تصنيف جديد
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-6 text-center">
              <div 
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white text-2xl"
                style={{ backgroundColor: category.color }}
              >
                {category.icon}
              </div>
              <h3 className="font-semibold mb-2">{category.nameAr}</h3>
              <p className="text-sm text-gray-600 mb-3">{category.descriptionAr}</p>
              <Badge variant={category.isActive ? "default" : "secondary"}>
                {category.isActive ? "نشط" : "غير نشط"}
              </Badge>
            </CardContent>
          </Card>
        ))}
        {categories.length === 0 && (
          <div className="text-center py-12 col-span-full">
            <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">لا يوجد تصنيفات حتى الآن</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Settings Manager Component
function SettingsManager() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await apiRequest("GET", "/api/admin/settings", null, {
        Authorization: `Bearer ${token}`
      });
      
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">جاري التحميل...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إعدادات النظام</h2>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          إضافة إعداد جديد
        </Button>
      </div>

      <div className="grid gap-4">
        {settings.map((setting) => (
          <Card key={setting.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{setting.key}</h3>
                  <p className="text-sm text-gray-600">{setting.value}</p>
                </div>
                <Button size="sm" variant="outline">
                  <Edit3 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {settings.length === 0 && (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">لا يوجد إعدادات محفوظة</p>
          </div>
        )}
      </div>
    </div>
  );
}



// Content Edit Modal
function ContentEditModal({ content, onSave, onClose }: any) {
  const [formData, setFormData] = useState({
    titleAr: content.titleAr || "",
    contentAr: content.contentAr || "",
    isActive: content.isActive ?? true
  });

  const handleSave = () => {
    onSave(content.key, formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>تحرير: {content.key}</CardTitle>
            <Button size="sm" variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>العنوان</Label>
            <Input
              value={formData.titleAr}
              onChange={(e) => setFormData({...formData, titleAr: e.target.value})}
              className="text-right"
            />
          </div>

          <div>
            <Label>المحتوى</Label>
            <Textarea
              value={formData.contentAr}
              onChange={(e) => setFormData({...formData, contentAr: e.target.value})}
              className="min-h-32 text-right"
              rows={6}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
            />
            <Label htmlFor="isActive">نشط</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button onClick={handleSave}>
              حفظ التغييرات
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Region Manager Component
function RegionManager() {
  const { toast } = useToast();
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRegions();
  }, []);

  const loadRegions = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await apiRequest("GET", "/api/admin/regions", null, {
        Authorization: `Bearer ${token}`
      });

      if (response.ok) {
        const data = await response.json();
        setRegions(data);
      }
    } catch (error) {
      console.error("Failed to load regions:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة المناطق</h2>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          إضافة منطقة جديدة
        </Button>
      </div>

      <div className="grid gap-4">
        {regions.map((region) => (
          <Card key={region.id}>
            <CardContent className="flex justify-between items-center p-4">
              <div>
                <h3 className="font-semibold">{region.nameAr}</h3>
                <p className="text-sm text-gray-600">{region.name}</p>
                {region.descriptionAr && (
                  <p className="text-sm text-gray-500 mt-1">{region.descriptionAr}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={region.isActive ? "default" : "secondary"}>
                  {region.isActive ? "نشط" : "غير نشط"}
                </Badge>
                <Button size="sm" variant="outline">
                  <Edit3 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}