import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Building2, Mail, Lock, ArrowLeft } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function PartnerLogin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest("POST", "/api/partners/login", data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "فشل تسجيل الدخول");
      }
      return response.json();
    },
    onSuccess: (data) => {
      // حفظ بيانات الشريك والرمز المميز
      localStorage.setItem('partner_token', data.token);
      localStorage.setItem('partner_data', JSON.stringify(data.partner));
      
      toast({
        title: "تم تسجيل الدخول بنجاح!",
        description: `مرحباً ${data.partner.contactName}`,
      });
      
      // إعادة التوجيه لبوابة الشريك
      navigate('/host-portal');
    },
    onError: (error: any) => {
      setLoginError(error.message);
      toast({
        title: "فشل تسجيل الدخول",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    setLoginError("");
    try {
      await loginMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              دخول الشركاء
            </h1>
            <p className="text-gray-600">
              سجل دخول لإدارة حسابك ومركباتك
            </p>
          </div>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">تسجيل الدخول</CardTitle>
              <CardDescription className="text-center">
                أدخل بيانات الدخول الخاصة بك
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loginError && (
                <Alert className="mb-6 bg-red-50 border-red-200 text-red-800">
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      {...form.register("email")}
                      type="email"
                      placeholder="example@domain.com"
                      className="pr-10 text-left"
                      dir="ltr"
                    />
                  </div>
                  {form.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">كلمة المرور</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      {...form.register("password")}
                      type="password"
                      placeholder="كلمة المرور"
                      className="pr-10"
                    />
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting || loginMutation.isPending}
                >
                  {isSubmitting || loginMutation.isPending ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                </Button>
              </form>

              <div className="mt-6">
                <Separator />
                <div className="text-center mt-4 space-y-2">
                  <p className="text-sm text-gray-600">
                    ليس لديك حساب؟
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/partner-register')}
                  >
                    التسجيل كشريك جديد
                  </Button>
                </div>
              </div>

              <div className="mt-4 text-center">
                <Button 
                  variant="ghost" 
                  className="text-sm text-gray-500"
                  onClick={() => navigate('/')}
                >
                  <ArrowLeft className="w-4 h-4 ml-2" />
                  العودة للصفحة الرئيسية
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* معلومات إضافية */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p className="mb-2">بحاجة للمساعدة؟</p>
            <div className="space-y-1">
              <p>تواصل معنا على: <a href="mailto:partners@example.com" className="text-blue-600">partners@example.com</a></p>
              <p>أو اتصل: <a href="tel:+966500000000" className="text-blue-600">966500000000+</a></p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}