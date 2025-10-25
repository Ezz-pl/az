import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Phone, Mail, User, CreditCard } from "lucide-react";
import type { Vehicle } from "@shared/schema";
import type { BookingFormData } from "@/lib/types";
import tabbyLogo from "@assets/IMG_5719_1751901058201.webp";
import tamaraLogo from "@assets/IMG_5720_1751901138776.png";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
}

export default function BookingModal({ isOpen, onClose, vehicle }: BookingModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<BookingFormData>({
    vehicleId: vehicle.id,
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    startDate: "",
    endDate: "",
    totalPrice: vehicle.pricePerDay,
    notes: ""
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const response = await apiRequest("POST", "/api/bookings", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "تم الحجز بنجاح",
        description: "سيتم التواصل معك قريباً لتأكيد الحجز",
      });
      onClose();
      setFormData({
        vehicleId: vehicle.id,
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        startDate: "",
        endDate: "",
        totalPrice: vehicle.pricePerDay,
        notes: ""
      });
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
    },
    onError: (error) => {
      toast({
        title: "خطأ في الحجز",
        description: "حدث خطأ أثناء معالجة طلب الحجز. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.customerPhone || !formData.customerEmail) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    bookingMutation.mutate(formData);
  };

  const handleChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateTotal = () => {
    if (!formData.startDate || !formData.endDate) return vehicle.pricePerDay;
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    return days > 0 ? (parseFloat(vehicle.pricePerDay) * days).toFixed(2) : vehicle.pricePerDay;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center">تأكيد الحجز</DialogTitle>
          <div className="text-center text-sm text-gray-600">
            {vehicle.nameAr}
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="customerName" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              الاسم الكامل *
            </Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => handleChange("customerName", e.target.value)}
              placeholder="أدخل اسمك الكامل"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="customerPhone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              رقم الجوال *
            </Label>
            <Input
              id="customerPhone"
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => handleChange("customerPhone", e.target.value)}
              placeholder="05xxxxxxxx"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="customerEmail" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              البريد الإلكتروني *
            </Label>
            <Input
              id="customerEmail"
              type="email"
              value={formData.customerEmail}
              onChange={(e) => handleChange("customerEmail", e.target.value)}
              placeholder="example@email.com"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                تاريخ البداية
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <Label htmlFor="endDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                تاريخ النهاية
              </Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="notes">ملاحظات إضافية</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="أي متطلبات أو ملاحظات خاصة..."
              rows={3}
            />
          </div>
          
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-lg border border-primary/20">
            <div className="flex justify-between items-center mb-4">
              <span>السعر الإجمالي:</span>
              <span className="text-2xl font-bold text-primary">
                {calculateTotal()} ريال
              </span>
            </div>
            
            {/* Payment Methods */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-3 text-gray-700 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                وسائل الدفع المتاحة:
              </h4>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-white p-3 rounded-lg border border-gray-200 flex flex-col items-center">
                  <img src={tabbyLogo} alt="Tabby" className="h-6 w-auto mb-1" />
                  <span className="text-xs text-gray-600">قسط من 4-12 دفعة</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200 flex flex-col items-center">
                  <img src={tamaraLogo} alt="Tamara" className="h-6 w-auto mb-1" />
                  <span className="text-xs text-gray-600">اشتري الآن ادفع لاحقاً</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white p-2 rounded border flex items-center justify-center">
                  <span className="text-sm">🍎</span>
                  <span className="text-xs mr-1">Apple Pay</span>
                </div>
                <div className="bg-white p-2 rounded border flex items-center justify-center">
                  <span className="text-sm">💳</span>
                  <span className="text-xs mr-1">مدى</span>
                </div>
                <div className="bg-white p-2 rounded border flex items-center justify-center">
                  <span className="text-sm">💳</span>
                  <span className="text-xs mr-1">فيزا</span>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 text-center bg-blue-50 p-2 rounded">
              💡 يمكنك التقسيط مع تابي وتمارا أو دفع 50% مقدماً والباقي عند الاستلام
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              إلغاء
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={bookingMutation.isPending}
            >
              {bookingMutation.isPending ? "جاري الحجز..." : "تأكيد الحجز"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
