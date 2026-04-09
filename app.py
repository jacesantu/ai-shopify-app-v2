from flask import Flask, render_template, request, jsonify
import requests
import os
import time
from datetime import datetime

app = Flask(__name__)

# 配置
DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY', '')

# 电商知识库
KNOWLEDGE_BASE = {
    "order": {
        "en": "You can track your order status in 'My Orders'. Usually delivered within 1-3 business days after shipping.",
        "zh": "您可以通过订单号在'我的订单'页面查看物流状态。发货后通常1-3个工作日送达。"
    },
    "shipping": {
        "en": "Standard shipping: 3-5 business days | Express: 1-2 business days",
        "zh": "标准配送：3-5个工作日 | 加急配送：1-2个工作日"
    },
    "returns": {
        "en": "30-day return policy. Items must be in original packaging.",
        "zh": "30天无条件退货政策，商品需保持原包装完好。"
    },
    "payment": {
        "en": "We accept Visa, MasterCard, Amex, PayPal, Apple Pay, Google Pay.",
        "zh": "支持信用卡(Visa/MasterCard/Amex)、PayPal、Apple Pay、Google Pay。"
    }
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        message = data.get('message', '').strip().lower()
        
        # 检查知识库
        for keyword, responses in KNOWLEDGE_BASE.items():
            if keyword in message:
                return jsonify({
                    'response': responses.get('zh', responses.get('en')),
                    'source': 'knowledge_base'
                })
        
        # 调用DeepSeek API
        if DEEPSEEK_API_KEY:
            headers = {
                'Authorization': f'Bearer {DEEPSEEK_API_KEY}',
                'Content-Type': 'application/json'
            }
            
            system_prompt = """You are a professional Shopify e-commerce customer service AI. 
            Provide helpful, concise answers about orders, shipping, returns, payments, and products.
            Answer in Chinese for Chinese customers."""
            
            data = {
                'model': 'deepseek-chat',
                'messages': [
                    {'role': 'system', 'content': system_prompt},
                    {'role': 'user', 'content': f"Customer asks: {message}"}
                ],
                'max_tokens': 200,
                'temperature': 0.7
            }
            
            response = requests.post(
                'https://api.deepseek.com/v1/chat/completions',
                headers=headers,
                json=data,
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                ai_response = result['choices'][0]['message']['content']
                return jsonify({
                    'response': ai_response,
                    'source': 'deepseek_ai'
                })
        
        # 默认回答
        default_response = "您好！我是Shopify AI客服。我可以帮您查询订单状态、退货政策、配送时间等信息。请告诉我您需要什么帮助？"
        return jsonify({
            'response': default_response,
            'source': 'default'
        })
        
    except Exception as e:
        print(f"Error in chat: {str(e)}")
        return jsonify({
            'response': '抱歉，处理您的请求时出现错误。请稍后重试或联系人工客服。',
            'error': str(e)
        }), 500

@app.route('/api/stats', methods=['GET'])
def stats():
    return jsonify({
        'status': 'online',
        'service': 'AI Shopify Customer Service',
        'version': '2.0.0',
        'timestamp': datetime.now().isoformat(),
        'features': ['chat', 'knowledge_base', 'deepseek_ai']
    })

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    print(f"Starting AI Shopify Service on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)
