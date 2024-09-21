// src/app/api/contact/route.ts

import { NextResponse } from "next/server";
import { mailOptions, transporter } from "@/config/nodemailer";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const CONTACT_MESSAGE_FIELDS: { [key in keyof FormData]: string } = {
  name: "Name",
  email: "Email",
  subject: "Subject",
  message: "Message",
};

const generateEmailContent = (data: FormData) => {
  const stringData = Object.entries(data).reduce((str, [key, val]) => {
    return `${str}${CONTACT_MESSAGE_FIELDS[key as keyof FormData]}: ${val}\n\n`;
  }, "");

  const htmlData = Object.entries(data).reduce((str, [key, val]) => {
    return `${str}<tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong style="display: inline-block; min-width: 150px;">${CONTACT_MESSAGE_FIELDS[key as keyof FormData]}</strong>
        ${val}
      </td>
    </tr>`;
  }, "");

  return {
    text: stringData, // Correctly formatted plain text version
    html: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; max-width: 600px; margin: 20px auto; border-collapse: collapse; }
            th, td { padding: 20px; text-align: left; }
          </style>
        </head>
        <body>
          <table>
            <thead>
              <tr><th colspan="2"><h2>New Contact Message</h2></th></tr>
            </thead>
            <tbody>
              ${htmlData}
            </tbody>
          </table>
        </body>
      </html>`,
  };
};


export async function POST(req: Request) {
  try {
    const data: FormData = await req.json();

    // Basic validation of the contact form data
    if (!data || !data.name || !data.email || !data.subject || !data.message) {
      return NextResponse.json({ message: "Bad request" }, { status: 400 });
    }

    // Generate the email content using the generateEmailContent function
    const emailContent = generateEmailContent(data);

    // Send email using the transporter
    await transporter.sendMail({
      ...mailOptions,
      subject: data.subject,
      text: emailContent.text, // Plain text version
      html: emailContent.html, // HTML version
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    // Type-cast err to Error to access the message
    return NextResponse.json({ message: (err as Error).message }, { status: 500 });
  }
}
