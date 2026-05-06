import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "dummy_key");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, companyName, role, auditId, highSavings } = body;

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // 1. Store lead in Supabase
    if (supabase) {
      const { error } = await supabase.from("leads").insert([
        {
          email,
          company_name: companyName,
          role,
          audit_id: auditId !== "mock-id-123" ? auditId : null,
          high_savings: highSavings
        }
      ]);

      if (error) {
        console.error("Failed to store lead:", error);
        // Continue anyway to send email
      }
    }

    // 2. Send transaction email via Resend
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: "Burnrate by Credex <audits@credex.rocks>",
        to: email,
        subject: highSavings ? "Your AI Spend Audit & Next Steps" : "Your AI Spend Audit",
        html: `
          <h2>Thanks for using Burnrate!</h2>
          <p>We've safely recorded your audit results.</p>
          ${highSavings 
            ? "<p><strong>Because we identified significant savings, a Credex infrastructure specialist will reach out shortly to help you restructure your contracts.</strong></p>"
            : "<p>We will keep an eye on pricing changes and notify you if a cheaper optimal tier becomes available for your stack.</p>"}
          <br/>
          <p>Best,</p>
          <p>The Credex Team</p>
        `
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Lead API Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
