import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Primary and fallback models supported by Google Generative AI
const SUPPORTED_FLASH_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
] as const;

function getGenAI(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables (.env.local)');
  }
  return new GoogleGenerativeAI(apiKey);
}

export function getLegalKnowledge(): string {
  try {
    const knowledgePath = path.join(process.cwd(), 'data', 'legal_knowledge.md');
    return fs.readFileSync(knowledgePath, 'utf-8');
  } catch {
    return '';
  }
}

export function getSystemPrompt(language: string): string {
  const legalKnowledge = getLegalKnowledge();
  
  const languageInstructions: Record<string, string> = {
    en: 'Respond in English.',
    hi: 'Respond in Hindi (Devanagari script). Use simple, everyday Hindi that common citizens can understand.',
    mr: 'Respond in Marathi (Devanagari script). Use simple, everyday Marathi that common citizens can understand.',
  };

  const langInstruction = languageInstructions[language] || languageInstructions.en;

  return `You are NyayaSathi (न्यायसाथी), a helpful legal assistance AI for Indian citizens. You help people understand their legal rights and guide them through processes like RTI filing, FIR registration, and consumer complaints.

CRITICAL RULES:
1. NEVER invent or fabricate laws, sections, deadlines, or legal procedures.
2. ALWAYS state clearly that you provide general information, NOT legal advice.
3. For serious legal matters, ALWAYS recommend consulting a qualified lawyer or contacting NALSA (15100).
4. Only cite laws and sections that are established in Indian law or mentioned in the knowledge base below.
5. Be compassionate and empathetic — many users are in distress.
6. Use simple language that common citizens can understand.
7. ${langInstruction}
8. When unsure, say "I'm not sure about this — please consult a lawyer or NALSA (15100)."

TOPICS YOU CAN HELP WITH:
- RTI (Right to Information) filing process
- FIR registration and police complaints
- Consumer protection and complaints
- Fundamental Rights awareness
- Directing users to the right authorities and helplines

SAFETY DISCLAIMER:
Always include a brief disclaimer for important legal matters: "This is general information, not legal advice. Please consult a qualified lawyer for your specific situation."

LEGAL KNOWLEDGE BASE:
${legalKnowledge}

Remember: You are helping Indian citizens understand their rights. Be their साथी (companion/friend) in navigating the legal system.`;
}

const DEFAULT_SAFETY_SETTINGS = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

/**
 * Executes a Gemini generation with fallback cascade across supported Flash models.
 */
async function executeWithModelFallback<T>(
  fn: (modelName: string) => Promise<T>
): Promise<T> {
  let lastError: Error | null = null;

  for (const modelName of SUPPORTED_FLASH_MODELS) {
    try {
      return await fn(modelName);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.warn(`[Gemini] Execution with model ${modelName} failed: ${error.message}. Attempting fallback...`);
      lastError = error;
    }
  }

  throw lastError || new Error('All Gemini model fallbacks failed.');
}

export async function generateChatResponse(
  messages: { role: 'user' | 'model'; parts: string }[],
  language: string
): Promise<string> {
  const genAI = getGenAI();
  const systemInstruction = getSystemPrompt(language);

  return executeWithModelFallback(async (modelName) => {
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction,
      generationConfig: {
        temperature: 0.4,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
      safetySettings: DEFAULT_SAFETY_SETTINGS,
    });

    const chat = model.startChat({
      history: messages.slice(0, -1).map(m => ({
        role: m.role,
        parts: [{ text: m.parts }],
      })),
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.parts);
    return result.response.text();
  });
}

export async function generateRTIApplication(data: {
  applicantName: string;
  applicantAddress: string;
  applicantPhone: string;
  applicantEmail?: string;
  department: string;
  informationSought: string;
  language: string;
}): Promise<string> {
  const genAI = getGenAI();

  const prompt = `Generate a formal RTI (Right to Information) application in ${data.language === 'mr' ? 'Marathi' : data.language === 'hi' ? 'Hindi' : 'English'} for the following details:

Applicant Name: ${data.applicantName}
Applicant Address: ${data.applicantAddress}
Phone: ${data.applicantPhone}
Email: ${data.applicantEmail || 'N/A'}
Department/Public Authority: ${data.department}
Information Sought: ${data.informationSought}
Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}

Generate a properly formatted RTI application letter that:
1. Is addressed to the Public Information Officer (PIO) of the specified department
2. Clearly states this is under the Right to Information Act, 2005
3. Lists specific questions/information requested (numbered)
4. Mentions the fee enclosed (₹10)
5. Requests response within the statutory period of 30 days
6. Includes the applicant's details at the bottom
7. Is formal and professional in tone
8. Uses correct format for an Indian government application

Format it as a proper letter. Do NOT include any explanations outside the letter itself.`;

  return executeWithModelFallback(async (modelName) => {
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
      },
      safetySettings: DEFAULT_SAFETY_SETTINGS,
    });

    const result = await model.generateContent(prompt);
    return result.response.text();
  });
}

export async function generatePoliceComplaint(data: {
  complainantName: string;
  complainantAddress: string;
  complainantPhone: string;
  incidentDate: string;
  incidentLocation: string;
  accusedDetails: string;
  incidentDescription: string;
  witnesses?: string;
  language: string;
}): Promise<string> {
  const genAI = getGenAI();

  const prompt = `Generate a formal police complaint letter in ${data.language === 'mr' ? 'Marathi' : data.language === 'hi' ? 'Hindi' : 'English'} for the following:

Complainant: ${data.complainantName}
Address: ${data.complainantAddress}
Phone: ${data.complainantPhone}
Incident Date: ${data.incidentDate}
Incident Location: ${data.incidentLocation}
Accused Details: ${data.accusedDetails}
Incident Description: ${data.incidentDescription}
Witnesses: ${data.witnesses || 'None known'}
Date of Complaint: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}

Generate a properly formatted police complaint/FIR application that:
1. Is addressed to the Station House Officer (SHO) of the local police station
2. Clearly states the nature of the complaint
3. Provides a chronological narration of events
4. Mentions accused details and witnesses
5. Requests registration of FIR under appropriate sections (only mention sections if clearly applicable — do not invent sections)
6. Requests appropriate legal action
7. Includes complainant's details and signature block

Format as a proper formal letter. Do NOT include explanations outside the letter.`;

  return executeWithModelFallback(async (modelName) => {
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
      },
      safetySettings: DEFAULT_SAFETY_SETTINGS,
    });

    const result = await model.generateContent(prompt);
    return result.response.text();
  });
}
