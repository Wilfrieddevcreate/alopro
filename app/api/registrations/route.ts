import { NextRequest, NextResponse } from "next/server";
import { getTrainingById } from "@/src/lib/trainings";
import { createRegistration } from "@/src/lib/registrations";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { trainingId, data } = body;

    if (!trainingId || !data) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    const training = await getTrainingById(trainingId);
    if (!training || training.status !== "published") {
      return NextResponse.json({ error: "Formation introuvable" }, { status: 404 });
    }

    // Validate required fields
    if (training.formFields) {
      for (const field of training.formFields) {
        if (field.required && !data[field.name]) {
          return NextResponse.json(
            { error: `Le champ "${field.labelFr}" est requis` },
            { status: 400 }
          );
        }
      }
    }

    const registration = await createRegistration(trainingId, data);

    // Send email notification
    try {
      const port = Number(process.env.SMTP_PORT) || 465;
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const fieldsHtml = Object.entries(data)
        .map(([key, value]) => {
          const field = training.formFields?.find((f) => f.name === key);
          const label = field?.labelFr || key;
          return `<tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 140px;">${label}</td>
            <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600;">${value}</td>
          </tr>`;
        })
        .join("");

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #059669; padding: 24px 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">Nouvelle inscription — ALOPRO</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Formation : ${training.titleFr}</p>
          </div>
          <div style="background: #f8fafc; padding: 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              ${fieldsHtml}
            </table>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
            <p style="color: #64748b; font-size: 12px; margin: 0;">
              Inscription reçue le ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: `"ALOPRO Formations" <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_EMAIL,
        subject: `[Inscription ALOPRO] ${training.titleFr} — ${data.email || data.nom || "Nouveau"}`,
        html: htmlContent,
      });
    } catch (emailError) {
      console.error("Erreur envoi email inscription:", emailError);
    }

    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    console.error("Erreur inscription:", error);
    return NextResponse.json({ error: "Erreur lors de l'inscription" }, { status: 500 });
  }
}
