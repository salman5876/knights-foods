// Handle checkout process
async function handleCheckout() {
    if (!validateFormSection()) {
        showNotification('Please fill in all required fields correctly', 'error');
        return;
    }

    if (!selectedPaymentMethod) {
        showNotification('Please select a payment method', 'error');
        return;
    }

    // Collect form data
    const formData = {
        customer: {
            name: document.getElementById('userName').value,
            email: document.getElementById('userEmail').value,
            phone: document.getElementById('userPhone').value,
            address: document.getElementById('userAddress').value,
            notes: document.getElementById('orderNotes').value,
            deliveryTime: document.getElementById('deliveryTime').value
        },
        items: window.cart,
        paymentMethod: selectedPaymentMethod,
        total: window.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + deliveryFee
    };

    try {
        // Create a hidden form for Formspree submission
        const form = document.createElement('form');
        form.style.display = 'none';
        form.method = 'POST';
        form.action = 'https://formspree.io/f/mvgayjrw';

        // Add form fields
        const emailInput = document.createElement('input');
        emailInput.type = 'hidden';
        emailInput.name = 'email';
        emailInput.value = formData.customer.email;
        form.appendChild(emailInput);

        const messageInput = document.createElement('textarea');
        messageInput.name = 'message';
        messageInput.value = JSON.stringify(formData, null, 2);
        form.appendChild(messageInput);

        // Add form to document and submit
        document.body.appendChild(form);
        form.submit();

        // Show success message
        showNotification('Order placed successfully! Thank you for your order.', 'success');
        
        // Clear cart and form
        window.cart = [];
        userInfoForm.reset();
        updateCartDisplay();
        
        // Reset payment method selection
        document.querySelectorAll('.payment-method').forEach(el => {
            el.classList.remove('selected');
        });
        selectedPaymentMethod = null;
        
        // Reset progress
        updateOrderProgress(1);
        
    } catch (error) {
        showNotification('There was an error processing your order. Please try again.', 'error');
    }
}
