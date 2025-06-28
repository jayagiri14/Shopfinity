document.addEventListener('DOMContentLoaded', () => {
    const sortSelect = document.getElementById('sort');
    const grid = document.querySelector('.product-grid');

    if (sortSelect && grid) {
        sortSelect.addEventListener('change', function () {
            const sortOrder = this.value;
            const productCards = Array.from(document.querySelectorAll('.product-card'));

            // Extract price values once to avoid repeated DOM access during sorting
            const productCardsWithPrices = productCards.map(card => {
                const priceText = card.querySelector('.price').textContent;
                const price = parseFloat(priceText.replace('₹', '').trim());
                return { card, price };
            });

            // Sort the array of objects by price
            if (sortOrder === 'desc') {
                productCardsWithPrices.sort((a, b) => b.price - a.price);
            } else if (sortOrder === 'aesc') {
                productCardsWithPrices.sort((a, b) => a.price - b.price);
            }

            // Use DocumentFragment for better performance when updating the DOM
            const fragment = document.createDocumentFragment();
            productCardsWithPrices.forEach(item => {
                fragment.appendChild(item.card);
            });

            // Clear and update the grid in one operation
            grid.innerHTML = '';
            grid.appendChild(fragment);
        });
    }
});