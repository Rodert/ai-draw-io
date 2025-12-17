import type { ChatMessage } from './types';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

interface DeepSeekMessage {
  role?: string;
  content?: string;
}

interface DeepSeekChoice {
  message?: DeepSeekMessage;
}

interface DeepSeekChatCompletionResponse {
  choices?: DeepSeekChoice[];
}

export async function callDeepSeekChat(
  apiKey: string,
  messages: ChatMessage[],
): Promise<string> {
  if (!apiKey) {
    throw new Error('请先输入 DeepSeek API Key');
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      stream: false,
    }),
  });

  if (!response.ok) {
    let details = '';
    try {
      details = await response.text();
    } catch {
      // ignore
    }
    throw new Error(`DeepSeek API 调用失败: ${response.status} ${response.statusText} ${details}`);
  }

  const data = (await response.json()) as DeepSeekChatCompletionResponse;
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('DeepSeek 返回数据格式异常：未找到 message.content');
  }

  return content;
}
