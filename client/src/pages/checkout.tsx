import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useLocation } from "wouter";

// تحميل Stripe
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('مفتاح Stripe العام مفقود: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutFormProps {
  bookingData: any;
  onSuccess: () => void;
}

const CheckoutForm = ({ bookingData, onSuccess }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'succeeded' | 'failed'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setPaymentStatus('processing');

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/payment-success',
        },
        redirect: 'if_required'
      });

      if (error) {
        setPaymentStatus('failed');
        toast({
          title: "فشل في الدفع",
          description: error.message || "حدث خطأ أثناء معالجة الدفع",
          variant: "destructive",
        });
      } else {
        setPaymentStatus('succeeded');
        toast({
          title: "تم الدفع بنجاح",
          description: "شكراً لك! تم تأكيد حجزك بنجاح",
        });
        onSuccess();
      }
    } catch (error) {
      setPaymentStatus('failed');
      toast({
        title: "خطأ في الدفع",
        description: "حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (paymentStatus === 'succeeded') {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center p-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">تم الدفع بنجاح!</h3>
          <p className="text-gray-600">سيتم التواصل معك قريباً لتأكيد تفاصيل الحجز</p>
        </CardContent>
      </Card>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center p-6">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">فشل في الدفع</h3>
          <p className="text-gray-600 mb-4">يرجى المحاولة مرة أخرى أو استخدام طريقة دفع أخرى</p>
          <Button onClick={() => setPaymentStatus('idle')} variant="outline">
            المحاولة مرة أخرى
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>إتمام الدفع</CardTitle>
        <CardDescription>
          المبلغ الإجمالي: {bookingData.totalAmount} ريال سعودي
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <PaymentElement />
          <Button 
            type="submit" 
            disabled={!stripe || !elements || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جاري المعالجة...
              </>
            ) : (
              `دفع ${bookingData.totalAmount} ريال`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [bookingData, setBookingData] = useState<any>(null);
  const [location, navigate] = useLocation();
  
  // الحصول على بيانات الحجز من URL params أو localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('booking');
    
    if (bookingId) {
      // جلب بيانات الحجز
      const storedBooking = localStorage.getItem(`booking_${bookingId}`);
      if (storedBooking) {
        const booking = JSON.parse(storedBooking);
        setBookingData(booking);
        
        // إنشاء PaymentIntent
        apiRequest("POST", "/api/create-payment-intent", { 
          amount: booking.totalAmount,
          bookingId: bookingId,
          currency: 'sar' // الريال السعودي
        })
        .then((response) => response.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          console.error("خطأ في إنشاء PaymentIntent:", error);
        });
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handlePaymentSuccess = () => {
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  if (!clientSecret || !bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>جاري تحضير نموذج الدفع...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">إتمام الحجز والدفع</h1>
        
        {/* تفاصيل الحجز */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>تفاصيل الحجز</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><span className="font-semibold">الخدمة:</span> {bookingData.serviceName}</p>
              <p><span className="font-semibold">التاريخ:</span> {bookingData.startDate} - {bookingData.endDate}</p>
              <p><span className="font-semibold">المنطقة:</span> {bookingData.region}</p>
              <p><span className="font-semibold">عدد الأشخاص:</span> {bookingData.guests}</p>
              <p><span className="font-semibold">المبلغ الإجمالي:</span> {bookingData.totalAmount} ريال سعودي</p>
            </div>
          </CardContent>
        </Card>

        {/* نموذج الدفع */}
        <Elements stripe={stripePromise} options={{ 
          clientSecret,
          locale: 'ar',
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#0F172A',
            }
          }
        }}>
          <CheckoutForm bookingData={bookingData} onSuccess={handlePaymentSuccess} />
        </Elements>
      </div>
    </div>
  );
}