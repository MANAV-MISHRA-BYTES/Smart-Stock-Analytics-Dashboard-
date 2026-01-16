
import { GoogleGenAI, Type } from "@google/genai";
import { StockData, QuarterlySales, NewsItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const fetchStockAnalytics = async (symbol: string): Promise<StockData> => {
  const modelName = 'gemini-3-flash-preview';
  
  const prompt = `
    Analyze the stock with ticker symbol "${symbol}". 
    Provide the following real-time and fundamental information:
    1. Current Market Capitalization and P/E Ratio.
    2. Parent company and any major holding company structure.
    3. Corporate bond information or recent credit rating summary.
    4. Quarterly revenue (sales figures) for the last 4 quarters in the current year.
    5. Latest 3-4 significant news headlines regarding this stock.
    6. A "smart analysis" summary of its current market position.
    7. Current price and daily change.

    Return the data as a structured report. Use Google Search to ensure real-time accuracy.
  `;

  // We use two calls: one for search-grounded text content (to get sources)
  // and one for structured JSON data based on that search.
  
  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources = groundingChunks.map((chunk: any) => ({
    title: chunk.web?.title || 'Source',
    uri: chunk.web?.uri || '#'
  })).filter((s: any) => s.uri !== '#');

  // Second pass: Use a structured schema for consistent UI rendering
  const structuredPrompt = `
    Based on the following data for ${symbol}: 
    "${response.text}"
    Extract the values into the following JSON format strictly. 
    Ensure sales revenue numbers are in billions (numeric only).
  `;

  const structuredResponse = await ai.models.generateContent({
    model: modelName,
    contents: structuredPrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          price: { type: Type.STRING },
          change: { type: Type.STRING },
          changePercent: { type: Type.STRING },
          marketCap: { type: Type.STRING },
          peRatio: { type: Type.STRING },
          parentCompany: { type: Type.STRING },
          holdingCompany: { type: Type.STRING },
          bondYields: { type: Type.STRING },
          salesData: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                quarter: { type: Type.STRING },
                revenue: { type: Type.NUMBER },
                growth: { type: Type.NUMBER }
              },
              required: ["quarter", "revenue"]
            }
          },
          news: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                source: { type: Type.STRING },
                url: { type: Type.STRING },
                date: { type: Type.STRING },
                summary: { type: Type.STRING }
              }
            }
          },
          smartAnalysis: { type: Type.STRING }
        },
        required: ["name", "price", "marketCap", "salesData"]
      }
    }
  });

  const rawData = JSON.parse(structuredResponse.text);

  return {
    symbol,
    name: rawData.name,
    price: rawData.price,
    change: rawData.change,
    changePercent: rawData.changePercent,
    marketCap: rawData.marketCap,
    peRatio: rawData.peRatio,
    parentCompany: rawData.parentCompany || 'None',
    holdingCompany: rawData.holdingCompany || 'N/A',
    bondYields: rawData.bondYields || 'N/A',
    metrics: [
      { label: 'Market Cap', value: rawData.marketCap },
      { label: 'P/E Ratio', value: rawData.peRatio },
      { label: 'Bond Rating/Yield', value: rawData.bondYields },
      { label: 'Parent Co', value: rawData.parentCompany || 'None' }
    ],
    salesData: rawData.salesData,
    news: rawData.news,
    smartAnalysis: rawData.smartAnalysis,
    groundingSources: sources
  };
};
