const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

const SYSTEM_PROMPT = `你是一个专业的朋友圈美食文案生成专家。

请根据用户输入的菜品信息，生成3条朋友圈文案，要求：

1. 风格要网感强、亲切有趣
2. 每条文案都要带表情符号（😋🐷🍖💕✨🔥👍❤️等）
3. 每条文案下方要附带3个小红书热门话题标签，格式：#标签1 #标签2 #标签3
4. 文案要突出菜品特色，字数控制在100字以内
5. 文案风格要有变化，可以是：种草安利型、夸张惊叹型、生活分享型等

请按以下JSON格式返回：
{
  "copies": [
    {
      "text": "文案内容（不含标签）",
      "tags": ["#标签1", "#标签2", "#标签3"]
    },
    ...
  ]
}`;

exports.generateCopies = async (dishName, features) => {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  
  if (!apiKey || apiKey === 'your_deepseek_api_key_here') {
    throw new Error('DeepSeek API Key 未配置');
  }

  const userPrompt = `请为这道菜生成朋友圈文案：${dishName}${features ? '，特点：' + features : ''}`;

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'DeepSeek API 请求失败');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('DeepSeek API 返回内容为空');
    }

    // 尝试解析 JSON
    let result;
    try {
      // 提取 JSON 部分（可能包含在markdown代码块中）
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || content.match(/(\{[\s\S]*\})/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[1]);
      } else {
        result = JSON.parse(content);
      }
      return result.copies;
    } catch (parseError) {
      console.error('JSON解析失败，原始内容:', content);
      throw new Error('AI返回格式解析失败');
    }
  } catch (error) {
    console.error('DeepSeek API 调用失败:', error);
    throw error;
  }
};