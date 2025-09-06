// Check if user is logged in
let currentUser = null;
const token = localStorage.getItem('token');
if (token) {
  currentUser = JSON.parse(localStorage.getItem('user') || '{}');
}

function handleKey(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}

function sendQuickMessage(text) {
  document.getElementById("userInput").value = text;
  sendMessage();
}

async function sendMessage() {
  const inputField = document.getElementById("userInput");
  const userInput = inputField.value.trim();
  if (!userInput) return;

  addMessage("user", userInput);
  inputField.value = "";

  try {
    let response;
    const token = localStorage.getItem('token');
    
    if (token) {
      response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: userInput })
      });

      if (response.ok) {
        const data = await response.json();
        addMessage("bot", data.response);
      } else {
        addMessage("bot", getBotReplyOffline(userInput));
      }
    } else {
      const reply = getBotReplyOffline(userInput);
      addMessage("bot", reply);
    }
  } catch (error) {
    addMessage("bot", getBotReplyOffline(userInput));
  }
}

function getBotReplyOffline(userInput) {
  const message = userInput.toLowerCase();
  
  if (message.includes("hello") || message.includes("hi")) {
    return "Hello! I'm here to help with your college enquiries. You can ask me about admissions, courses, fees, or campus life.";
  } else if (message.includes("admission")) {
    return "For admissions, you typically need to submit your transcripts, application form, and may need to take an entrance exam. Would you like specific information about any program?";
  } else if (message.includes("course") || message.includes("program")) {
    return "We offer various programs including Engineering, Business, Arts, and Sciences. What field are you interested in?";
  } else if (message.includes("fee") || message.includes("cost")) {
    return "Tuition fees vary by program. Engineering programs are typically $15,000/year, Business programs $12,000/year. Financial aid is available!";
  } else if (message.includes("campus")) {
    return "Our campus offers modern facilities, libraries, labs, sports complexes, and student housing. Would you like to schedule a campus tour?";
  } else {
    return "I'm here to help with your college enquiries! Ask me about admissions, courses, fees, or campus life.";
  }
}

function addMessage(sender, text) {
  const chatContainer = document.getElementById("chat-container");

  const messageWrapper = document.createElement("div");
  messageWrapper.className = `chat-message ${sender}`;

  const avatar = document.createElement("div");
  avatar.className = `avatar ${sender === "user" ? "user-avatar" : "bot-avatar"}`;

  const bubble = document.createElement("div");
  bubble.className = `message-bubble ${sender === "bot" ? "bot-bubble" : ""}`;
  if (sender === "bot") {
    bubble.innerHTML = text;
  } else {
    bubble.textContent = text;
  }

  if (sender === "user") {
    messageWrapper.appendChild(bubble);
    messageWrapper.appendChild(avatar);
  } else {
    messageWrapper.appendChild(avatar);
    messageWrapper.appendChild(bubble);
  }

  chatContainer.appendChild(messageWrapper);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Initialize welcome message
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    const userData = JSON.parse(user);
    addMessage("bot", `Welcome, ${userData.username}! How can I help you today?`);
    
    // Update user status in UI if element exists
    const userStatus = document.getElementById("user-status");
    if (userStatus) {
      userStatus.textContent = `Logged in as: ${userData.username}`;
    }
  } else {
    addMessage("bot", "Welcome to College Enquiry! I'm here to help with your questions. You can continue as a guest or login for a personalized experience.");
  }
});

// Logout function
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

// Toggle dropdown menu
function toggleMenu() {
  const menu = document.getElementById("dropdownMenu");
  if (menu) {
    menu.classList.toggle("show");
  }
}

// Close dropdown when clicking outside
window.addEventListener("click", function(event) {
  const menu = document.getElementById("dropdownMenu");
  const icon = document.querySelector(".menu-icon");
  if (menu && icon && !icon.contains(event.target) && !menu.contains(event.target)) {
    menu.classList.remove("show");
  }
});

// Clear chat
function clearChat() {
  const container = document.getElementById("chat-container");
  container.innerHTML = "";
  addMessage("bot", "Chat cleared. You can start a new conversation.");
}

// Feedback modal functions
const modal = document.getElementById('feedbackModal');
const openBtn = document.getElementById('feedbackBtn');
const closeBtn = document.getElementById('closeModal');
const form = document.getElementById('feedbackForm');
const messageDiv = document.getElementById('feedbackMessage');

if (openBtn) {
  openBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
    if (messageDiv) messageDiv.textContent = '';
  });
}

if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    if (form) form.reset();
  });
}

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
    if (form) form.reset();
  }
});

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const feedbackText = document.getElementById('feedbackText').value.trim();
    const rating = document.getElementById('rating').value;
    
    if (!feedbackText || !rating) {
      if (messageDiv) messageDiv.textContent = "Please enter feedback and rating.";
      return;
    }
    
    try {
      const user = localStorage.getItem('user');
      const userId = user ? JSON.parse(user).id : null;
      
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feedbackText,
          rating: parseInt(rating),
          userId
        })
      });
      
      if (response.ok) {
        form.reset();
        modal.style.display = 'none';
        addMessage("bot", "Thank you for your feedback! We'll use it to improve.");
      } else {
        if (messageDiv) messageDiv.textContent = "Error submitting feedback.";
      }
    } catch (error) {
      if (messageDiv) messageDiv.textContent = "Network error. Please try again.";
    }
  });
}