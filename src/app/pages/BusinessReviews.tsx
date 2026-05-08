import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Star, MapPin, Phone, Mail, ArrowLeft, Building2 } from "lucide-react";
import { StarRating } from "../components/StarRating";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

const API_URL = "https://booqlly.vercel.app";

interface User {
  _id: string;
  name: string;
  avatar?: string;
}

interface Review {
  _id: string;
  rating: number;
  comment?: string;
  tags?: string[];
  createdAt: string;
  user: User;
  isVerified: boolean;
}

interface Business {
  _id: string;
  businessName: string;
  name: string;
  businessPhone?: string;
  email: string;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  averageRating: number;
  reviewCount: number;
}

export function BusinessReviews() {
  const { businessId } = useParams();
  const [business, setBusiness] = useState<Business | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');

  useEffect(() => {
    if (businessId) {
      fetchBusinessDetails();
      fetchReviews();
    }
  }, [businessId, currentPage, sortBy]);

  const fetchBusinessDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/api/business/${businessId}`);
      if (response.ok) {
        const data = await response.json();
        setBusiness(data);
      }
    } catch (error) {
      console.error('Failed to fetch business:', error);
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        sort: sortBy
      });
      
      const response = await fetch(`${API_URL}/api/auth/businesses/${businessId}/reviews?${params}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !business) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Business not found</h2>
          <Link to="/">
            <Button className="mt-4">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-neutral-600 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Business Header */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-100 dark:border-neutral-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <Building2 className="w-12 h-12 text-white" />
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                {business.businessName || business.name}
              </h1>
              
              <div className="flex items-center gap-4 flex-wrap">
                {business.location?.address && (
                  <div className="flex items-center gap-2 text-neutral-600">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    <span>{business.location.address}, {business.location.city}</span>
                  </div>
                )}
                {business.businessPhone && (
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Phone className="w-4 h-4 text-indigo-500" />
                    <span>{business.businessPhone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-neutral-600">
                  <Mail className="w-4 h-4 text-indigo-500" />
                  <span>{business.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <StarRating rating={business.averageRating} size={20} showValue />
                  <span className="text-sm text-neutral-500">
                    ({business.reviewCount} review{business.reviewCount !== 1 ? 's' : ''})
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Link to={`/book?business=${businessId}`}>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-100 dark:border-neutral-700 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Customer Reviews ({business.reviewCount})
            </h2>
            
            <div className="flex items-center gap-2">
              <label className="text-sm text-neutral-600 dark:text-neutral-400">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'highest' | 'lowest')}
                className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
              >
                <option value="newest">Newest</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                No reviews yet
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400">
                Be the first to review this business!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div 
                  key={review._id}
                  className="border-b border-neutral-100 dark:border-neutral-700 pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
                      {review.user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-neutral-900 dark:text-white">
                          {review.user.name}
                        </h4>
                        {review.isVerified && (
                          <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <StarRating rating={review.rating} size={16} />
                        <span className="text-xs text-neutral-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {review.comment && (
                        <p className="text-neutral-600 dark:text-neutral-300 mb-3">
                          {review.comment}
                        </p>
                      )}

                      {review.tags && review.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {review.tags.map((tag, idx) => (
                            <span 
                              key={idx}
                              className="text-xs px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded"
                            >
                              {tag.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm text-neutral-600 dark:text-neutral-400">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
