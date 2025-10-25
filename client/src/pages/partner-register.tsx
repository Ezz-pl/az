import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { 
  UserPlus, 
  Phone, 
  Mail, 
  MapPin, 
  Car,
  Upload,
  CheckCircle,
  Building,
  FileText,
  Shield,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useToast } from "@/hooks/use-toast";

// نموذج التحقق من البيانات
const partnerSchema = z.object({
  // بيانات الاتصال
  contactName: z.string().min(2, "اسم المسؤول مطلوب"),
  businessName: z.string().min(2, "اسم الشركة مطلوب"),
  businessNameAr: z.string().min(2, "اسم الشركة بالعربية مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().min(10, "رقم الجوال يجب أن يحتوي على 10 أرقام على الأقل"),
  
  // تفاصيل العمل
  businessType: z.string().min(1, "يجب اختيار نوع العمل"),
  businessDescription: z.string().min(50, "وصف العمل يجب أن يحتوي على 50 حرفاً على الأقل"),
  experienceYears: z.string().min(1, "سنوات الخبرة مطلوبة"),
  
  // الموقع والخدمات
  regionId: z.string().min(1, "يجب اختيار المنطقة"),
  address: z.string().min(10, "العنوان التفصيلي مطلوب"),
  serviceAreas: z.string().min(5, "مناطق الخدمة مطلوبة"),
  
  // المركبات والخدمات
  vehicleTypes: z.array(z.string()).min(1, "يجب اختيار نوع واحد على الأقل من المركبات"),
  fleetSize: z.string().min(1, "عدد المركبات مطلوب"),
  services: z.string().min(20, "وصف الخدمات مطلوب"),
  
  // المستندات
  commercialRegister: z.string().min(5, "رقم السجل التجاري مطلوب"),
  taxNumber: z.string().optional(),
  licenseNumber: z.string().min(5, "رقم الرخصة مطلوب"),
  
  // الموافقات
  agreesToTerms: z.boolean().refine(val => val === true, "يجب الموافقة على الشروط والأحكام"),
  agreesToDataPolicy: z.boolean().refine(val => val === true, "يجب الموافقة على سياسة البيانات")
});

type PartnerForm = z.infer<typeof partnerSchema>;

interface Region {
  id: number;
  name: string;
  nameAr: string;
}

export default function PartnerRegister() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // جلب البيانات المطلوبة
  const { data: regions } = useQuery<Region[]>({
    queryKey: ["/api/regions"],
  });

  const form = useForm<PartnerForm>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      contactName: "",
      businessName: "",
      businessNameAr: "",
      email: "",
      phone: "",
      businessType: "",
      businessDescription: "",
      experienceYears: "",
      regionId: "",
      address: "",
      serviceAreas: "",
      vehicleTypes: [],
      fleetSize: "",
      services: "",
      commercialRegister: "",
      taxNumber: "",
      licenseNumber: "",
      agreesToTerms: false,
      agreesToDataPolicy: false
    }
  });

  // إرسال النموذج
  const submitMutation = useMutation({
    mutationFn: async (data: PartnerForm) => {
      const response = await apiRequest("POST", "/api/partners/register", data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "فشل في التسجيل");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "تم إرسال الطلب بنجاح! ✅",
        description: "سيتم مراجعة طلبك من قبل الإدارة وسنرسل لك بيانات الدخول عبر البريد الإلكتروني عند الموافقة",
      });
      setCurrentStep(4); // مرحلة النجاح
    },
    onError: (error: any) => {
      toast({
        title: "فشل في إرسال الطلب",
        description: error.message || "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    }
  });

  const onSubmit = async (data: PartnerForm) => {
    console.log("تم استدعاء onSubmit مع البيانات:", data);
    setIsSubmitting(true);
    try {
      await submitMutation.mutateAsync(data);
    } catch (error) {
      console.error("خطأ في الإرسال:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof PartnerForm)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ['contactName', 'businessName', 'businessNameAr', 'email', 'phone', 'businessType', 'businessDescription', 'experienceYears'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['regionId', 'address', 'serviceAreas', 'vehicleTypes', 'fleetSize', 'services'];
    }
    
    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else if (!isValid) {
      toast({
        title: "يرجى إكمال جميع الحقول المطلوبة",
        description: "تأكد من ملء جميع البيانات المطلوبة بشكل صحيح",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const businessTypes = [
    { value: "individual", label: "فرد", labelAr: "فرد" },
    { value: "company", label: "شركة", labelAr: "شركة" },
    { value: "establishment", label: "مؤسسة", labelAr: "مؤسسة" },
  ];

  const vehicleTypeOptions = [
    { value: "desert_vehicles", label: "مركبات صحراوية", labelAr: "مركبات صحراوية" },
    { value: "water_sports", label: "رياضات مائية", labelAr: "رياضات مائية" },
    { value: "camping_gear", label: "معدات التخييم", labelAr: "معدات التخييم" },
    { value: "adventure_tours", label: "رحلات المغامرات", labelAr: "رحلات المغامرات" },
  ];

  // مرحلة النجاح
  if (currentStep === 4) {
    return (
      <div className="min-h-screen bg-gray-50 rtl">
        <Navigation />
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              تم إرسال طلبك بنجاح!
            </h1>
            <p className="text-gray-600 mb-8">
              سيتم مراجعة طلب الانضمام من قبل فريق الإدارة خلال 24-48 ساعة. سنرسل لك بيانات الدخول إلى بوابة الشركاء عبر البريد الإلكتروني عند الموافقة.
            </p>
            <Button onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-700">
              العودة للصفحة الرئيسية
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              انضم إلى شبكة شركائنا
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              كن جزءاً من منصة المغامرات الرائدة في المملكة. سجل كشريك واربح من تأجير مركباتك وخدماتك السياحية
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= currentStep
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <ChevronLeft className={`w-4 h-4 mx-2 ${
                      step < currentStep ? "text-blue-600" : "text-gray-300"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* المرحلة الأولى: المعلومات الأساسية */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    المعلومات الأساسية
                  </CardTitle>
                  <CardDescription>
                    أدخل معلومات الشركة والاتصال الأساسية
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactName">اسم المسؤول *</Label>
                      <Input
                        {...form.register("contactName")}
                        placeholder="أدخل اسم المسؤول"
                        className="text-right"
                      />
                      {form.formState.errors.contactName && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.contactName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="businessName">اسم الشركة (إنجليزي) *</Label>
                      <Input
                        {...form.register("businessName")}
                        placeholder="Company Name"
                        className="text-left"
                        dir="ltr"
                      />
                      {form.formState.errors.businessName && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.businessName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="businessNameAr">اسم الشركة (عربي) *</Label>
                      <Input
                        {...form.register("businessNameAr")}
                        placeholder="اسم الشركة"
                        className="text-right"
                      />
                      {form.formState.errors.businessNameAr && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.businessNameAr.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">البريد الإلكتروني *</Label>
                      <Input
                        {...form.register("email")}
                        type="email"
                        placeholder="example@domain.com"
                        className="text-left"
                        dir="ltr"
                      />
                      {form.formState.errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">رقم الجوال *</Label>
                      <Input
                        {...form.register("phone")}
                        placeholder="+966 5XXXXXXXX"
                        className="text-left"
                        dir="ltr"
                      />
                      {form.formState.errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="businessType">نوع النشاط *</Label>
                      <Select onValueChange={(value) => form.setValue("businessType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع النشاط" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.labelAr}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.businessType && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.businessType.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="businessDescription">وصف النشاط التجاري *</Label>
                    <Textarea
                      {...form.register("businessDescription")}
                      placeholder="اكتب وصفاً مفصلاً لنشاطك التجاري وخدماتك..."
                      rows={4}
                      className="text-right"
                    />
                    {form.formState.errors.businessDescription && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.businessDescription.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="experienceYears">سنوات الخبرة *</Label>
                    <Select onValueChange={(value) => form.setValue("experienceYears", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر سنوات الخبرة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-3">1-3 سنوات</SelectItem>
                        <SelectItem value="4-7">4-7 سنوات</SelectItem>
                        <SelectItem value="8-15">8-15 سنة</SelectItem>
                        <SelectItem value="15+">أكثر من 15 سنة</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.experienceYears && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.experienceYears.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* المرحلة الثانية: الموقع والخدمات */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    الموقع والخدمات
                  </CardTitle>
                  <CardDescription>
                    تفاصيل الموقع والمركبات والخدمات المقدمة
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="regionId">المنطقة *</Label>
                      <Select onValueChange={(value) => form.setValue("regionId", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المنطقة" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions?.map((region) => (
                            <SelectItem key={region.id} value={region.id.toString()}>
                              {region.nameAr}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.regionId && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.regionId.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="fleetSize">عدد المركبات *</Label>
                      <Select onValueChange={(value) => form.setValue("fleetSize", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر عدد المركبات" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-5">1-5 مركبات</SelectItem>
                          <SelectItem value="6-15">6-15 مركبة</SelectItem>
                          <SelectItem value="16-30">16-30 مركبة</SelectItem>
                          <SelectItem value="30+">أكثر من 30 مركبة</SelectItem>
                        </SelectContent>
                      </Select>
                      {form.formState.errors.fleetSize && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.fleetSize.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">العنوان التفصيلي *</Label>
                    <Textarea
                      {...form.register("address")}
                      placeholder="أدخل العنوان الكامل للشركة..."
                      rows={2}
                      className="text-right"
                    />
                    {form.formState.errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.address.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="serviceAreas">مناطق الخدمة *</Label>
                    <Textarea
                      {...form.register("serviceAreas")}
                      placeholder="اذكر المناطق التي تقدم فيها خدماتك..."
                      rows={2}
                      className="text-right"
                    />
                    {form.formState.errors.serviceAreas && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.serviceAreas.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>أنواع المركبات/الخدمات *</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {vehicleTypeOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Checkbox
                            id={option.value}
                            checked={form.watch("vehicleTypes")?.includes(option.value)}
                            onCheckedChange={(checked) => {
                              const current = form.getValues("vehicleTypes") || [];
                              if (checked) {
                                form.setValue("vehicleTypes", [...current, option.value]);
                              } else {
                                form.setValue("vehicleTypes", current.filter(v => v !== option.value));
                              }
                            }}
                          />
                          <Label htmlFor={option.value} className="text-sm font-normal">
                            {option.labelAr}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {form.formState.errors.vehicleTypes && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.vehicleTypes.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="services">وصف الخدمات المقدمة *</Label>
                    <Textarea
                      {...form.register("services")}
                      placeholder="اكتب وصفاً تفصيلياً للخدمات والمركبات التي تقدمها..."
                      rows={4}
                      className="text-right"
                    />
                    {form.formState.errors.services && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.services.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* المرحلة الثالثة: المستندات والموافقات */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    المستندات والموافقات
                  </CardTitle>
                  <CardDescription>
                    معلومات التراخيص والموافقات النهائية
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="commercialRegister">رقم السجل التجاري *</Label>
                      <Input
                        {...form.register("commercialRegister")}
                        placeholder="أدخل رقم السجل التجاري"
                        className="text-left"
                        dir="ltr"
                      />
                      {form.formState.errors.commercialRegister && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.commercialRegister.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="taxNumber">الرقم الضريبي (اختياري)</Label>
                      <Input
                        {...form.register("taxNumber")}
                        placeholder="أدخل الرقم الضريبي"
                        className="text-left"
                        dir="ltr"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="licenseNumber">رقم رخصة النقل السياحي *</Label>
                      <Input
                        {...form.register("licenseNumber")}
                        placeholder="أدخل رقم رخصة النقل السياحي"
                        className="text-left"
                        dir="ltr"
                      />
                      {form.formState.errors.licenseNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.licenseNumber.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* الموافقات */}
                  <div className="space-y-4 pt-6 border-t">
                    <div className="flex items-start space-x-3 rtl:space-x-reverse">
                      <Checkbox
                        id="agreesToTerms"
                        checked={form.watch("agreesToTerms")}
                        onCheckedChange={(checked) => form.setValue("agreesToTerms", !!checked)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor="agreesToTerms" className="text-sm font-normal">
                          أوافق على{" "}
                          <a href="#" className="text-blue-600 underline">
                            الشروط والأحكام
                          </a>{" "}
                          الخاصة بالانضمام كشريك في المنصة *
                        </Label>
                        {form.formState.errors.agreesToTerms && (
                          <p className="text-red-500 text-sm mt-1">
                            {form.formState.errors.agreesToTerms.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 rtl:space-x-reverse">
                      <Checkbox
                        id="agreesToDataPolicy"
                        checked={form.watch("agreesToDataPolicy")}
                        onCheckedChange={(checked) => form.setValue("agreesToDataPolicy", !!checked)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor="agreesToDataPolicy" className="text-sm font-normal">
                          أوافق على{" "}
                          <a href="#" className="text-blue-600 underline">
                            سياسة الخصوصية
                          </a>{" "}
                          واستخدام البيانات للأغراض التشغيلية *
                        </Label>
                        {form.formState.errors.agreesToDataPolicy && (
                          <p className="text-red-500 text-sm mt-1">
                            {form.formState.errors.agreesToDataPolicy.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* أزرار التنقل */}
            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  <ChevronRight className="w-4 h-4 ml-2" />
                  السابق
                </Button>
              )}
              
              <div className="flex-1" />
              
              {currentStep < 3 ? (
                <Button type="button" onClick={nextStep}>
                  التالي
                  <ChevronLeft className="w-4 h-4 mr-2" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={isSubmitting || submitMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    console.log("تم النقر على زر الإرسال");
                    console.log("حالة النموذج:", form.formState);
                    console.log("الأخطاء:", form.formState.errors);
                  }}
                >
                  {isSubmitting || submitMutation.isPending ? "جاري الإرسال..." : "إرسال الطلب"}
                  <Shield className="w-4 h-4 mr-2" />
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}