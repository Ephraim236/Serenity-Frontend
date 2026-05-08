import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Star, ArrowLeft, Check, MapPin, Building2 } from "lucide-react";
import { StarRating } from "../components/StarRating";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { getAuthToken } from "../contexts/AuthContext";
import { toast } from "sonner";

const API_URL = "https://booqlly.vercel.app";

interface TagOption {
  value: string;
  label: string;
}

const REVIEW_TAGS: TagOption[] = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'professional', label: 'Professional' },
  { value: 'clean', label: 'Clean & Hygienic' },
  { value: 'friendly', label: 'Friendly Staff' },
  { value: 'worth_it', label: 'Worth the Money' },
  { value: 'punctual', label: 'Punctual' },
  { value: 'skilled', label: 'Highly Skilled' },
  { value: 'relaxing', label: 'Relaxing Experience' }
];

interface Business {
  _id: string;
  businessName: string;
  name: string;
}

export function WriteReview() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const businessId = searchParams.get('businessId');
  const serviceId = searchParams.get('serviceId');
  const appointmentId = searchParams.get('appointmentId');
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const token = getAuthToken();

  useEffect(() => {
    if (businessId) {
      fetchBusinessDetails();
    }
  }, [businessId]);

  const fetchBusinessDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/api/business/${businessId}`);
      if (response.ok) {
        const data = await response.json();
        setBusiness(data);
      } else {
        toast.error('Business not found');
        navigate(-1);
      }
    } catch (error) {
      console.error('Failed to fetch business:', error);
      toast.error('Failed to load business details');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tagValue: string) => {
    setSelectedTags(prev =>
      prev.includes(tagValue)
        ? prev.filter(t => t !== tagValue)
        : [...prev, tagValue]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a star rating');
      return;
    }

    setSubmitting(true);
    try {
      const reviewData: any = {
        businessId,
        rating,
        comment
      };

      if (serviceId) {
        reviewData.serviceId = serviceId;
      }

      if (appointmentId) {
        reviewData.appointmentId = appointmentId;
      }

      if (selectedTags.length > 0) {
        reviewData.tags = selectedTags;
      }

      const response = await fetch(`${API_URL}/api/auth/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Review submitted successfully!');
        
        // Redirect to business reviews page
        navigate(`/business/${businessId}/reviews`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Submit review error:', error);
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!business) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-neutral-600 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Write a Review
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Share your experience with <span className="font-semibold">{business.businessName || business.name}</span>
          </p>
        </div>

        {/* Business Preview */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 flex items-center gap-4 mb-8 shadow-sm">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-neutral-900 dark:text-white">
              {business.businessName || business.name}
            </h3>
            {business.location?.address && (
              <p className="text-sm text-neutral-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {business.location.address}, {business.location.city}
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Star Rating */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-100 dark:border-neutral-700 p-8">
            <div className="text-center">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                How was your experience?
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Tap the stars to rate (1 = poor, 5 = excellent)
              </p>
              
              <div className="flex justify-center mb-4">
                <StarRating 
                  rating={rating} 
                  interactive 
                  onRate={setRating}
                  size={48}
                />
              </div>
              
              {rating > 0 && (
                <p className="text-lg font-medium text-indigo-600 dark:text-indigo-400">
                  {rating === 1 && 'Poor - We can do better'}
                  {rating === 2 && 'Fair - Room for improvement'}
                  {rating === 3 && 'Good - Satisfactory'}
                  {rating === 4 && 'Very Good - Great experience'}
                  {rating === 5 && 'Excellent - Exceeded expectations!'}
                </p>
              )}
            </div>
          </div>

          {/* Optional Tags */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-100 dark:border-neutral-700 p-6">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
              What did you like? (Optional)
            </h3>
            <div className="flex flex-wrap gap-2">
              {REVIEW_TAGS.map((tag) => (
                <button
                  key={tag.value}
                  type="button"
                  onClick={() => handleTagToggle(tag.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTags.includes(tag.value)
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-100 dark:border-neutral-700 p-6">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
              Your Review (Optional)
            </h3>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your experience... What service did you use? How was the quality? Would you recommend?"
              className="min-h-[120px] resize-none"
              maxLength={1000}
            />
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 text-right">
              {comment.length}/1000 characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || rating === 0}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

const REVIEW_TAGS: TagOption[] = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'professional', label: 'Professional' },
  { value: 'clean', label: 'Clean & Hygienic' },
  { value: 'friendly', label: 'Friendly Staff' },
  { value: 'worth_it', label: 'Worth the Money' },
  { value: 'punctual', label: 'Punctual' },
  { value: 'skilled', label: 'Highly Skilled' },
  { value: 'relaxing', label: 'Relaxing Experience' }
];

interface Business {
  _id: string;
  businessName: string;
  name: string;
}

export function WriteReview() {
  const { businessId, serviceId } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const token = getAuthToken();

  useEffect(() => {
    if (businessId) {
      fetchBusinessDetails();
    }
  }, [businessId]);

  const fetchBusinessDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/api/business/${businessId}`);
      if (response.ok) {
        const data = await response.json();
        setBusiness(data);
      } else {
        toast.error('Business not found');
        navigate(-1);
      }
    } catch (error) {
      console.error('Failed to fetch business:', error);
      toast.error('Failed to load business details');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tagValue: string) => {
    setSelectedTags(prev =>
      prev.includes(tagValue)
        ? prev.filter(t => t !== tagValue)
        : [...prev, tagValue]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a star rating');
      return;
    }

    setSubmitting(true);
    try {
      const reviewData: any = {
        businessId,
        rating,
        comment
      };

      if (serviceId) {
        reviewData.serviceId = serviceId;
      }

      if (selectedTags.length > 0) {
        reviewData.tags = selectedTags;
      }

      const response = await fetch(`${API_URL}/api/auth/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Review submitted successfully!');
        
        // Redirect to business reviews page
        navigate(`/business/${businessId}/reviews`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Submit review error:', error);
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!business) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-neutral-600 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Write a Review
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Share your experience with <span className="font-semibold">{business.businessName || business.name}</span>
          </p>
        </div>

        {/* Business Preview */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 flex items-center gap-4 mb-8 shadow-sm">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-neutral-900 dark:text-white">
              {business.businessName || business.name}
            </h3>
            {business.location?.address && (
              <p className="text-sm text-neutral-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {business.location.address}, {business.location.city}
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Star Rating */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-100 dark:border-neutral-700 p-8">
            <div className="text-center">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                How was your experience?
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Tap the stars to rate (1 = poor, 5 = excellent)
              </p>
              
              <div className="flex justify-center mb-4">
                <StarRating 
                  rating={rating} 
                  interactive 
                  onRate={setRating}
                  size={48}
                />
              </div>
              
              {rating > 0 && (
                <p className="text-lg font-medium text-indigo-600 dark:text-indigo-400">
                  {rating === 1 && 'Poor - We can do better'}
                  {rating === 2 && 'Fair - Room for improvement'}
                  {rating === 3 && 'Good - Satisfactory'}
                  {rating === 4 && 'Very Good - Great experience'}
                  {rating === 5 && 'Excellent - Exceeded expectations!'}
                </p>
              )}
            </div>
          </div>

          {/* Optional Tags */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-100 dark:border-neutral-700 p-6">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
              What did you like? (Optional)
            </h3>
            <div className="flex flex-wrap gap-2">
              {REVIEW_TAGS.map((tag) => (
                <button
                  key={tag.value}
                  type="button"
                  onClick={() => handleTagToggle(tag.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTags.includes(tag.value)
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-100 dark:border-neutral-700 p-6">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
              Your Review (Optional)
            </h3>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your experience... What service did you use? How was the quality? Would you recommend?"
              className="min-h-[120px] resize-none"
              maxLength={1000}
            />
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 text-right">
              {comment.length}/1000 characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || rating === 0}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
