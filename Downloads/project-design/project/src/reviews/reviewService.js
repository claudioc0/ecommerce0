class ReviewService {
  constructor() {
    this.key = 'reviews';
    this._load();
  }

  _load() {
    const data = localStorage.getItem(this.key);
    this.reviews = data ? JSON.parse(data) : [];
  }

  _save() {
    localStorage.setItem(this.key, JSON.stringify(this.reviews));
  }

  addReview(reviewData) {
    // reviewData: {productId, userId, rating, text, userName, createdAt}
    this.reviews.push(reviewData);
    this._save();
  }

  getReviewsForProduct(productId) {
    return this.reviews.filter(r => r.productId === productId);
  }

  getAverageRatingForProduct(productId) {
    const productReviews = this.getReviewsForProduct(productId);
    if (productReviews.length === 0) return { average: 0, count: 0 };
    const sum = productReviews.reduce((acc, r) => acc + parseFloat(r.rating), 0);
    return {
      average: sum / productReviews.length,
      count: productReviews.length
    };
  }
}

export default ReviewService;