// Server-side sorting function
function handleSortChange(sortValue) {
    const currentUrl = new URL(window.location);
    currentUrl.searchParams.set('sort', sortValue);
    window.location.href = currentUrl.toString();
}

// Optional: Client-side sorting for quick feedback (fallback)
document.addEventListener('DOMContentLoaded', () => {
    const sortSelect = document.getElementById('sort');
    const grid = document.querySelector('.product-grid');

    // Add loading indicator for better UX
    if (sortSelect) {
        sortSelect.addEventListener('change', function () {
            // Show loading state
            if (grid) {
                grid.style.opacity = '0.5';
                grid.style.pointerEvents = 'none';
            }
            
            // Add a small delay to show loading effect
            setTimeout(() => {
                handleSortChange(this.value);
            }, 100);
        });
    }

    // Client-side sorting as fallback (if server-side fails)
    function clientSideSort(sortOrder) {
        if (!grid) return;
        
        const productCards = Array.from(document.querySelectorAll('.product-card'));

        // Extract price values once to avoid repeated DOM access during sorting
        const productCardsWithPrices = productCards.map(card => {
            const priceText = card.querySelector('.price')?.textContent || '0';
            const price = parseFloat(priceText.replace('₹', '').trim());
            const name = card.querySelector('.product-name')?.textContent || '';
            return { card, price, name };
        });

        // Sort the array of objects
        if (sortOrder === 'price_desc') {
            productCardsWithPrices.sort((a, b) => b.price - a.price);
        } else if (sortOrder === 'price_asc') {
            productCardsWithPrices.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'name_asc') {
            productCardsWithPrices.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOrder === 'name_desc') {
            productCardsWithPrices.sort((a, b) => b.name.localeCompare(a.name));
        }

        // Use DocumentFragment for better performance when updating the DOM
        const fragment = document.createDocumentFragment();
        productCardsWithPrices.forEach(item => {
            fragment.appendChild(item.card);
        });

        // Clear and update the grid in one operation
        grid.innerHTML = '';
        grid.appendChild(fragment);
    }
});
