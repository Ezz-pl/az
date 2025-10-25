import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Star, ThumbsUp, MessageCircle, Camera, Plus, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReviewSystemProps {
  serviceType: "vehicle" | "catering" | "cooking" | "partner";
  serviceId: number;
  serviceName: string;
  allowReviews?: boolean;
}

interface ReviewData {
  id: number;
  customerName: string;
  rating: number;
  title?: string;
  comment?: string;
  pros?: string[];
  cons?: string[];
  images?: string[];
  verified: boolean;
  helpful: number;
  createdAt: string;
  response?: {
    response: string;
    respondedBy: string;
    createdAt: string;
  };
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<string, number>;
}

export default function ReviewSystem({ serviceType, serviceId, serviceName, allowReviews = true }: ReviewSystemProps) {
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    comment: "",
    customerName: "",
    customerEmail: "",
    pros: [""],
    cons: [""]
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // جلب التقييمات
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: [`/api/reviews/${serviceType}/${serviceId}`],
    retry: false,
  });

  // جلب إحصائيات التقييمات
  const { data: stats } = useQuery({
    queryKey: [`/api/reviews/${serviceType}/${serviceId}/stats`],
    retry: false,
  });

  const reviewStats = stats as ReviewStats | undefined;

  // إضافة تقييم جديد
  const createReviewMutation = useMutation({
    mutationFn: async (reviewData: any) => {
      return await apiRequest("POST", "/api/reviews", {
        ...reviewData,
        serviceType,
        serviceId,
        pros: reviewData.pros.filter((p: string) => p.trim()),
        cons: reviewData.cons.filter((c: string) => c.trim())
      });
    },
    onSuccess: () => {
      toast({
        title: "تم إرسال التقييم",
        description: "شكراً لك على تقييمك! سيتم مراجعته قريباً.",
      });
      setIsWritingReview(false);
      setNewReview({
        rating: 5,
        title: "",
        comment: "",
        customerName: "",
        customerEmail: "",
        pros: [""],
        cons: [""]
      });
      queryClient.invalidateQueries({ queryKey: [`/api/reviews/${serviceType}/${serviceId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/reviews/${serviceType}/${serviceId}/stats`] });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال التقييم",
        variant: "destructive",
      });
    },
  });

  // تصفية التقييمات
  const filteredReviews = filterRating 
    ? (reviews as ReviewData[]).filter(review => Math.floor(review.rating) === filterRating)
    : reviews as ReviewData[];

  // عرض النجوم
  const renderStars = (rating: number, size = "w-4 h-4") => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  // عرض توزيع التقييمات
  const renderRatingDistribution = () => {
    if (!reviewStats) return null;

    const distribution = reviewStats.ratingDistribution || {};
    const total = reviewStats.totalReviews || 1;

    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = distribution[rating.toString()] || 0;
          const percentage = (count / total) * 100;
          
          return (
            <div key={rating} className="flex items-center gap-3">
              <button
                onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                className={`flex items-center gap-1 text-sm hover:bg-gray-100 px-2 py-1 rounded ${
                  filterRating === rating ? "bg-blue-100" : ""
                }`}
              >
                <span>{rating}</span>
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              </button>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* إحصائيات التقييمات */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">تقييمات {serviceName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* التقييم العام */}
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-500 mb-2">
                {reviewStats?.averageRating?.toFixed(1) || "0.0"}
              </div>
              {renderStars(reviewStats?.averageRating || 0, "w-6 h-6")}
              <p className="text-gray-600 mt-2">
                {reviewStats?.totalReviews || 0} تقييم
              </p>
            </div>

            {/* توزيع التقييمات */}
            <div>
              <h4 className="font-medium mb-3 text-right">توزيع التقييمات</h4>
              {renderRatingDistribution()}
            </div>
          </div>

          {/* أزرار التحكم */}
          <div className="flex gap-3 mt-6 justify-center">
            {allowReviews && (
              <Dialog open={isWritingReview} onOpenChange={setIsWritingReview}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    كتابة تقييم
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-right">كتابة تقييم جديد</DialogTitle>
                    <DialogDescription className="text-right">
                      شاركنا تجربتك مع {serviceName}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    {/* التقييم بالنجوم */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-right">
                        التقييم العام *
                      </label>
                      <div className="flex justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                            className="p-1"
                          >
                            <Star
                              className={`w-8 h-8 transition-colors ${
                                star <= newReview.rating 
                                  ? "fill-yellow-400 text-yellow-400" 
                                  : "text-gray-300 hover:text-yellow-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* معلومات المراجع */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-right">
                          الاسم *
                        </label>
                        <Input
                          value={newReview.customerName}
                          onChange={(e) => setNewReview(prev => ({ ...prev, customerName: e.target.value }))}
                          placeholder="أدخل اسمك"
                          className="text-right"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-right">
                          البريد الإلكتروني
                        </label>
                        <Input
                          type="email"
                          value={newReview.customerEmail}
                          onChange={(e) => setNewReview(prev => ({ ...prev, customerEmail: e.target.value }))}
                          placeholder="example@email.com"
                          className="text-right"
                        />
                      </div>
                    </div>

                    {/* عنوان التقييم */}
                    <div>
                      <label className="block text-sm font-medium mb-1 text-right">
                        عنوان التقييم
                      </label>
                      <Input
                        value={newReview.title}
                        onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="ملخص سريع لتجربتك"
                        className="text-right"
                      />
                    </div>

                    {/* التعليق */}
                    <div>
                      <label className="block text-sm font-medium mb-1 text-right">
                        تفاصيل التجربة
                      </label>
                      <Textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                        placeholder="اكتب تفاصيل تجربتك مع الخدمة..."
                        className="text-right h-24"
                      />
                    </div>

                    {/* النقاط الإيجابية */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-right">
                        ما الذي أعجبك؟
                      </label>
                      {newReview.pros.map((pro, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <Input
                            value={pro}
                            onChange={(e) => {
                              const newPros = [...newReview.pros];
                              newPros[index] = e.target.value;
                              setNewReview(prev => ({ ...prev, pros: newPros }));
                            }}
                            placeholder="نقطة إيجابية"
                            className="text-right"
                          />
                          {index === newReview.pros.length - 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setNewReview(prev => ({ ...prev, pros: [...prev.pros, ""] }))}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* النقاط السلبية */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-right">
                        ما الذي يمكن تحسينه؟
                      </label>
                      {newReview.cons.map((con, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <Input
                            value={con}
                            onChange={(e) => {
                              const newCons = [...newReview.cons];
                              newCons[index] = e.target.value;
                              setNewReview(prev => ({ ...prev, cons: newCons }));
                            }}
                            placeholder="اقتراح للتحسين"
                            className="text-right"
                          />
                          {index === newReview.cons.length - 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setNewReview(prev => ({ ...prev, cons: [...prev.cons, ""] }))}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* إرسال التقييم */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={() => setIsWritingReview(false)}
                        variant="outline"
                        className="flex-1"
                      >
                        إلغاء
                      </Button>
                      <Button
                        onClick={() => createReviewMutation.mutate(newReview)}
                        disabled={createReviewMutation.isPending || !newReview.customerName || newReview.rating === 0}
                        className="flex-1"
                      >
                        {createReviewMutation.isPending ? "جاري الإرسال..." : "إرسال التقييم"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            <Button 
              variant="outline" 
              onClick={() => setFilterRating(null)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              {filterRating ? `عرض تقييمات ${filterRating} نجوم` : "عرض الكل"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* قائمة التقييمات */}
      <div className="space-y-4">
        {reviewsLoading ? (
          <div className="text-center py-8">جاري تحميل التقييمات...</div>
        ) : filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {filterRating ? `لا توجد تقييمات بـ ${filterRating} نجوم` : "لا توجد تقييمات بعد"}
              </p>
              {allowReviews && !filterRating && (
                <p className="text-sm text-gray-500 mt-2">
                  كن أول من يكتب تقييماً!
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredReviews.map((review: ReviewData) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{review.customerName}</span>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">
                          ✓ مؤكد
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-600">
                        {new Date(review.createdAt).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  </div>
                </div>

                {review.title && (
                  <h4 className="font-medium mb-2 text-right">{review.title}</h4>
                )}

                {review.comment && (
                  <p className="text-gray-700 mb-4 text-right leading-relaxed">
                    {review.comment}
                  </p>
                )}

                {/* النقاط الإيجابية والسلبية */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {review.pros && review.pros.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-green-700 mb-2 text-right">
                        النقاط الإيجابية:
                      </h5>
                      <ul className="space-y-1">
                        {review.pros.map((pro, index) => (
                          <li key={index} className="text-sm text-gray-600 text-right">
                            • {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {review.cons && review.cons.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-orange-700 mb-2 text-right">
                        يمكن تحسين:
                      </h5>
                      <ul className="space-y-1">
                        {review.cons.map((con, index) => (
                          <li key={index} className="text-sm text-gray-600 text-right">
                            • {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* رد المستضيف */}
                {review.response && (
                  <div className="bg-blue-50 border-r-4 border-blue-400 p-4 mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        رد المستضيف
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {review.response.respondedBy}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 text-right">
                      {review.response.response}
                    </p>
                  </div>
                )}

                {/* أزرار التفاعل */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                  <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600">
                    <ThumbsUp className="w-4 h-4" />
                    مفيد ({review.helpful})
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}