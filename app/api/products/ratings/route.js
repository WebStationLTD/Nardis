import { NextResponse } from 'next/server';
import WooCommerce from '@/lib/woocomerce';
import { revalidatePath } from 'next/cache';

/**
 * GET handler for fetching product ratings
 * @param {Request} request - The incoming request
 * @returns {NextResponse} - JSON response with product ratings
 */
export async function GET(request) {
  try {
    // Get product ID from the URL query parameters
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');

    // Validate product ID
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Fetch product reviews from WooCommerce API
    const response = await WooCommerce.get(`products/reviews`, {
      product: productId,
      _fields: 'id,date_created,review,rating,reviewer,reviewer_avatar_urls,verified',
    });

    // Process the ratings data
    const reviews = response.data;
    
    // Calculate average rating
    const totalRatings = reviews.length;
    const sumRatings = reviews.reduce((sum, review) => sum + Number(review.rating), 0);
    const averageRating = totalRatings > 0 ? (sumRatings / totalRatings) : 0;
    
    // Count ratings by star level (1-5)
    const ratingCounts = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };
    
    reviews.forEach(review => {
      const rating = Number(review.rating);
      if (rating >= 1 && rating <= 5) {
        ratingCounts[rating]++;
      }
    });

    // Return formatted response
    return NextResponse.json({
      productId,
      reviews,
      stats: {
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalRatings,
        ratingCounts
      }
    });
    
  } catch (error) {
    console.error('Error fetching product ratings:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch product ratings' },
      { status: 500 }
    );
  }
}

/**
 * POST handler for adding a new product review
 * @param {Request} request - The incoming request
 * @returns {NextResponse} - JSON response with the created review
 */
export async function POST(request) {
  try {
    // Parse request body
    const reviewData = await request.json();
    
    // Validate required fields
    if (!reviewData.product_id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    // Validate rating (always required)
    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }
    
    // Prepare data for WooCommerce API
    const reviewPayload = {
      product_id: reviewData.product_id,
      rating: reviewData.rating
    };
    
    // Add review text if provided, otherwise use a placeholder for rating-only submissions
    if (reviewData.review) {
      reviewPayload.review = reviewData.review;
    } else {
      // Add default text for rating-only reviews that will satisfy WooCommerce validation
      // Using a rating description based on the star count
      const ratingDescriptions = {
        1: "1-star rating.",
        2: "2-star rating.",
        3: "3-star rating.",
        4: "4-star rating.",
        5: "5-star rating."
      };
      reviewPayload.review = ratingDescriptions[reviewData.rating] || `${reviewData.rating}-star rating.`;
    }
    
    // Handle anonymous reviews
    const isAnonymous = reviewData.anonymous === true;
    
    if (isAnonymous) {
      // For anonymous reviews, use default values
      reviewPayload.reviewer = reviewData.reviewer || 'Anonymous';
      
      // Use placeholder email if not provided
      if (!reviewData.reviewer_email) {
        // Generate a random placeholder email
        const randomId = Math.random().toString(36).substring(2, 10);
        reviewPayload.reviewer_email = `anonymous_${randomId}@example.com`;
      } else {
        reviewPayload.reviewer_email = reviewData.reviewer_email;
      }
      
      // Mark as anonymous in the WooCommerce meta if supported
      reviewPayload.meta = [
        {
          key: 'is_anonymous',
          value: 'true'
        }
      ];
      
      // If rating-only, add that to metadata too
      if (!reviewData.review) {
        reviewPayload.meta = [
          ...(reviewPayload.meta || []),
          {
            key: 'rating_only',
            value: 'true'
          }
        ];
      }
    } else {
      // For identified users, require name and email
      if (!reviewData.reviewer) {
        return NextResponse.json(
          { error: 'Reviewer name is required for non-anonymous reviews' },
          { status: 400 }
        );
      }
      
      if (!reviewData.reviewer_email) {
        return NextResponse.json(
          { error: 'Reviewer email is required for non-anonymous reviews' },
          { status: 400 }
        );
      }
      
      reviewPayload.reviewer = reviewData.reviewer;
      reviewPayload.reviewer_email = reviewData.reviewer_email;
      
      // Add rating-only metadata if applicable
      if (!reviewData.review) {
        reviewPayload.meta = [
          ...(reviewPayload.meta || []),
          {
            key: 'rating_only',
            value: 'true'
          }
        ];
      }
    }
    
    // Add optional fields if present
    if (reviewData.status) {
      reviewPayload.status = reviewData.status;
    }
    
    // Add verification status if available
    if (reviewData.verified === true) {
      reviewPayload.verified = true;
    }
    
    // Submit review to WooCommerce API
    const response = await WooCommerce.post('products/reviews', reviewPayload);
    
    // Revalidate the ratings path to reflect new review
    revalidatePath(`/api/products/ratings?id=${reviewData.product_id}`);
    
    return NextResponse.json({
      success: true,
      review: response.data
    });
    
  } catch (error) {
    console.error('Error submitting product review:', error);
    
    // Extract WooCommerce error message if available
    const errorMessage = error.response?.data?.message || 'Failed to submit product review';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: error.response?.status || 500 }
    );
  }
}

/**
 * Revalidate product ratings cache
 */
export async function PATCH(request) {
  try {
    const { productId } = await request.json();
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    // Revalidate the path to force a refresh
    revalidatePath(`/api/products/ratings?id=${productId}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error revalidating product ratings:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate ratings' },
      { status: 500 }
    );
  }
} 