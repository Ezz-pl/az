import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

const loginSchema = z.object({
  username: z.string().min(3, "اسم المستخدم يجب أن يحتوي على 3 أحرف على الأقل"),
  password: z.string().min(6, "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    }
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    
    try {
      const response = await apiRequest("POST", "/api/admin/login", data);
      const result = await response.json();

      if (response.ok) {
        // حفظ التوكن
        localStorage.setItem("admin_token", result.token);
        localStorage.setItem("admin_user", JSON.stringify(result.admin));
        
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: `مرحباً ${result.admin.name}`,
        });
        
        // الانتقال إلى لوحة الإدارة
        navigate("/admin");
      } else {
        throw new Error(result.message || "فشل تسجيل الدخول");
      }
    } catch (error: any) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message || "تأكد من بيانات الدخول",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            تسجيل دخول الإدارة
          </CardTitle>
          <p className="text-gray-600 mt-2">
            لوحة التحكم الإدارية
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input
                  id="username"
                  {...form.register("username")}
                  placeholder="admin"
                  className="text-right"
                  disabled={isLoading}
                />
                {form.formState.errors.username && (
                  <div className="flex items-center gap-2 text-sm text-red-600 mt-1">
                    <AlertCircle className="w-4 h-4" />
                    {form.formState.errors.username.message}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...form.register("password")}
                    placeholder="••••••••"
                    className="pr-10 text-right"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <div className="flex items-center gap-2 text-sm text-red-600 mt-1">
                    <AlertCircle className="w-4 h-4" />
                    {form.formState.errors.password.message}
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري تسجيل الدخول...
                </div>
              ) : (
                "تسجيل الدخول"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              بيانات تجريبية: اسم المستخدم: admin، كلمة المرور: admin123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}