class WishlistService {
  constructor() {
    this.key = 'wishlist';
    this._load();
  }

  _load() {
    const data = localStorage.getItem(this.key);
    this.wishlist = data ? JSON.parse(data) : {};
  }

  _save() {
    localStorage.setItem(this.key, JSON.stringify(this.wishlist));
  }

  addItem(userId, productId) {
    if (!this.wishlist[userId]) {
      this.wishlist[userId] = [];
    }
    if (!this.wishlist[userId].includes(productId)) {
      this.wishlist[userId].push(productId);
      this._save();
    }
  }

  removeItem(userId, productId) {
    if (!this.wishlist[userId]) return;
    this.wishlist[userId] = this.wishlist[userId].filter(id => id !== productId);
    this._save();
  }

  getItemsByUser(userId) {
    return this.wishlist[userId] || [];
  }

  isInWishlist(userId, productId) {
    return this.wishlist[userId]?.includes(productId) || false;
  }
}

export default WishlistService;