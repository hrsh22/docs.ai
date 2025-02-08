import { NextResponse } from "next/server";
import { openai } from "../../../lib/openai"
import pdf from "pdf-parse";
import fs from "fs/promises";

export async function POST(req: Request) {
  try {
    const { pdfPath } = await req.json();
    const dataBuffer = await fs.readFile(pdfPath);
    const pdfData = await pdf(dataBuffer);
    const extractedText = pdfData.text.substring(0, 2000);

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: `Analyze this tax document and suggest improvements: ${extractedText}` }],
      max_tokens: 300,
    });

    return NextResponse.json({ analysis: response.choices[0].message.content });
  } catch (error: unknown) {
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
