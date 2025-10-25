import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, LogIn, Mail, Lock, User, Phone } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// نموذج تسجيل الدخول
const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل")
});

// نموذج التسجيل
const registerSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يحتوي على حرفين على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().min(10, "رقم الجوال يجب أن يحتوي على 10 أرقام على الأقل"),
  password: z.string().min(6, "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمة المرور غير متطابقة",
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function Login() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: ""
    }
  });

  // طلب تسجيل الدخول
  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "فشل في تسجيل الدخول");
      }
      return response.json();
    },
    onSuccess: (data) => {
      // حفظ بيانات التسجيل في localStorage
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("customer", JSON.stringify(data.customer));
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً بك ${data.customer.name}`,
      });
      
      navigate("/");
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message || "حدث خطأ أثناء تسجيل الدخول",
        variant: "destructive",
      });
    }
  });

  const handleLogin = async (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  // طلب التسجيل
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterForm) => {
      const { confirmPassword, ...registerData } = data;
      const response = await apiRequest("POST", "/api/auth/register", registerData);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "فشل في إنشاء الحساب");
      }
      return response.json();
    },
    onSuccess: (data) => {
      // حفظ بيانات التسجيل في localStorage
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("customer", JSON.stringify(data.customer));
      
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: `مرحباً بك ${data.customer.name}`,
      });
      
      navigate("/");
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في إنشاء الحساب",
        description: error.message || "حدث خطأ أثناء إنشاء الحساب",
        variant: "destructive",
      });
    }
  });

  const handleRegister = async (data: RegisterForm) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">تسجيل الدخول أو إنشاء حساب</CardTitle>
              <CardDescription>
                سجل دخولك للاستمتاع بجميع خدمات المنصة
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
                  <TabsTrigger value="register">إنشاء حساب</TabsTrigger>
                </TabsList>
                
                {/* تسجيل الدخول */}
                <TabsContent value="login">
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <div>
                      <Label htmlFor="login-email">البريد الإلكتروني</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="login-email"
                          type="email"
                          {...loginForm.register("email")}
                          placeholder="example@email.com"
                          className="pr-10"
                        />
                      </div>
                      {loginForm.formState.errors.email && (
                        <p className="text-sm text-red-600 mt-1">{loginForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="login-password">كلمة المرور</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="login-password"
                          type="password"
                          {...loginForm.register("password")}
                          placeholder="••••••••"
                          className="pr-10"
                        />
                      </div>
                      {loginForm.formState.errors.password && (
                        <p className="text-sm text-red-600 mt-1">{loginForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={loginMutation.isPending}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {loginMutation.isPending ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full ml-2"></div>
                          جاري تسجيل الدخول...
                        </>
                      ) : (
                        <>
                          <LogIn className="w-4 h-4 ml-2" />
                          تسجيل الدخول
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* إنشاء حساب */}
                <TabsContent value="register">
                  <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                    <div>
                      <Label htmlFor="register-name">الاسم الكامل</Label>
                      <div className="relative mt-1">
                        <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="register-name"
                          {...registerForm.register("name")}
                          placeholder="أحمد محمد"
                          className="pr-10"
                        />
                      </div>
                      {registerForm.formState.errors.name && (
                        <p className="text-sm text-red-600 mt-1">{registerForm.formState.errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="register-email">البريد الإلكتروني</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="register-email"
                          type="email"
                          {...registerForm.register("email")}
                          placeholder="example@email.com"
                          className="pr-10"
                        />
                      </div>
                      {registerForm.formState.errors.email && (
                        <p className="text-sm text-red-600 mt-1">{registerForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="register-phone">رقم الجوال</Label>
                      <div className="relative mt-1">
                        <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="register-phone"
                          {...registerForm.register("phone")}
                          placeholder="05xxxxxxxx"
                          className="pr-10"
                        />
                      </div>
                      {registerForm.formState.errors.phone && (
                        <p className="text-sm text-red-600 mt-1">{registerForm.formState.errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="register-password">كلمة المرور</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="register-password"
                          type="password"
                          {...registerForm.register("password")}
                          placeholder="••••••••"
                          className="pr-10"
                        />
                      </div>
                      {registerForm.formState.errors.password && (
                        <p className="text-sm text-red-600 mt-1">{registerForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="register-confirm-password">تأكيد كلمة المرور</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="register-confirm-password"
                          type="password"
                          {...registerForm.register("confirmPassword")}
                          placeholder="••••••••"
                          className="pr-10"
                        />
                      </div>
                      {registerForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-600 mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={registerMutation.isPending}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {registerMutation.isPending ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full ml-2"></div>
                          جاري إنشاء الحساب...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 ml-2" />
                          إنشاء حساب
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>


            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}