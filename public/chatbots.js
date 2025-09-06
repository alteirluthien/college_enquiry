// ✅ Define FAQs first
const faqResponses = {
  "What are the entry requirements?": "Entry requirements vary depending on the course. Please check the specific program page on our website or contact admissions for more details.",
  "How do I apply for an undergraduate program?": 'You can apply via our online application portal. <a href="https://www.vu.edu.au/enquire-now" target="_blank" rel="noopener noreferrer"><u>Click Here ➚</u></a> to enquire now',
  "I'm having trouble enrolling": "If you're experiencing issues with enrolment, please contact Student Services or contact us at enquiry@vu.edu.au or call +61 3 9919 6100.",
  "How do I submit an application for admission?": "Applications can be submitted through the online portal. Make sure to upload your academic transcripts and other required documents.",
  "How do I enrol in subjects?": "Log in to your student portal, go to 'Enrolment', and select your subjects. A step-by-step guide is available if needed.",
  "How much are the course fees?": "Course fees vary by course and student type. Please visit the fee schedule section on the college website.",
  "How do I pay my fees?": "Fees can be paid through your student portal using credit card, bank transfer, or other listed methods.",
  "How do I accept my offer?": "Log into the application portal, click 'Accept Offer', and follow the instructions to confirm your place.",
  "My student ID card is lost or stolen": "Report the loss to Student Services. You can request a replacement through the student portal or at the help desk."
};

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
    const aiReply = await getAIReply(userInput); // your API function

    // If AI fails or returns an error, switch to fallback
    if (!aiReply || aiReply.includes("No reply") || aiReply.toLowerCase().includes("error")) {
      addMessage("bot", "⚠️ AI is currently unavailable. Showing standard answer:");
      addMessage("bot", getBotReply(userInput.toLowerCase()));
    } else {
      addMessage("bot", aiReply);
    }
  } catch (err) {
    // API call failed entirely
    addMessage("bot", "⚠️ AI is currently unavailable. Showing standard answer:");
    addMessage("bot", getBotReply(userInput.toLowerCase()));
  }
}



