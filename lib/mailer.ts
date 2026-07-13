import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_APP_PASSWORD;

  if (!user || !pass) {
    console.warn("[mailer] SMTP_USER/SMTP_APP_PASSWORD manquants — email non envoyé.");
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }
  return transporter;
}

const EVENT_REMINDER = "Date : 08 Août 2026, 15h — Lieu : Calavi Parana";
const CONTACT = "+229 0155952589 / 0155357747";

async function sendMail(to: string, subject: string, html: string) {
  const t = getTransporter();
  if (!t) return;
  try {
    await t.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("[mailer] Échec de l'envoi d'email:", error);
  }
}

export async function sendValidationEmail(to: string, prenom: string) {
  await sendMail(
    to,
    "Ton inscription à hkm eFootball Kings est validée !",
    `<p>Salut ${prenom},</p>
     <p>Ton inscription au tournoi <strong>hkm eFootball Kings</strong> est <strong>validée</strong>. Bienvenue chez les rois.</p>
     <p>${EVENT_REMINDER}</p>
     <p>Pense à te présenter un peu avant l'heure. À très vite sur le terrain !</p>
     <p>Ici, on ne joue pas. On règne.</p>`
  );
}

export async function sendRejectionEmail(to: string, prenom: string, motif: string) {
  await sendMail(
    to,
    "Ton inscription à hkm eFootball Kings n'a pas été validée",
    `<p>Salut ${prenom},</p>
     <p>Ton inscription au tournoi <strong>hkm eFootball Kings</strong> n'a malheureusement pas pu être validée.</p>
     <p><strong>Motif :</strong> ${motif}</p>
     <p>Si tu penses qu'il s'agit d'une erreur ou souhaites régulariser ta situation, contacte-nous au ${CONTACT}.</p>`
  );
}
