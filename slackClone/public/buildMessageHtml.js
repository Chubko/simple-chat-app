const buildMessageHtml = (msg) => `
  <li>
    <div class="user-image">
      <img src="${msg.avatar}"/>
    </div>
    <div class="user-message">
      <div class="user-name-time">${msg.userName}
        <span>${new Date(msg.date).toLocaleString()}</span>
      </div>
      <div class="message-text">${msg.newMessage}</div>
    </div>
  </li>
`;
