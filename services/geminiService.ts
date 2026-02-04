
import { GoogleGenAI, Type } from "@google/genai";

export const getSmartProductSuggestion = async (description: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `根据以下描述生成一个专业的信贷产品配置方案（JSON格式）："${description}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: '产品名称' },
          apr: { type: Type.NUMBER, description: '年化利率 (百分比)' },
          minAmount: { type: Type.NUMBER, description: '最小贷款金额' },
          maxAmount: { type: Type.NUMBER, description: '最大贷款金额' },
          minTerm: { type: Type.INTEGER, description: '最小期限 (月)' },
          maxTerm: { type: Type.INTEGER, description: '最大期限 (月)' },
          repaymentMethods: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING }, 
            description: '还款方式，例如：等额本息、先息后本' 
          },
          targetAudience: { type: Type.STRING, description: '目标客群' }
        },
        required: ["name", "apr", "minAmount", "maxAmount", "minTerm", "maxTerm"]
      }
    }
  });

  return JSON.parse(response.text);
};
