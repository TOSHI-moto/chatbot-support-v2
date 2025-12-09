// DOM要素の取得
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const loading = document.getElementById('loading');

// メッセージを追加する関数
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = isUser ? '👤' : '🤖';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const sender = document.createElement('strong');
    sender.textContent = isUser ? 'あなた' : 'カスタマーサポート';
    
    const message = document.createElement('p');
    message.textContent = text;
    
    content.appendChild(sender);
    content.appendChild(message);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// エラーメッセージを表示
function showError(message) {
    addMessage(`申し訳ございません。${message}\n\nお急ぎの場合は、お電話（029-303-8581）でお問い合わせください。`, false);
}

// メッセージを送信
async function sendMessage() {
    const message = userInput.value.trim();
    
    if (!message) return;
    
    // ユーザーメッセージを表示
    addMessage(message, true);
    userInput.value = '';
    
    // UI無効化
    sendButton.disabled = true;
    userInput.disabled = true;
    loading.style.display = 'block';
    
    try {
        // API呼び出し
        const response = await fetch('/.netlify/functions/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // 成功: ボットの返信を表示
            addMessage(data.reply, false);
        } else {
            // エラー
            showError(data.error || 'エラーが発生しました。');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showError('通信エラーが発生しました。');
    } finally {
        // UI有効化
        sendButton.disabled = false;
        userInput.disabled = false;
        loading.style.display = 'none';
        userInput.focus();
    }
}

// イベントリスナー
sendButton.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// 初期フォーカス
userInput.focus();
