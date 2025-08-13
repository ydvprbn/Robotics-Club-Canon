document.addEventListener('DOMContentLoaded', function() {
    // Initialize lightGallery if available
    if (typeof lightGallery !== 'undefined') {
        lightGallery(document.querySelector('.gallery-grid'), {
            selector: '.gallery-item',
            download: false,
            counter: false
        });
    }
    
    // Filter functionality
    const filterButtons = document.querySelectorAll('.gallery-filters .filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});