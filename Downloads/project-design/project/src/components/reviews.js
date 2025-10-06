export function renderReviewList(reviews, ratingInfo) {
  return `
    <div class="reviews-section">
      <h3>Avaliações (${ratingInfo.count})</h3>
      <div class="average-rating">
        Nota média: <strong>${ratingInfo.average.toFixed(1)}</strong> / 5
        ${'<span style="color:gold;">' + '★'.repeat(Math.round(ratingInfo.average)) + '</span>'}
      </div>
      <div class="review-list">
        ${reviews.length === 0 ? '<p>Seja o primeiro a avaliar este produto!</p>' :
          reviews.map(r => `
            <div class="review-item">
              <div class="review-header">
                <span class="review-username">${r.userName || 'Anônimo'}</span>
                <span class="review-rating">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
                <span class="review-date">${new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              <div class="review-text">${r.text}</div>
            </div>
          `).join('')
        }
      </div>
    </div>
  `;
}

export function renderReviewForm(productId) {
  return `
    <form id="review-form" data-product-id="${productId}" class="review-form">
      <h4>Deixe sua avaliação:</h4>
      <label>
        Nota:
        <select name="rating" required>
          <option value="">Escolha</option>
          <option value="1">1 - Ruim</option>
          <option value="2">2 - Regular</option>
          <option value="3">3 - Bom</option>
          <option value="4">4 - Muito Bom</option>
          <option value="5">5 - Excelente</option>
        </select>
      </label>
      <label>
        Comentário:
        <textarea name="text" rows="3" required></textarea>
      </label>
      <button type="submit" class="btn-primary">Enviar Avaliação</button>
    </form>
  `;
}