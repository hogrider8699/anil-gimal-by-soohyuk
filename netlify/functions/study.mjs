import OpenAI from "openai";

const subjects = ["역사", "국어", "수학", "과학", "사회", "영어", "한문"];

export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "POST 요청만 사용할 수 있어요." }), {
      status: 405, headers: { "Content-Type": "application/json; charset=utf-8", "Allow": "POST" }
    });
  }
  try {
    const { subject, unit = "", question, mode = "ask" } = await req.json();
    const json = (body, status = 200) => new Response(JSON.stringify(body), {
      status, headers: { "Content-Type": "application/json; charset=utf-8" }
    });
    if (!subjects.includes(subject)) return json({ error: "과목을 다시 선택해 주세요." }, 400);
    if (typeof question !== "string" || !question.trim()) return json({ error: "질문을 입력해 주세요." }, 400);
    if (question.length > 1800 || String(unit).length > 120) return json({ error: "입력 내용이 너무 길어요. 짧게 줄여 주세요." }, 400);
    if (!Netlify.env.get("OPENAI_API_KEY")) return json({ error: "Netlify에 OPENAI_API_KEY 환경변수가 아직 설정되지 않았어요." }, 503);

    const client = new OpenAI({ apiKey: Netlify.env.get("OPENAI_API_KEY") });
    const instructions = `
너는 대한민국 중학교 2학년 학생을 돕는 친절한 공부 도우미다.
반드시 다음 규칙을 지켜라.
- 한국어로, 중학교 2학년이 이해할 수 있는 쉬운 말로 답한다.
- 중2 교육과정 수준을 넘는 심화 설명은 하지 않는다. 꼭 필요한 선수 개념은 짧고 쉽게 설명한다.
- 선택 과목은 ${subject}다. 질문이 이 과목과 무관하면 공부 내용을 답하지 말고 정확히 "이 과목과 관련이 없는 것 같아요. ${subject} 과목의 질문을 입력해 주세요."라고 안내한다.
- 중2 학습과 명백히 무관한 질문이나 유해한 요청은 학습 도우미 범위를 설명하고 정중히 거절한다.
- 시험 범위를 입력받았다면 그 범위 안에서 답한다. 학교별 실제 시험 범위를 안다고 주장하지 않는다.
- 범위가 비어 있거나 실제 학교 시험 범위를 확인할 수 없다면 "실제 시험 범위는 교과서와 선생님 안내를 확인해 주세요"라고 덧붙인다.
- 교과서/학교별 범위가 제공되지 않은 사실은 지어내지 않는다. 모르면 모른다고 말한다.
- 답변은 핵심 개념, 쉬운 설명, 시험 포인트 순서로 구성하고 필요한 경우 예시를 든다.
- 학생이 이해하도록 돕고 답을 그대로 베끼도록 유도하지 않는다.
`;
    const response = await client.responses.create({
      model: Netlify.env.get("OPENAI_MODEL") || "gpt-6",
      instructions,
      input: `과목: ${subject}\n시험 범위/단원: ${unit || "입력되지 않음"}\n요청 유형: ${mode}\n학생 질문: ${question}`
    });
    return json({ answer: response.output_text || "답변을 만들지 못했어요. 질문을 조금 바꿔서 다시 시도해 주세요." });
  } catch (err) {
    console.error("study function error:", err?.message || err);
    return new Response(JSON.stringify({ error: "AI 연결 중 문제가 생겼어요. Netlify 환경변수와 모델 설정을 확인해 주세요." }), {
      status: 500, headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }
};