function appendMessage(sender, text) {
  const chat = document.getElementById("chat-container");
  const message = document.createElement("div");
  message.classList.add("chat-message");

  // Use innerHTML only for Bot so links are clickable
  if (sender === "Bot") {
    message.innerHTML = `<strong>${sender}:</strong> ${text}`;
  } else {
    message.textContent = `${sender}: ${text}`;
  }

  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
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
    bubble.innerHTML = text; // allows clickable HTML like <a> tags
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
async function sendMessage() {
  const inputField = document.getElementById("userInput");
  const userInput = inputField.value.trim();
  if (!userInput) return;

  addMessage("user", userInput);
  inputField.value = "";

  try {
    const aiReply = await getAIReply(userInput); // your API function
    if (aiReply && aiReply.trim()) {
      addMessage("bot", aiReply); // normal AI response
    } else {
      // Empty AI response
      addMessage("bot", "⚠️ AI is currently unavailable. Showing standard answer:");
      addMessage("bot", getBotReply(userInput.toLowerCase()));
    }
  } catch (err) {
    // API failed
    addMessage("bot", "⚠️ AI is currently unavailable. Showing standard answer:");
    addMessage("bot", getBotReply(userInput.toLowerCase()));
  }
}


function getBotReply(message) {
  // Check if the message matches any FAQ question exactly (case-insensitive)
  for (const question in faqResponses) {
    if (message.trim() === question.toLowerCase()) {
      return faqResponses[question];
    }
  }
  if (message.includes("admission") || message.includes("apply")) {
    return 'You can apply online through our website. Applications usually close in November. <a href="https://www.vu.edu.au/enquire-now" target="_blank" rel="noopener noreferrer"><u>Click Here ➚</u></a> to enquire now';
  }
  else if (message.includes("hello") || message.includes("hi")) {
  return `Hello! What can I do for you?`;
  }
  else if (message.includes("course") || message.includes("program")) {
  return 'We offer IT, Business, Nursing, Engineering, and more. You can find details <a href="https://www.vu.edu.au/study-at-vu/courses/browse-study-areas/all-courses-a-to-z" target="_blank" rel="noopener noreferrer"><u>Here ➚</u></a>.';
  } else if (message.includes("fee") || message.includes("tuition")) {
    return 'Fees vary by course. International students typically pay from $18,000/year. <a href="https://www.vu.edu.au/study-at-vu/fees-scholarships/course-tuition-fees" target="_blank" rel="noopener noreferrer"><u>Click Here ➚</u></a> for more information';
  } else if (message.includes("contact") || message.includes("email") || message.includes("phone")) {
    return "You can contact us at enquiry@vu.edu.au or call +61 3 9919 6100. Monday to Friday from 8 am to 5 pm";
  } else if (message.includes("scholarship")) {
    return 'Yes, we offer both merit- and need-based scholarships. Visit our website for more details <a href="https://www.vu.edu.au/study-at-vu/fees-scholarships/scholarships" target="_blank" rel="noopener noreferrer"><u>Click Here ➚</u></a>';
  } else if (message.includes("login")) {
    return 'You can log in using your student ID on the student portal. <a href="https://login.vu.edu.au/cas/login?service=https%3A%2F%2Fidpweb1.vu.edu.au%2Fidp%2FAuthn%2FExternal%3Fconversation%3De1s2%26entityId%3Dhttps%3A%2F%2Fmyvu.edu.au%2Fmyvu" target="_blank" rel="noopener noreferrer"><u>Click Here ➚</u></a> for student login portal';
  } else {
    return 'I am sorry, I did not understand that. You can ask about admissions, courses, fees, contact details or any frequently asked questions.';
  }
}


 function showFAQs() {
      const chatContainer = document.getElementById("chat-container");

      const messageWrapper = document.createElement("div");
      messageWrapper.className = "chat-message bot";

      const avatar = document.createElement("div");
      avatar.className = "avatar bot-avatar";

      const bubble = document.createElement("div");
      bubble.className = "message-bubble bot-bubble";

      const faqDiv = document.createElement("div");
      faqDiv.innerHTML = " Here are some of the Frequently Asked Questions:";

      const faqContainer = document.createElement("div");
      faqContainer.className = "faq-buttons";

      Object.keys(faqResponses).forEach((question) => {
        const button = document.createElement("button");
        button.textContent = question;
        button.classList.add("faq-button");
        button.onclick = () => sendQuickMessage(question);
        faqContainer.appendChild(button);
      });

      bubble.appendChild(faqDiv);
      bubble.appendChild(faqContainer);
      messageWrapper.appendChild(avatar);
      messageWrapper.appendChild(bubble);
      chatContainer.appendChild(messageWrapper);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
// Toggle dropdown
function toggleMenu() {
  const menu = document.getElementById("dropdownMenu");
  menu.classList.toggle("show");
}

// Close dropdown when clicking outside
window.addEventListener("click", function(event) {
  const menu = document.getElementById("dropdownMenu");
  const icon = document.querySelector(".menu-icon");
  if (!icon.contains(event.target) && !menu.contains(event.target)) {
    menu.classList.remove("show");
  }
});

// Save Chat
function saveChat() {
  const messages = document.querySelectorAll(".chat-message");
  const chatArray = Array.from(messages).map(msg => ({
    sender: msg.classList.contains("user") ? "user" : "bot",
    text: msg.querySelector(".message-bubble").innerText
  }));

  fetch('save_chat.php', {
    method: 'POST',
    body: JSON.stringify({ chat: chatArray }),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json())
  .then(data => alert(data.message))
  .catch(err => console.error(err));
}

//open previous chat
function openPreviousChat() {
  fetch('open_previous_chat.php')
    .then(res => res.json())
    .then(chat => {
      const container = document.getElementById("chat-container");
      container.innerHTML = "";

      if (chat.length === 0) {
        addMessage("bot", "No previous chat found.");
        return;
      }

      chat.forEach(msg => addMessage(msg.sender, msg.chat_message));
    })
    .catch(err => console.error(err));
}


window.addEventListener('DOMContentLoaded', () => {
  const loginIndicator = document.getElementById('login-indicator');
  const userStatus = document.getElementById('user-status');
  const loginBtnContainer = document.getElementById('login-btn-container');

  if (loginIndicator.dataset.loggedin === "true") {
    // Logged in
    userStatus.textContent = `Logged in as: ${loginIndicator.dataset.username}`;
    userStatus.classList.add('logged-in');

    if (loginBtnContainer) loginBtnContainer.style.display = "none";

    // Enable chat dropdown buttons
    document.getElementById('save-chat-btn').disabled = false;
    document.getElementById('open-prev-chat-btn').disabled = false;
    document.getElementById('retrieve-chat-btn').disabled = false;
  } else {
    // Not logged in
    userStatus.textContent = 'Not logged in';
    userStatus.classList.remove('logged-in');

    // Disable dropdown buttons
    document.getElementById('save-chat-btn').disabled = true;
    document.getElementById('open-prev-chat-btn').disabled = true;
    document.getElementById('retrieve-chat-btn').disabled = true;
  }
});


// ✅ Insert welcome message into chat container ONCE after login
document.addEventListener("DOMContentLoaded", () => {
  const indicator = document.getElementById("login-indicator");
  const loggedIn = indicator.dataset.loggedin === "true";
  const username = indicator.dataset.username;

  if (loggedIn) {
    document.getElementById("user-status").textContent = "Logged in as " + username;

    // Show welcome message in chat only once
    const chatContainer = document.getElementById("chat-container");
    const messageWrapper = document.createElement("div");
    messageWrapper.className = "chat-message bot";

    const avatar = document.createElement("div");
    avatar.className = "avatar bot-avatar";

    const bubble = document.createElement("div");
    bubble.className = "message-bubble bot-bubble";
    bubble.textContent = `Welcome, ${username}! How can I help you today?`;

    messageWrapper.appendChild(avatar);
    messageWrapper.appendChild(bubble);
    chatContainer.appendChild(messageWrapper);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  } else {
    document.getElementById("user-status").textContent = "Not logged in.";
  }
});

// Clear chat from front-end only
function clearChat() {
  const container = document.getElementById("chat-container");
  container.innerHTML = ""; // remove all messages
  addMessage("bot", "Chat cleared. You can start a new conversation."); // optional welcome message
}

// Modal elements
const modal = document.getElementById('feedbackModal');
const openBtn = document.getElementById('feedbackBtn');
const closeBtn = document.getElementById('closeModal');
const form = document.getElementById('feedbackForm');
const messageDiv = document.getElementById('feedbackMessage');

// Open modal only when button is clicked
openBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
  messageDiv.textContent = '';
});

// Close modal when X is clicked
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  form.reset();
});

// Close modal when clicking outside content
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
    form.reset();
  }
});

// Optional: AJAX submit feedback (closes modal automatically on success)
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const feedbackText = document.getElementById('feedbackText').value.trim();
  const rating = document.getElementById('rating').value;

  if (!feedbackText || !rating) {
    messageDiv.textContent = "⚠️ Please enter feedback and rating.";
    return;
  }

  fetch('feedback.php', {
    method: 'POST',
    headers: {'Content-Type':'application/x-www-form-urlencoded'},
    body: `feedbackText=${encodeURIComponent(feedbackText)}&rating=${encodeURIComponent(rating)}`
  })
  .then(res => res.json())
  .then(data => {
    form.reset();
    modal.style.display = 'none'; 

    // ✅ Use the same chat bubble styling
    addMessage("bot", "Thank you for your feedback! We’ll use it to improve.");
})

  .catch(err => { messageDiv.textContent = "⚠️ Error submitting feedback."; });
});




