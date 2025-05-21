let productFileHandle = null;
let dealFileHandle = null;


// Format price to PKR currency
window.formatPrice = function(price) {
    return `PKR ${price.toLocaleString()}`;
};

// Initialize admin functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeImagePreviews();
    loadProducts();
    loadDeals();
    setupEventListeners();
    addDownloadButtons();
});

// Initialize image preview functionality
function initializeImagePreviews() {
    const imageInputs = document.querySelectorAll('input[type="file"]');
    imageInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const preview = this.parentElement.querySelector('.preview-image');
            if (preview) {
                preview.src = URL.createObjectURL(this.files[0]);
                preview.classList.remove('d-none');
            }
        });
    });
}

// Load products from default array
function loadProducts() {
    // Use the default products array (window.products should be defined in products.js)
    const tbody = document.querySelector('#productsTable tbody');
    tbody.innerHTML = '';

    window.products.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <img src="${product.image}" alt="${product.name}" class="product-image" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
            </td>
            <td>
                <strong>${product.name}</strong>
                <br>
                <small class="text-muted">${product.description}</small>
            </td>
            <td>
                <span class="badge bg-primary">${product.category}</span>
                ${product.isPopular ? '<span class="badge bg-warning ms-1">Popular</span>' : ''}
            </td>
            <td>
                <strong>${window.formatPrice(product.price)}</strong>
                ${product.originalPrice ? `<br><small class="text-muted text-decoration-line-through">${window.formatPrice(product.originalPrice)}</small>` : ''}
            </td>
            <td>
                <div class="d-flex align-items-center">
                    <i class="fas fa-star text-warning me-1"></i>
                    <span>${product.rating}</span>
                </div>
            </td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-primary" onclick="editProduct(${product.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Update product options in deal form
    const productSelect = document.querySelector('select[name="includedItems"]');
    if (productSelect) {
        productSelect.innerHTML = window.products.map(product => 
            `<option value="${product.id}">${product.name} - ${window.formatPrice(product.price)}</option>`
        ).join('');
    }
}

// Load deals from default array
function loadDeals() {
    // Use the default deals array (window.deals should be defined in deals.js)
    const tbody = document.querySelector('#dealsTable tbody');
    tbody.innerHTML = '';

    window.deals.forEach(deal => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <img src="${deal.image}" alt="${deal.name}" class="deal-image" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
            </td>
            <td>
                <strong>${deal.name}</strong>
                <br>
                <small class="text-muted">${deal.description}</small>
            </td>
            <td>
                <strong>${window.formatPrice(deal.originalPrice)}</strong>
                <br>
                <small class="text-success">${deal.discount}% OFF</small>
            </td>
            <td>
                <strong>${window.formatPrice(deal.price)}</strong>
                <br>
                <small class="text-muted">Save ${window.formatPrice(deal.originalPrice - deal.price)}</small>
            </td>
            <td>
                <div class="d-flex flex-column">
                    <span>${new Date(deal.validUntil).toLocaleDateString()}</span>
                    <small class="text-muted">${deal.timeLimit.hours}h ${deal.timeLimit.minutes}m</small>
                </div>
            </td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-primary" onclick="editDeal('${deal.id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteDeal('${deal.id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Convert image file to base64
function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Save product
    document.getElementById('saveProduct').addEventListener('click', async function() {
        const form = document.getElementById('productForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const imageFile = formData.get('image');
        
        try {
            const base64Image = imageFile.size > 0 ? await convertImageToBase64(imageFile) : null;
            
            const productData = {
                id: window.products.length + 1,
                name: formData.get('name'),
                category: formData.get('category'),
                price: parseFloat(formData.get('price')),
                originalPrice: formData.get('originalPrice') ? parseFloat(formData.get('originalPrice')) : null,
                rating: parseFloat(formData.get('rating')),
                description: formData.get('description'),
                isPopular: formData.get('isPopular') === 'on',
                image: base64Image
            };

            window.products.push(productData);
            loadProducts();
            
            bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide();
            showNotification('Product added successfully!');
            form.reset();
        } catch (error) {
            console.error('Error processing image:', error);
            showNotification('Error processing image', 'error');
        }
    });

    // Save deal
    document.getElementById('saveDeal').addEventListener('click', async function() {
        const form = document.getElementById('dealForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const imageFile = formData.get('image');
        
        try {
            const base64Image = imageFile.size > 0 ? await convertImageToBase64(imageFile) : null;
            
            const dealData = {
                id: `deal-${Date.now()}`,
                name: formData.get('name'),
                description: formData.get('description'),
                price: parseFloat(formData.get('dealPrice')),
                originalPrice: parseFloat(formData.get('originalPrice')),
                image: base64Image,
                isPopular: formData.get('isPopular') === 'on',
                category: formData.get('category'),
                items: Array.from(formData.getAll('includedItems')).map(id => {
                    const product = window.products.find(p => p.id === parseInt(id));
                    return product ? product.name : '';
                }),
                validUntil: formData.get('expiryDate'),
                discount: Math.round(((parseFloat(formData.get('originalPrice')) - parseFloat(formData.get('dealPrice'))) / parseFloat(formData.get('originalPrice'))) * 100),
                timeLimit: {
                    hours: 24,
                    minutes: 0,
                    seconds: 0
                }
            };

            window.deals.push(dealData);
            loadDeals();
            
            bootstrap.Modal.getInstance(document.getElementById('addDealModal')).hide();
            showNotification('Deal added successfully!');
            form.reset();
        } catch (error) {
            console.error('Error processing image:', error);
            showNotification('Error processing image', 'error');
        }
    });
}

// Edit product
async function editProduct(productId) {
    const product = window.products.find(p => p.id === productId);
    if (!product) return;

    // Create and show edit modal
    const modal = createEditProductModal(product);
    document.body.appendChild(modal);
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();

    // Handle save
    modal.querySelector('#saveEditProduct').addEventListener('click', async function() {
        const form = modal.querySelector('form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const imageFile = formData.get('image');
        
        try {
            const base64Image = imageFile.size > 0 ? await convertImageToBase64(imageFile) : product.image;
            
            const updatedProduct = {
                ...product,
                name: formData.get('name'),
                category: formData.get('category'),
                price: parseFloat(formData.get('price')),
                rating: parseFloat(formData.get('rating')),
                description: formData.get('description'),
                isPopular: formData.get('isPopular') === 'on',
                image: base64Image
            };

            const index = window.products.findIndex(p => p.id === productId);
            window.products[index] = updatedProduct;
            loadProducts();
            
            modalInstance.hide();
            modal.remove();
            showNotification('Product updated successfully!');
        } catch (error) {
            console.error('Error processing image:', error);
            showNotification('Error processing image', 'error');
        }
    });
}

// Edit deal
async function editDeal(dealId) {
    const deal = window.deals.find(d => d.id === dealId);
    if (!deal) return;

    // Create and show edit modal
    const modal = createEditDealModal(deal);
    document.body.appendChild(modal);
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();

    // Handle save
    modal.querySelector('#saveEditDeal').addEventListener('click', async function() {
        const form = modal.querySelector('form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const imageFile = formData.get('image');
        
        try {
            const base64Image = imageFile.size > 0 ? await convertImageToBase64(imageFile) : deal.image;
            
            const updatedDeal = {
                ...deal,
                name: formData.get('name'),
                originalPrice: parseFloat(formData.get('originalPrice')),
                price: parseFloat(formData.get('dealPrice')),
                description: formData.get('description'),
                expiryDate: formData.get('expiryDate'),
                image: base64Image,
                includedItems: Array.from(formData.getAll('includedItems')).map(id => parseInt(id))
            };

            const index = window.deals.findIndex(d => d.id === dealId);
            window.deals[index] = updatedDeal;
            loadDeals();
            
            modalInstance.hide();
            modal.remove();
            showNotification('Deal updated successfully!');
        } catch (error) {
            console.error('Error processing image:', error);
            showNotification('Error processing image', 'error');
        }
    });
}

// Delete product
function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const index = window.products.findIndex(p => p.id === productId);
    if (index > -1) {
        window.products.splice(index, 1);
        loadProducts();
        showNotification('Product deleted successfully!');
    }
}

// Delete deal
function deleteDeal(dealId) {
    if (!confirm('Are you sure you want to delete this deal?')) return;

    const index = window.deals.findIndex(d => d.id === dealId);
    if (index > -1) {
        window.deals.splice(index, 1);
        loadDeals();
        showNotification('Deal deleted successfully!');
    }
}

// Create edit product modal
function createEditProductModal(product) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Product</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Name</label>
                                    <input type="text" class="form-control" name="name" value="${product.name}" required>
                                </div>
                                <div class="form-group">
                                    <label>Category</label>
                                    <select class="form-control" name="category" required>
                                        <option value="appetizer" ${product.category === 'appetizer' ? 'selected' : ''}>Appetizer</option>
                                        <option value="main" ${product.category === 'main' ? 'selected' : ''}>Main Course</option>
                                        <option value="dessert" ${product.category === 'dessert' ? 'selected' : ''}>Dessert</option>
                                        <option value="beverage" ${product.category === 'beverage' ? 'selected' : ''}>Beverage</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Price</label>
                                    <input type="number" class="form-control" name="price" value="${product.price}" required>
                                </div>
                                <div class="form-group">
                                    <label>Rating</label>
                                    <input type="number" class="form-control" name="rating" min="0" max="5" step="0.1" value="${product.rating}" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Description</label>
                                    <textarea class="form-control" name="description" rows="3" required>${product.description}</textarea>
                                </div>
                                <div class="form-group">
                                    <label>Image</label>
                                    <input type="file" class="form-control" name="image" accept="image/*">
                                    <img src="${product.image}" class="preview-image mt-2" style="max-width: 200px;">
                                </div>
                                <div class="form-check mt-3">
                                    <input type="checkbox" class="form-check-input" name="isPopular" ${product.isPopular ? 'checked' : ''}>
                                    <label class="form-check-label">Mark as Popular</label>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="saveEditProduct">Save Changes</button>
                </div>
            </div>
        </div>
    `;
    return modal;
}

// Create edit deal modal
function createEditDealModal(deal) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Deal</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Deal Name</label>
                                    <input type="text" class="form-control" name="name" value="${deal.name}" required>
                                </div>
                                <div class="form-group">
                                    <label>Original Price</label>
                                    <input type="number" class="form-control" name="originalPrice" value="${deal.originalPrice}" required>
                                </div>
                                <div class="form-group">
                                    <label>Deal Price</label>
                                    <input type="number" class="form-control" name="dealPrice" value="${deal.price}" required>
                                </div>
                                <div class="form-group">
                                    <label>Expiry Date</label>
                                    <input type="datetime-local" class="form-control" name="expiryDate" value="${deal.expiryDate}" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Description</label>
                                    <textarea class="form-control" name="description" rows="3" required>${deal.description}</textarea>
                                </div>
                                <div class="form-group">
                                    <label>Image</label>
                                    <input type="file" class="form-control" name="image" accept="image/*">
                                    <img src="${deal.image}" class="preview-image mt-2" style="max-width: 200px;">
                                </div>
                                <div class="form-group">
                                    <label>Included Items</label>
                                    <select class="form-control" name="includedItems" multiple required>
                                        ${window.products.map(product => `
                                            <option value="${product.id}" ${deal.includedItems.includes(product.id) ? 'selected' : ''}>
                                                ${product.name} - ${window.formatPrice(product.price)}
                                            </option>
                                        `).join('')}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="saveEditDeal">Save Changes</button>
                </div>
            </div>
        </div>
    `;
    return modal;
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
    notification.style.zIndex = '9999';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Download updated products.js file
function downloadProductsFile() {
    try {
        const productsContent = '// Product data\n' +
            'const products = ' + JSON.stringify(window.products, null, 4) + ';\n\n' +
            '// Make products array globally accessible\n' +
            'window.products = products;\n\n' +
            '// Export the products array\n' +
            'if (typeof module !== \'undefined\' && module.exports) {\n' +
            '    module.exports = { products };\n' +
            '}';

        const blob = new Blob([productsContent], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'products.js';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification('Products file downloaded! Please replace your products.js file with this one.');
    } catch (error) {
        console.error('Error downloading products file:', error);
        showNotification('Error downloading products file', 'error');
    }
}

// Download updated deals.js file
function downloadDealsFile() {
    try {
        const dealsContent = '// Deals data structure\n' +
            'window.deals = ' + JSON.stringify(window.deals, null, 4) + ';\n\n' +
            '// Create deal card HTML\n' +
            'function createDealCard(deal) {\n' +
            '    const timeLeft = calculateTimeLeft(deal.timeLimit);\n' +
            '    const savings = deal.originalPrice - deal.price;\n' +
            '    return `<div class="col-md-4 mb-4">\n' +
            '        <div class="deal-card ${deal.isPopular ? \'featured\' : \'\'}" data-deal-id="${deal.id}">\n' +
            '            <div class="deal-image">\n' +
            '                <img src="${deal.image}" alt="${deal.name}" loading="lazy">\n' +
            '                ${deal.isPopular ? \'<div class="deal-badge">Popular</div>\' : \'\'}\n' +
            '                <div class="deal-badge permanent">\n' +
            '                    <i class="fas fa-tag"></i> ${deal.discount}% OFF\n' +
            '                </div>\n' +
            '            </div>\n' +
            '            <div class="deal-content">\n' +
            '                <div class="deal-header">\n' +
            '                    <h3>${deal.name}</h3>\n' +
            '                    <p>${deal.description}</p>\n' +
            '                </div>\n' +
            '                <ul class="deal-items">\n' +
            '                    ${deal.items.map(item => `<li><i class="fas fa-check"></i> ${item}</li>`).join(\'\')}\n' +
            '                </ul>\n' +
            '                <div class="deal-price">\n' +
            '                    <div class="price-info">\n' +
            '                        <span class="original-price">PKR ${deal.originalPrice.toLocaleString()}</span>\n' +
            '                        <span class="current-price">PKR ${deal.price.toLocaleString()}</span>\n' +
            '                    </div>\n' +
            '                    <div class="savings">\n' +
            '                        <i class="fas fa-piggy-bank"></i> Save ${deal.discount}%\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '                <div class="deal-timer">\n' +
            '                    <div class="timer-item">\n' +
            '                        <span class="timer-number">${timeLeft.hours.toString().padStart(2, \'0\')}</span>\n' +
            '                        <span class="timer-label">Hours</span>\n' +
            '                    </div>\n' +
            '                    <div class="timer-item">\n' +
            '                        <span class="timer-number">${timeLeft.minutes.toString().padStart(2, \'0\')}</span>\n' +
            '                        <span class="timer-label">Minutes</span>\n' +
            '                    </div>\n' +
            '                    <div class="timer-item">\n' +
            '                        <span class="timer-number">${timeLeft.seconds.toString().padStart(2, \'0\')}</span>\n' +
            '                        <span class="timer-label">Seconds</span>\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '                <button class="btn-add-to-cart" onclick="addDealToCart(\'${deal.id}\')">\n' +
            '                    <span class="btn-text">Add to Cart</span>\n' +
            '                    <i class="fas fa-shopping-cart"></i>\n' +
            '                </button>\n' +
            '            </div>\n' +
            '        </div>\n' +
            '    </div>`;\n' +
            '}\n\n' +
            '// Calculate time left\n' +
            'function calculateTimeLeft(timeLimit) {\n' +
            '    const now = new Date();\n' +
            '    const endTime = new Date(now.getTime() + (timeLimit.hours * 60 * 60 * 1000) + (timeLimit.minutes * 60 * 1000) + (timeLimit.seconds * 1000));\n' +
            '    const timeLeft = endTime - now;\n' +
            '    \n' +
            '    return {\n' +
            '        hours: Math.floor(timeLeft / (1000 * 60 * 60)),\n' +
            '        minutes: Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)),\n' +
            '        seconds: Math.floor((timeLeft % (1000 * 60)) / 1000)\n' +
            '    };\n' +
            '}\n\n' +
            '// Initialize deal timers\n' +
            'function initializeDealTimers() {\n' +
            '    const dealCards = document.querySelectorAll(\'.deal-card\');\n' +
            '    dealCards.forEach(dealCard => {\n' +
            '        const dealId = dealCard.dataset.dealId;\n' +
            '        const deal = window.deals.find(d => d.id === dealId);\n' +
            '        if (!deal) return;\n' +
            '        \n' +
            '        const timerNumbers = dealCard.querySelectorAll(\'.timer-number\');\n' +
            '        const hoursElement = timerNumbers[0];\n' +
            '        const minutesElement = timerNumbers[1];\n' +
            '        const secondsElement = timerNumbers[2];\n' +
            '        \n' +
            '        setInterval(() => {\n' +
            '            const timeLeft = calculateTimeLeft(deal.timeLimit);\n' +
            '            \n' +
            '            updateTimerDigit(hoursElement, timeLeft.hours);\n' +
            '            updateTimerDigit(minutesElement, timeLeft.minutes);\n' +
            '            updateTimerDigit(secondsElement, timeLeft.seconds);\n' +
            '            \n' +
            '            // Add urgency animation when time is running low\n' +
            '            if (timeLimit.hours === 0 && timeLimit.minutes < 30) {\n' +
            '                dealCard.classList.add(\'urgent\');\n' +
            '            }\n' +
            '        }, 1000);\n' +
            '    });\n' +
            '}\n\n' +
            '// Update timer digit with animation\n' +
            'function updateTimerDigit(element, value) {\n' +
            '    const currentValue = element.textContent;\n' +
            '    const newValue = value.toString().padStart(2, \'0\');\n\n' +
            '    if (currentValue !== newValue) {\n' +
            '        element.classList.add(\'flip\');\n' +
            '        setTimeout(() => {\n' +
            '            element.textContent = newValue;\n' +
            '            element.classList.remove(\'flip\');\n' +
            '        }, 300);\n' +
            '    }\n' +
            '}\n\n' +
            '// Add deal to cart\n' +
            'function addDealToCart(dealId) {\n' +
            '    const deal = window.deals.find(d => d.id === dealId);\n' +
            '    if (!deal) {\n' +
            '        showNotification(\'Deal not found!\', \'error\');\n' +
            '        return;\n' +
            '    }\n\n' +
            '    try {\n' +
            '        // Initialize cart if it doesn\'t exist\n' +
            '        if (!window.cart) {\n' +
            '            window.cart = [];\n' +
            '        }\n\n' +
            '        // Add to cart\n' +
            '        const existingItem = window.cart.find(item => item.id === dealId);\n' +
            '        if (existingItem) {\n' +
            '            existingItem.quantity++;\n' +
            '            showNotification(`Added another ${deal.name} to cart!`, \'success\');\n' +
            '        } else {\n' +
            '            window.cart.push({\n' +
            '                id: deal.id,\n' +
            '                name: deal.name,\n' +
            '                price: deal.price,\n' +
            '                image: deal.image,\n' +
            '                quantity: 1\n' +
            '            });\n' +
            '            showNotification(`Added ${deal.name} to cart!`, \'success\');\n' +
            '        }\n' +
            '        \n' +
            '        // Update cart display\n' +
            '        if (typeof updateCartDisplay === \'function\') {\n' +
            '            updateCartDisplay();\n' +
            '        }\n' +
            '    } catch (error) {\n' +
            '        console.error(\'Error adding deal to cart:\', error);\n' +
            '        showNotification(\'Error adding deal to cart\', \'error\');\n' +
            '    }\n' +
            '}\n\n' +
            '// Initialize deal timers when DOM is loaded\n' +
            'document.addEventListener(\'DOMContentLoaded\', initializeDealTimers);';

        const blob = new Blob([dealsContent], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'deals.js';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification('Deals file downloaded! Please replace your deals.js file with this one.');
    } catch (error) {
        console.error('Error downloading deals file:', error);
        showNotification('Error downloading deals file', 'error');
    }
}

// Add download buttons to tables
function addDownloadButtons() {
    const productsTable = document.querySelector('#productsTable');
    const dealsTable = document.querySelector('#dealsTable');

    if (productsTable) {
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'btn btn-success mb-3';
        downloadBtn.innerHTML = '<i class="fas fa-download me-2"></i>Download Products File';
        downloadBtn.onclick = downloadProductsFile;
        productsTable.parentElement.insertBefore(downloadBtn, productsTable);
    }

    if (dealsTable) {
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'btn btn-success mb-3';
        downloadBtn.innerHTML = '<i class="fas fa-download me-2"></i>Download Deals File';
        downloadBtn.onclick = downloadDealsFile;
        dealsTable.parentElement.insertBefore(downloadBtn, dealsTable);
    }
} 