const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

class GeminiService {
  static async generateTopic() {
    const prompt = "Suggest a short, engaging public speaking topic in one sentence without any additional explanations.";
    
    const result = await model.generateContent({ 
      contents: [{ role: "user", parts: [{ text: prompt }] }] 
    });

    let topic = result.response?.candidates?.[0]?.content?.parts?.map(part => part.text).join(" ") || "No topic generated.";
    topic = topic.replace(/\*\*Topic:\*\*\s*/i, "").trim();

    return topic;
  }

  static async getFeedback({ transcript, topic, confidenceScore }) {
    const prompt = `
You are a professional speech coach helping users improve their speaking skills. The following transcription may contain minor misinterpretations or misheard words due to automated speech recognition. Your task is to intelligently infer the intended words based on context and provide an improved analysis.

The user spoke on the topic: "${topic}"
User's self-rated confidence score: ${confidenceScore}/10

Analyze the following transcribed speech:  

"${transcript}"  

Provide a structured response in JSON format with the following fields:  

1. **"polishedVersion"**: A cleaner, more articulate version of the original speech, correcting any misheard words while maintaining the speaker's intent and style.  
2. **"mistakes"**: An array of objects, each containing:  
   - **"original"**: The original text with the mistake  
   - **"correction"**: The corrected version  
   - **"type"**: The type of mistake (e.g., "grammar", "filler_word", "clarity", "structure", "misheard_word")  
   - **"explanation"**: Brief explanation of why this is an issue and the likely intended meaning  
3. **"strengths"**: An array of 2-3 positive aspects of the speech  
4. **"improvements"**: An array of 2-3 specific suggestions for improvement  
5. **"overallFeedback"**: A brief, encouraging paragraph with general feedback
6. **"transcript"**: Original transcript after rectifying the misheard or misinterpreted words.
7. **"scores"**: An object containing:
   - **"grammar"**: Score out of 100 for grammatical accuracy
   - **"vocabulary"**: Score out of 100 for vocabulary usage
   - **"confidence"**: The user's self-rated confidence score (${confidenceScore} converted to 100-point scale)
   - **"relevance"**: Score out of 100 for relevance to the topic
   - **"overall"**: Overall score out of 100 (calculated as: grammar*0.25 + vocabulary*0.25 + (confidence*2.5) + relevance*0.25)
8. **"recentFeedback"**: A concise summary (1-2 sentences) of the most important improvement suggestion that can be directly stored in the database

### **Important Instructions:**  
- Correct **misheard or misinterpreted words** based on context.  
- Ensure the **polished version sounds natural** and retains the speaker's meaning.  
- If a word is unclear, infer the most logical correction instead of leaving it ambiguous.  
- Score the relevance based on how well the content matches the given topic: "${topic}"
- For "recentFeedback", extract the most impactful suggestion from your analysis that would help the user improve their speaking skills.
- FORMAT YOUR RESPONSE AS VALID JSON ONLY. Do not include any text before or after the JSON.
`;

    const result = await model.generateContent({ 
      contents: [{ role: "user", parts: [{ text: prompt }] }] 
    });

    let feedbackText = result.response?.candidates?.[0]?.content?.parts?.map(part => part.text).join(" ") || "{}";
    
    try {
      feedbackText = feedbackText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(feedbackText);
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      return { 
        rawFeedback: feedbackText,
        error: "Could not parse structured feedback"
      };
    }
  }
}

module.exports = GeminiService;
