let messages = [
    { "role": "system", "content": "You are a helpful assistant." }
  ];
  
  let descriptionShown = false;
  
  document.getElementById('send-btn').addEventListener('click', sendMessage);
  document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  });
  
  async function sendMessage() {
    const userInput = document.getElementById('user-input').value.trim();
    if (!userInput) return;
  
    messages.push({ "role": "user", "content": userInput });
    
    // Append user message
    appendMessage('user', userInput);
  
    // Show loading spinner
    const loadingMessage = appendMessage('loading', 'AI is typing...');
    const loadingSpinner = document.createElement('div');
    loadingSpinner.classList.add('loading-spinner');
    loadingMessage.appendChild(loadingSpinner);
  
    // Check if it's the first message and display description if not shown
    if (!descriptionShown) {
      appendMessage('ai', "UI and Chatbot Test by Zel", false, true);  // Description message
      descriptionShown = true;
    }
  
    try {
      const response = await fetch('https://gpt-api-bay.vercel.app/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messages })
      });
  
      const data = await response.json();
      messages = data.messages;
      const aiResponse = data.response;
  
      // Remove loading message
      document.getElementById('chatbox').removeChild(loadingMessage);
  
      // Check if AI response is code and append accordingly
      if (aiResponse.startsWith('```') && aiResponse.endsWith('```')) {
        // Extract the code part without backticks
        const code = aiResponse.replace(/^```[\s\S]*\n|\n```$/g, '').trim();
        appendCodeBlock(code);
      } else {
        appendMessage('ai', aiResponse);  // Regular response
      }
    } catch (error) {
      console.error('Error:', error);
      appendMessage('ai', 'There was an issue with the request.');
    }
  
    document.getElementById('user-input').value = '';
    document.getElementById('chatbox').scrollTop = document.getElementById('chatbox').scrollHeight;
  }
  
  function appendMessage(sender, message, isCode = false, isDescription = false) {
    const chatbox = document.getElementById('chatbox');
    const messageElement = document.createElement('div');
    
    messageElement.classList.add('message', sender);
  
    // If it's a code message, apply special class
    if (isCode) {
      messageElement.classList.add('code');
    }
    
    // If it's a description, apply specific styling
    if (isDescription) {
      messageElement.classList.add('description');
    }
  
    messageElement.innerHTML = `<p>${message}</p>`;
    chatbox.appendChild(messageElement);
  
    return messageElement;  // Return the element so we can remove it later
  }
  
  // Function to append code blocks with syntax highlighting and line numbers
  function appendCodeBlock(code) {
    const chatbox = document.getElementById('chatbox');
    const codeBlock = document.createElement('div');
    codeBlock.classList.add('code-block');
    
    // Create a <pre><code> structure that Prism can highlight
    const codeElement = document.createElement('pre');
    const codeContent = document.createElement('code');
    
    codeContent.classList.add('language-javascript'); // You can modify this class based on the language (e.g., 'language-python' for Python code)
    codeContent.textContent = code;
    
    codeElement.appendChild(codeContent);
    codeBlock.appendChild(codeElement);
    
    chatbox.appendChild(codeBlock);
    
    // Call Prism to highlight the code
    Prism.highlightAll();
  }
  