const DEFAULT_MODEL = 'qwen/qwen3.8-27b';
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

const getConfig = () => ({
  apiKey: process.env.GROQ_API_KEY?.trim(),
  model: process.env.GROQ_MODEL?.trim() || DEFAULT_MODEL,
});

export const getAiStatus = () => {
  const { apiKey, model } = getConfig();
  return {
    configured: Boolean(apiKey),
    model,
  };
};

const extractText = (data) => data?.choices?.[0]?.message?.content?.trim();

const callGroq = async (prompt, generationConfig = {}) => {
  const { apiKey, model } = getConfig();
  if (!apiKey) return null;

  const body = {
    model,
    messages: [{ role: 'user', content: prompt }],
    temperature: generationConfig.temperature ?? 0.2,
    max_tokens: generationConfig.maxOutputTokens ?? 700,
  };

  if (generationConfig.responseMimeType === 'application/json') {
    body.response_format = { type: 'json_object' };
  }

  const response = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Groq API trả về HTTP ${response.status}: ${errorBody.slice(0, 300)}`);
  }

  return extractText(await response.json());
};

export const askAi = async ({ question, documents = [], personalData = '' }) => {
  const context = documents.length
    ? documents.map((document) => `[${document.title}]\n${document.content}`).join('\n\n')
    : 'Không có tài liệu nội bộ phù hợp.';
  const prompt = `Bạn là trợ lý nhân sự nội bộ. Trả lời bằng tiếng Việt, ngắn gọn và chính xác.
Chỉ sử dụng dữ liệu trong CONTEXT. Không bịa chính sách, không đưa ra chẩn đoán pháp lý,
không tạo hoặc thực thi SQL, không yêu cầu người dùng cung cấp mật khẩu/API key.
Nếu CONTEXT không đủ, nói rõ chưa có dữ liệu và đề nghị liên hệ phòng Nhân sự.

CONTEXT:
${context}

${personalData ? `DỮ LIỆU CÁ NHÂN ĐÃ ĐƯỢC BACKEND KIỂM SOÁT:\n${personalData}\n` : ''}
CÂU HỎI: ${question}`;
  return callGroq(prompt);
};

export const predictPerformance = async (history) => {
  const prompt = `Bạn là chuyên gia phân tích KPI. Dựa duy nhất vào lịch sử KPI dưới đây,
ước tính điểm hiệu suất kỳ tiếp theo. Đây là dự đoán tham khảo, không phải quyết định nhân sự.
Không được dùng dữ liệu ngoài đầu vào. Trả về DUY NHẤT JSON hợp lệ, không markdown:
{"predictedScore": number, "confidence": number, "trend": "improving"|"stable"|"declining", "explanation": string, "factors": string[]}
Ràng buộc: predictedScore từ 0 đến 200; confidence từ 0 đến 1; factors tối đa 3 phần tử.

LỊCH SỬ KPI:
${JSON.stringify(history)}`;
  const text = await callGroq(prompt, {
    temperature: 0.1,
    maxOutputTokens: 500,
    responseMimeType: 'application/json',
  });
  if (!text) return null;
  const jsonText = text.replace(/^```(?:json)?\s*|\s*```$/gi, '').trim();
  const parsed = JSON.parse(jsonText);
  return {
    predictedScore: Math.max(0, Math.min(200, Number(parsed.predictedScore))),
    confidence: Math.max(0, Math.min(1, Number(parsed.confidence))),
    trend: ['improving', 'stable', 'declining'].includes(parsed.trend) ? parsed.trend : 'stable',
    explanation: String(parsed.explanation || 'Chưa có giải thích.').slice(0, 500),
    factors: Array.isArray(parsed.factors) ? parsed.factors.map(String).slice(0, 3) : [],
  };
};
