/**
 * This script integrates EmailJS to send order confirmation emails from the client side.
 * You need to sign up at https://www.emailjs.com/ and create a service, template, and user ID.
 * Replace the placeholders below with your actual EmailJS service ID, template ID, and user ID.
 */

(function() {
  emailjs.init("YOUR_USER_ID"); // Replace with your EmailJS user ID

  document.addEventListener('DOMContentLoaded', function() {
    const paymentForm = document.querySelector('.payment-form');
    if (paymentForm) {
      paymentForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Collect form data
        const formData = {
          name: paymentForm.querySelector('#name').value,
          card_number: paymentForm.querySelector('#card-number').value,
          expiry: paymentForm.querySelector('#expiry').value,
          cvv: paymentForm.querySelector('#cvv').value,
          notes: paymentForm.querySelector('#notes').value,
          email: paymentForm.querySelector('#email') ? paymentForm.querySelector('#email').value : ''
        };

        // Send email using EmailJS
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
          .then(function(response) {
            alert('Order confirmation email sent successfully!');
            paymentForm.reset();
          }, function(error) {
            alert('Failed to send email. Please try again later.');
            console.error('EmailJS error:', error);
          });
      });
    }
  });
})();
