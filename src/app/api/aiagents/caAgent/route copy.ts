import { NextResponse } from "next/server";
import { openai } from "../../../lib/openai"
import pdf from "pdf-parse";
import fs from "fs/promises";

// Define the type for bill details
interface BillDetails {
  accountAddress?: string;
  payeeName: string;
  payeeAddress: string;
  originalAmount: number;
  dueDate: string;
  lateFeeClause: {
    exists: boolean;
    feeAmount?: number;
    feePercentage?: number;
    gracePeriod?: number;
  };
  finalAmount: number;
  isPaymentOverdue: boolean;
  paymentStatus: string;
}

export async function POST(req: Request) {
  try {
    const { pdfPath } = await req.json();
    const dataBuffer = await fs.readFile(pdfPath);
    const pdfData = await pdf(dataBuffer);
    const extractedText = pdfData.text.substring(0, 2000);

    // const response = await openai.chat.completions.create({
    //   model: "gpt-4-turbo",
    //   messages: [{ role: "user", content: `Analyze this tax document and suggest improvements: ${extractedText}` }],
    //   max_tokens: 300,
    // });

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

    return NextResponse.json({ analysis: response.choices[0].message.content });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
