// ============================================
// Shopify AI Pro - 增强版交互
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // 快捷按钮功能
    document.querySelectorAll('.quick-button').forEach(button => {
        button.addEventListener('click', function() {
            const question = this.getAttribute('data-question');
            document.getElementById('messageInput').value = question;
            sendMessage();
        });
    });
    
    // 升级按钮动画
    const upgradeButton = document.getElementById('upgradeButton');
    if (upgradeButton) {
        upgradeButton.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 处理中...';
            this.disabled = true;
            
            setTimeout(() => {
                // 这里可以添加实际升级逻辑
                alert('🎉 升级成功！您已升级到Shopify AI Pro企业版！\n\n专属客户经理将在24小时内联系您。');
                this.innerHTML = '<i class="fas fa-crown"></i> 已升级';
                this.style.background = 'linear-gradient(135deg, #00c9a7 0%, #00a188 100%)';
            }, 1500);
        });
    }
    
    // 模拟统计数据更新
    function updateStats() {
        const stats = document.getElementById('statsGrid');
        if (!stats) return;
        
        // 模拟实时更新
        setTimeout(() => {
            const items = stats.querySelectorAll('.stat-value');
            if (items[2]) {
                items[2].textContent = '99.1%';
                items[2].style.color = '#00c9a7';
                setTimeout(() => {
                    items[2].style.color = '';
                }, 1000);
            }
        }, 5000);
    }
    
    // 自动滚动到底部
    function scrollToBottom() {
        const chatBox = document.getElementById('chatBox');
        if (chatBox) {
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }
    
    // 发送消息函数（增强版）
    window.sendMessage = async function() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        if (!message) return;
        
        // 添加用户消息
        addUserMessage(message);
        messageInput.value = '';
        
        // 显示AI正在输入
        showTypingIndicator();
        
        try {
            // 发送到后端API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });
            
            // 移除打字指示器
            removeTypingIndicator();
            
            if (response.ok) {
                const data = await response.json();
                addAiMessage(data.response);
                
                // 更新统计数据
                updateStats();
            } else {
                addAiMessage('抱歉，暂时无法处理您的请求。请稍后重试或联系人工客服。');
            }
        } catch (error) {
            removeTypingIndicator();
            addAiMessage('网络错误，请检查连接后重试。');
            console.error('Error:', error);
        }
    };
    
    // 添加AI打字指示器
    function showTypingIndicator() {
        const chatBox = document.getElementById('chatBox');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <span style="margin-left: 10px;">AI正在思考...</span>
                </div>
            </div>
        `;
        chatBox.appendChild(typingDiv);
        scrollToBottom();
    }
    
    // 移除打字指示器
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // 添加用户消息
    function addUserMessage(message) {
        const chatBox = document.getElementById('chatBox');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                ${message}
            </div>
            <div class="message-time">${formatTime(new Date())}</div>
        `;
        chatBox.appendChild(messageDiv);
        scrollToBottom();
    }
    
    // 添加AI消息
    function addAiMessage(message) {
        const chatBox = document.getElementById('chatBox');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                ${message}
            </div>
            <div class="message-time">${formatTime(new Date())}</div>
        `;
        chatBox.appendChild(messageDiv);
        scrollToBottom();
    }
    
    // 格式化时间
    function formatTime(date) {
        return date.toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
        });
    }
    
    // 输入框回车发送
    document.getElementById('messageInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // 发送按钮点击
    document.getElementById('sendButton').addEventListener('click', sendMessage);
    
    // 初始滚动到底部
    scrollToBottom();
});
