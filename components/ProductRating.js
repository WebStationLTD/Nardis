"use client";

import { useState, useEffect } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import LoadingSpinner from "./LoadingSpinner";

/**
 * Reusable Product Rating component for displaying and submitting ratings
 * @param {Object} props - Component props
 * @param {number} props.productId - ID of the product being rated
 * @param {boolean} props.hideForm - Whether to hide the rating form (display only mode)
 * @param {boolean} props.showStats - Whether to show rating statistics
 * @param {boolean} props.showReviews - Whether to show existing reviews
 * @param {boolean} props.minimalistic - Whether to use a more compact/minimalistic design
 * @param {Object} props.initialData - Optional initial data to avoid fetch on first render
 */
export default function ProductRating({
  productId,
  hideForm = false,
  showStats = true,
  showReviews = true,
  minimalistic = false,
  initialData = null,
  className = "",
}) {
  // State for form and data
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [userData, setUserData] = useState(null);

  // State for reviews data
  const [isLoading, setIsLoading] = useState(!initialData);
  const [ratingsData, setRatingsData] = useState(
    initialData || {
      reviews: [],
      stats: {
        averageRating: 0,
        totalRatings: 0,
        ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      },
    }
  );

  // Fetch user data if available
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/auth/user");
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUserData(data.user);
            setName(data.user.username || "");
            setEmail(data.user.email || "");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Fetch ratings for the product
  useEffect(() => {
    if (initialData || !productId) return;

    const fetchRatings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/products/ratings?id=${productId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch ratings");
        }

        const data = await response.json();
        setRatingsData(data);
      } catch (error) {
        console.error("Error fetching product ratings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRatings();
  }, [productId, initialData]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setSubmitError("Please select a rating");
      return;
    }

    // If not anonymous and name/email not provided
    if (!anonymous && (!name || !email)) {
      setSubmitError(
        "Моля, предоставете вашето име и имейл, освен ако не искате да бъдете анонимен"
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const reviewData = {
        product_id: productId,
        rating,
        review,
        anonymous,
      };

      // Only add these fields if not anonymous
      if (!anonymous) {
        reviewData.reviewer = name;
        reviewData.reviewer_email = email;
      }

      const response = await fetch("/api/products/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit review");
      }

      // Reset form
      setRating(0);
      setReview("");
      if (!userData) {
        setName("");
        setEmail("");
      }
      setAnonymous(false);
      setSubmitSuccess(true);

      // Refresh ratings data
      const updatedRatings = await fetch(
        `/api/products/ratings?id=${productId}`
      );
      if (updatedRatings.ok) {
        const newData = await updatedRatings.json();
        setRatingsData(newData);
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting review:", error);
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const { averageRating, totalRatings, ratingCounts } = ratingsData.stats || {};

  // Minimalistic view for compact display
  if (minimalistic && showStats) {
    return (
      <div className={`flex items-center ${className}`}>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={`h-4 w-4 ${
                star <= Math.round(averageRating)
                  ? "text-indigo-500"
                  : "text-gray-300"
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
        <p className="ml-2 text-xs text-gray-500">
          {totalRatings > 0 ? (
            <>
              <span className="font-medium text-gray-700">
                {averageRating.toFixed(1)}
              </span>
              <span className="ml-1">({totalRatings})</span>
            </>
          ) : (
            "Все още няма ревюта"
          )}
        </p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Average Rating Display */}
      {showStats && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(averageRating)
                      ? "text-[#b3438f]"
                      : "text-gray-300"
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
            <p className="ml-2 text-sm text-gray-700">
              {averageRating ? averageRating.toFixed(1) : "0"} out of 5 stars
              <span className="ml-1 text-gray-500">
                ({totalRatings} ревюта)
              </span>
            </p>
          </div>

          {/* Rating Distribution */}
          {showStats && totalRatings > 0 && (
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center text-sm mb-1">
                  <span className="w-8 text-gray-600">{star} star</span>
                  <div className="flex-1 h-2 mx-2 bg-gray-200 rounded">
                    <div
                      className="h-2 bg-[#b3438f] rounded"
                      style={{
                        width: `${Math.round(
                          (ratingCounts[star] / totalRatings) * 100
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="w-12 text-gray-600 text-xs">
                    {Math.round((ratingCounts[star] / totalRatings) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center my-6">
          <LoadingSpinner />
        </div>
      )}

      {/* Review Form */}
      {!hideForm && !isLoading && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Оставете вашето ревю
          </h3>

          {submitSuccess && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              Вашето ревю е изпратено успешно!
            </div>
          )}

          {submitError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star Rating Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Вашето ревю <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-1"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                  >
                    {hoveredRating >= star ||
                    (!hoveredRating && rating >= star) ? (
                      <StarIcon
                        className="h-7 w-7 text-indigo-500"
                        aria-hidden="true"
                      />
                    ) : (
                      <StarIconOutline
                        className="h-7 w-7 text-gray-400"
                        aria-hidden="true"
                      />
                    )}
                    <span className="sr-only">{star} stars</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label
                htmlFor="review"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Вашето ревю (незадължително)
              </label>
              <textarea
                id="review"
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Споделете опита си с този продукт..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </div>

            {/* Anonymous Option */}
            <div>
              <div className="flex items-center">
                <input
                  id="anonymous"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                />
                <label
                  htmlFor="anonymous"
                  className="ml-2 text-sm text-gray-700"
                >
                  Оставете анонимно
                </label>
              </div>
            </div>

            {/* Name and Email (only if not anonymous) */}
            {!anonymous && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Вашето име <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!!userData}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Вашият имейл <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!!userData}
                  />
                  {userData && (
                    <p className="mt-1 text-xs text-gray-500">
                      Влезли сте като {userData.email}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full border cursor-pointer border-transparent rounded-md py-2 px-4 flex justify-center items-center bg-[#b3438f] hover:bg-[#ebedeb] text-white hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
            >
              {isSubmitting ? (
                <LoadingSpinner size="small" color="white" />
              ) : (
                "Изпратете ревюто"
              )}
            </button>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {/* {showReviews &&
        !isLoading &&
        ratingsData.reviews &&
        ratingsData.reviews.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Клиентски ревюта
            </h3>
            <div className="space-y-4">
              {ratingsData.reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-200 pb-4 mb-4 last:border-0"
                >
                  <div className="flex items-center mb-1">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? "text-indigo-500"
                              : "text-gray-300"
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="ml-2 text-sm font-medium text-gray-900">
                      {review.reviewer}
                      {review.verified && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 py-0.5 px-2 rounded-full">
                          Верифициран
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    {formatDate(review.date_created)}
                  </p>
                  {review.review && (
                    <div
                      className="text-sm text-gray-700"
                      dangerouslySetInnerHTML={{ __html: review.review }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )} */}
    </div>
  );
}
