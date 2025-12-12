"use server";

import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { Resend } from "resend";

import { Client } from "@notionhq/client";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Notion (Optional - fail gracefully if not set)
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DO_NOTION = !!process.env.NOTION_API_KEY && !!process.env.NOTION_DATABASE_ID;

// Define Schema (Must match client-side schema)
const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  website: z.string().optional(),
  budget: z.string(),
  goals: z.string().min(10),
});

export async function submitContactForm(formData: z.infer<typeof schema>) {
  // 1. Validation
  const validatedFields = schema.safeParse(formData);
  
  if (!validatedFields.success) {
    return { success: false, error: "Invalid fields" };
  }

  const { name, email, website, budget, goals } = validatedFields.data;

  try {
    // 2. AI Analysis & Drafting (The "Brain")
    // We use generateObject to get structured analysis + drafted content
    const { object: analysis } = await generateObject({
      model: openai("gpt-4o"),
      schema: z.object({
        leadScore: z.number().describe("0-100 score based on budget and clarity of goals"),
        intent: z.enum(["hiring", "inquiry", "spam", "partnership"]),
        sentiment: z.string().describe("Brief tone analysis"),
        emailSubject: z.string(),
        emailBody: z.string().describe("Personalized response body in HTML format. Keep it professional but tech-forward."),
        isHighTicket: z.boolean().describe("True if budget is 10k+ or 50k+"),
      }),
      prompt: `
        Analyze this inbound lead for 'StudioLuxe', a high-end design agency.
        
        Lead Details:
        - Name: ${name}
        - Email: ${email}
        - Website: ${website || "N/A"}
        - Budget: ${budget}
        - Goals: ${goals}

        Context:
        - If budget is '50k+' or '10k-50k', they are HIGH TICKET.
        - If High Ticket, the email should invite them to book a call using this link: https://cal.com/studioluxe/intro
        - If Low Ticket (<5k), politely mention we typically work with larger budgets but offer a 'Starter Audit' for $500, or point them to our 'Services' page.
        - Tone: Professional, Confident, 'Tech-Brutalist' (concise, no fluff).
      `,
    });

    // 3. Send Email to Lead (Resend)
    const adminEmail = process.env.ADMIN_EMAIL;
    console.log("--- DEBUG EMAIL START ---");
    console.log("Admin Email:", adminEmail);
    console.log("Lead Email:", email);
    
    if (!adminEmail) {
      console.error("CRITICAL: ADMIN_EMAIL is missing in .env.local!");
      return { success: false, error: "Server Configuration Error: ADMIN_EMAIL missing" };
    }

    const emailResult = await resend.emails.send({
      from: 'StudioLuxe <onboarding@resend.dev>',
      to: email,
      bcc: adminEmail, // VISIBILITY: Admin sees the exact email sent
      replyTo: adminEmail, // HUMAN-IN-THE-LOOP: User reply goes to Admin
      subject: analysis.emailSubject,
      html: analysis.emailBody,
    });
    console.log("Email Send Result:", emailResult);

    // 4. Send Notification to Admin
    await resend.emails.send({
      from: 'StudioLuxe System <system@resend.dev>',
      to: adminEmail, 
      subject: `[New Lead] ${name} - Score: ${analysis.leadScore}`,
      html: `
        <h1>New Lead Received</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Budget:</strong> ${budget}</p>
        <p><strong>Goals:</strong> ${goals}</p>
        <hr />
        <h3>AI Analysis</h3>
        <p><strong>Score:</strong> ${analysis.leadScore}</p>
        <p><strong>Intent:</strong> ${analysis.intent}</p>
        <p><strong>Action Taken:</strong> ${analysis.isHighTicket ? "High Ticket Invite Sent" : "Standard Reply Sent"}</p>
      `,
    });

    // 5. CRM Sync (Notion)
    if (DO_NOTION) {
      // Robustness: Strip potential query params included by mistake (common copy-paste error)
      const databaseId = process.env.NOTION_DATABASE_ID!.split("?")[0];
      
      await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
          "Name": { title: [{ text: { content: name } }] },
          "Email": { email: email },
          "Budget": { select: { name: budget } },
          "Score": { number: analysis.leadScore },
          // "Status": { select: { name: "Lead" } }, // If using Select
          "Status": { status: { name: "Lead" } }, // If using Notion's native Status type
          "Goals": { rich_text: [{ text: { content: goals.slice(0, 2000) } }] }, // Context
        },
      });
    }

    return { success: true };

  } catch (error) {
    console.error("AI/Email/CRM Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
