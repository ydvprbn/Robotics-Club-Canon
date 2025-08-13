document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const eventCards = document.querySelectorAll('.event-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter events
            eventCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Register button functionality
    const registerButtons = document.querySelectorAll('.register-btn');
    registerButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const eventTitle = this.closest('.event-card').querySelector('h3').textContent;
            alert(`Thank you for your interest in "${eventTitle}". We'll contact you with more details soon!`);
        });
    });
});


// Firebase Configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// DOM Elements
const form = document.getElementById('subscribe-form');
const emailInput = document.getElementById('newsletter-email');
const messageEl = document.getElementById('subscription-message');
const submitBtn = form.querySelector('button');

// Form Submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();

  // Validate email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showMessage('Please enter a valid email', 'error');
    return;
  }

  // Update UI
  submitBtn.disabled = true;
  submitBtn.textContent = 'Subscribing...';

  try {
    // Check for existing subscription
    const snapshot = await db.collection('subscribers')
      .where('email', '==', email)
      .get();

    if (!snapshot.empty) {
      showMessage('You are already subscribed!', 'info');
      return;
    }

    // Add new subscriber
    await db.collection('subscribers').add({
      email: email,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    showMessage('Thank you for subscribing!', 'success');
    form.reset();
  } catch (error) {
    console.error('Subscription error:', error);
    showMessage('Subscription failed. Please try again.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Subscribe';
  }
});

// Helper function to show messages
function showMessage(message, type) {
  messageEl.textContent = message;
  messageEl.style.display = 'block';
  messageEl.style.color = 
    type === 'error' ? '#dc3545' :
    type === 'success' ? '#28a745' : '#17a2b8';
  
  // Hide after 5 seconds
  setTimeout(() => {
    messageEl.style.display = 'none';
  }, 5000);
}
