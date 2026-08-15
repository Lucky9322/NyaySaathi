import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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
3. For serious legal matters, ALWAYS recommend consulting a qualified lawyer.
4. Only cite laws and sections that are mentioned in the knowledge base below.
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

export async function generateChatResponse(
  messages: { role: 'user' | 'model'; parts: string }[],
  language: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash',
    systemInstruction: getSystemPrompt(language),
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
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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

  const result = await model.generateContent(prompt);
  return result.response.text();
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
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

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

  const result = await model.generateContent(prompt);
  return result.response.text();
}
