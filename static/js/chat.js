document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chatBox');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    
    // 添加用户消息到聊天框
    function addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
        chatBox.appendChild(messageDiv);
        scrollToBottom();
    }
    
    // 添加AI消息到聊天框
    function addAiMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai-message';
        messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
        chatBox.appendChild(messageDiv);
        scrollToBottom();
    }
    
    // 滚动到底部
    function scrollToBottom() {
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    
    // 发送消息到后端
    async function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;
        
        // 添加用户消息到界面
        addUserMessage(message);
        
        // 清空输入框
        messageInput.value = '';
        
        // 显示加载状态
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message ai-message';
        loadingDiv.innerHTML = '<div class="message-content">思考中...</div>';
        chatBox.appendChild(loadingDiv);
        scrollToBottom();
        
        try {
            // 发送到后端API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });
            
            // 移除加载状态
            chatBox.removeChild(loadingDiv);
            
            if (response.ok) {
                const data = await response.json();
                addAiMessage(data.response);
            } else {
                addAiMessage('抱歉，暂时无法处理您的请求。请稍后重试。');
            }
        } catch (error) {
            // 移除加载状态
            chatBox.removeChild(loadingDiv);
            addAiMessage('网络错误，请检查连接后重试。');
            console.error('Error:', error);
        }
    }
    
    // 发送按钮点击事件
    sendButton.addEventListener('click', sendMessage);
    
    // 输入框回车事件
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // 页面加载时滚动到底部
    scrollToBottom();
});
