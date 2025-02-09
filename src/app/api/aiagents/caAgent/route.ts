import { NextResponse } from "next/server";
import { openai } from "../../../lib/openai"
import pdf from "pdf-parse";
import fs from "fs/promises";
import path from "path";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: Request) {
  console.log("GET request received");
  try {
    return NextResponse.json({ message: "Hello, world!" });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  console.log('POST request received to /api/aiagents/summarizer');
  try {
    const body = await req.json();
    console.log('Request body:', body);

    const { pdfPath } = body;
    if (!pdfPath) {
      console.error('No pdfPath provided in request');
      return NextResponse.json(
        { error: "No PDF path provided" },
        { status: 400 }
      );
    }

    // Ensure the path is within the public directory
    const publicDir = path.join(process.cwd(), 'public');
    const fullPath = path.join(publicDir, pdfPath);
    console.log('Full path:', fullPath);

    // Validate the path is within public directory for security
    if (!fullPath.startsWith(publicDir)) {
      console.error('Invalid file path (outside public directory):', fullPath);
      return NextResponse.json(
        { error: "Invalid file path" },
        { status: 400 }
      );
    }

    // Check if file exists
    try {
      await fs.access(fullPath);
      console.log('File exists at path:', fullPath);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.error('File not found:', fullPath);
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    console.log('Reading file...');
    const dataBuffer = await fs.readFile(fullPath);
    console.log('File read successfully, parsing PDF...');

    const pdfData = await pdf(dataBuffer);
    console.log('PDF parsed successfully, length:', pdfData.text.length);

    const extractedText = pdfData.text.substring(0, 2000); // Limit for AI
    console.log('Extracted text length:', extractedText.length);

    console.log('Calling OpenAI API...');
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `You are a bill processing agent. Analyze the provided document and extract the following information:
            - Account Address
            - Name and complete address of the payee
            - Original payment amount
            - Due date
            - Any late fee clauses and their details (amount or percentage)
            - Calculate if the payment is overdue based on current date
            - Calculate final amount including late fees if applicable
            
            Return the information in a valid JSON format matching this structure:
            {
              "accountAddress": string (optional),
              "payeeName": string,
              "payeeAddress": string,
              "originalAmount": number,
              "dueDate": string (YYYY-MM-DD),
              "lateFeeClause": {
                "exists": boolean,
                "feeAmount": number (optional),
                "feePercentage": number (optional),
                "gracePeriod": number (optional)
              },
              "finalAmount": number,
              "isPaymentOverdue": boolean,
              "paymentStatus": string
            }`
        },
        {
          role: "user",
          content: `Current date: ${new Date().toISOString().split('T')[0]}
          Document text: ${extractedText}`
        }
      ],
      response_format: { type: "json_object" },
    });

    console.log(response)
    console.log('OpenAI API response received');

    return NextResponse.json({ summary: response.choices[0].message.content });
  } catch (error: unknown) {
    console.error("Error processing PDF:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error details:", errorMessage);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
