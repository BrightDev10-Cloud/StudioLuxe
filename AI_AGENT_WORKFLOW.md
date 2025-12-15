# Build a "Code-Native" AI Lead Gen Agent with Next.js & Vercel AI SDK

In this guide, we'll walk through how to build a production-grade **AI Agent** that qualifies leads, drafts personalized responses, and automates your sales funnel—all within your Next.js codebase. No heavy external automation tools (N8N/Make) required.

## The Stack

*   **Framework**: Next.js 14 (App Router & Server Actions)
*   **Intelligence**: Vercel AI SDK (`ai`, `@ai-sdk/openai`)
*   **Validation**: Zod (Schema validation)
*   **Email Infrastructure**: Resend
*   **Styling**: Vanilla CSS Modules (Tech-Brutalist Aesthetic)

---

## Step 1: Install Dependencies

We need the AI SDK to talk to OpenAI, Zod to ensure our data is clean, and Resend to deliver the emails.

```bash
npm install ai @ai-sdk/openai resend zod react-hook-form @hookform/resolvers
```

## Step 2: Define the Logic (The "Brain")

We use a **Server Action** to handle the form submission. This keeps our API keys secure on the server. The core magic happens with the `generateObject` function from the Vercel AI SDK, which forces the AI to return structured JSON instead of unstructured text.

**`src/app/contact/actions.ts`**

```typescript
"use server";

import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Define the shape of our form data
const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  website: z.string().optional(),
  budget: z.string(),
  goals: z.string().min(10),
});

export async function submitContactForm(formData: z.infer<typeof schema>) {
  // 1. Validate the input
  const validated = schema.safeParse(formData);
  if (!validated.success) return { success: false, error: "Invalid data" };
  
  const { name, email, budget, goals } = validated.data;

  // 2. AI Agent Analysis & Drafting
  // We ask the AI to analyze the lead and generate a response
  const { object: analysis } = await generateObject({
    model: openai("gpt-4-turbo"),
    schema: z.object({
      leadScore: z.number(),
      intent: z.enum(["hiring", "inquiry", "spam"]),
      emailSubject: z.string(),
      emailBody: z.string(), // HTML format
      isHighTicket: z.boolean(),
    }),
    prompt: \`
      Analyze this lead for StudioLuxe.
      Name: \${name}, Goals: \${goals}, Budget: \${budget}.
      
      Rules:
      - If budget is 50k+, classify as high ticket.
      - If high ticket, invite them to: https://cal.com/studioluxe/intro
      - Tone: Professional, crisp, confident.
    \`
  });

  // 3. Automated Action (Send Email via Resend)
  await resend.emails.send({
    from: "StudioLuxe <onboarding@resend.dev>",
    to: email,
    subject: analysis.emailSubject,
    html: analysis.emailBody,
  });

  return { success: true };
}
```

## Step 3: The Brutalist UI

We build a form that captures the necessary context for the AI to make a decision.

**`src/components/Contact/ContactForm.tsx`**

```tsx
"use client";
import { useForm } from "react-hook-form";
import { submitContactForm } from "@/app/contact/actions";

export default function ContactForm() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    await submitContactForm(data);
    alert("Message received. Our AI is analyzing your request.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>What's your budget?</label>
      <select {...register("budget")}>
        <option value="<5k">&lt; $5k</option>
        <option value="50k+">$50k+</option>
      </select>
      
      <label>Tell us about your goals</label>
      <textarea {...register("goals")} />
      
      <button type="submit">Submit Request</button>
    </form>
  );
}
```

## How It Works in Practice

1.  **User submits** a request with a "$50k+" budget.
2.  **Server Action** triggers.
3.  **GPT-4** sees "$50k+" and the rule "If high ticket, invite to book call."
4.  **GPT-4** generates a warm email: *"Hi [Name], your project sounds ambitious. Given your budget, we'd love to discuss strategy. Book a time here..."*
5.  **Resend** delivers this email instantly.


This workflow turns your contact form from a "black hole" into an active sales agent that works 24/7.

---

## Appendix: Setting up your Notion CRM

To make this persistent, you need a database. Here is how to build a **CRM-style database in Notion** from scratch.

### 1. Create the Database
1.  In Notion, click **+ New page**.
2.  Name it **“CRM – Contacts”**.
3.  Select **Table** (or type `/table` and choose **Table – Inline**).

### 2. Set Up Columns (Properties)
Rename and configure the columns to match our code:
1.  **Name** (Title): Rename to **“Contact name”**.
2.  **Email** (Email): Add property → **Email**.
3.  **Company** (Text): Add property → **Text**.
4.  **Budget** (Select): Add property → **Select** (Options: `<5k`, `50k+`, etc).
5.  **Score** (Number): Add property → **Number**.
6.  **Status** (Select): Add options like `Lead`, `Qualified`, `Won`.

### 3. Get Your API Secret
1.  Go to [Notion My Integrations](https://www.notion.so/my-integrations).
2.  Click **“+ New integration”**.
3.  Name it `StudioLuxe CRM` and ensure you select the correct workspace.
4.  Click **Submit**.
5.  **Copy the "Internal Integration Secret"**.
    *   *Security Note*: Treat this like a password. Store it in your `.env.local` file as `NOTION_API_KEY`.

### 4. Connect Integration to Database (**Crucial Step**)
1.  Go back to your specific **“CRM – Contacts”** database page in Notion.
2.  Click the `...` menu (top right corner).
3.  Click `Connections` -> `Connect to`.
4.  Search for and select **"StudioLuxe CRM"**.

Now your code has permission to write to this specific table!


---

## Appendix B: Troubleshooting Email Delivery (The "Silent Block")

If your Notion database is updating but **emails are not arriving**, you are likely hitting **Resend's Test Mode Restriction**.

### The Bottleneck
On the free/test tier, Resend **ONLY** delivers emails sent **TO** your verified admin email (e.g., `you@gmail.com`). If you test with any other email (like `test@outlook.com`), Resend accepts the request but silently drops the email.

### The Fix: Verify Your Domain
To send emails to *anyone* (prospects), you must verify your domain (e.g., `studioluxe.xyz`).

#### Instructions for Namecheap (or similar DNS providers)

1.  **Add Domain in Resend**:
    *   Go to **Resend Dashboard** -> **Domains** -> **Add Domain**.
    *   Enter your domain (e.g., `studioluxe.xyz`).
    *   Choose region (usually **US East**).

2.  **Get DNS Records**:
    *   Resend will provide you with **3 CNAME records** (e.g., `resend._domainkey`, `s1._domainkey`, etc.) and **1 MX record** (sometimes).

3.  **Update Namecheap DNS**:
    *   Log in to **Namecheap** -> **Domain List** -> **Manage** -> **Advanced DNS**.
    *   **Action**: Add New Record for each entry provided by Resend.
    *   **Type**: `CNAME Record`
    *   **Host**: Copy the "Name" from Resend (e.g., `resend._domainkey`). **Important**: If Namecheap appends your domain automatically, remove the domain part from the Host string.
    *   **Value**: Copy the "Value" from Resend.
    *   **TTL**: Automatic.

4.  **Verify Status**:
    *   Go back to Resend and click **Verify DNS Records**.
    *   It may take 5-60 minutes to propagate.

5.  **Update Code**:
    *   Once verified, change your `from` address in `src/app/contact/actions.ts`:
    ```typescript
    // OLD
    from: 'StudioLuxe <onboarding@resend.dev>'
    
    // NEW (After verification)
    from: 'StudioLuxe <hello@studioluxe.xyz>'
    ```
