// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyApmT6XvMEgGLuLYK4BsNL-9I9uWeMfKg4",
    authDomain: "robotic-club-of-canon.firebaseapp.com",
    databaseURL: "https://robotic-club-of-canon-default-rtdb.firebaseio.com",
    projectId: "robotic-club-of-canon",
    storageBucket: "robotic-club-of-canon.firebasestorage.app",
    messagingSenderId: "309553650943",
    appId: "1:309553650943:web:b5f79781f2bd4edb8000ca"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const contactRef = database.ref('contacts');

// Form submission
document.getElementById('contactForm').addEventListener('submit', submitForm);

function submitForm(e) {
    e.preventDefault();
    
    const name = getValue('name');
    const email = getValue('email');
    const subject = getValue('subject');
    const message = getValue('message');
    
    saveMessage(name, email, subject, message);
    showToast('Message sent successfully!');
    document.getElementById('contactForm').reset();
}

function getValue(id) {
    return document.getElementById(id).value;
}

function saveMessage(name, email, subject, message) {
    const newContact = contactRef.push();
    newContact.set({
        name: name,
        email: email,
        subject: subject || 'No subject',
        message: message,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}