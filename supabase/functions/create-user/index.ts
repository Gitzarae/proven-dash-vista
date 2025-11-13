import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.0";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateUserRequest {
  email: string;
  full_name: string;
  role: string;
  phone?: string;
  department?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    
    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { email, full_name, role, phone, department }: CreateUserRequest = await req.json();

    // Generate random password
    const password = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12).toUpperCase() + "!@#";

    console.log("Creating user:", email);

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name,
      },
    });

    if (authError) {
      console.error("Auth error:", authError);
      throw authError;
    }

    if (!authData.user) {
      throw new Error("User creation failed");
    }

    console.log("User created in auth:", authData.user.id);

    // Create profile
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        user_id: authData.user.id,
        full_name,
        email,
        phone: phone || null,
        department: department || null,
      });

    if (profileError) {
      console.error("Profile error:", profileError);
      throw profileError;
    }

    console.log("Profile created");

    // Map role names to database enum values
    const roleMap: Record<string, string> = {
      "Top Management": "top_management",
      "Project Owner": "project_owner",
      "Project Manager": "project_manager",
      "Project Officer": "project_officer",
      "System Admin": "system_admin",
    };

    const dbRole = roleMap[role] || role;

    // Assign role
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({
        user_id: authData.user.id,
        role: dbRole,
      });

    if (roleError) {
      console.error("Role error:", roleError);
      throw roleError;
    }

    console.log("Role assigned:", dbRole);

    // Send email with credentials
    const emailResponse = await resend.emails.send({
      from: "GRA PROVEN Platform <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to GRA PROVEN Platform - Your Account Credentials",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #006B3F;">Welcome to GRA PROVEN Platform</h2>
          <p>Hello ${full_name},</p>
          <p>Your account has been created by the system administrator. Below are your login credentials:</p>
          
          <div style="background-color: #f7f7f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Password:</strong> <code style="background-color: #e0e0e0; padding: 4px 8px; border-radius: 4px;">${password}</code></p>
            <p style="margin: 5px 0;"><strong>Role:</strong> ${role}</p>
          </div>
          
          <p style="color: #ce1126; font-weight: bold;">⚠️ Important Security Notice:</p>
          <ul style="color: #333;">
            <li>Please change your password immediately after your first login</li>
            <li>Do not share your credentials with anyone</li>
            <li>Keep your password secure and confidential</li>
          </ul>
          
          <p>You can access the platform at: <a href="${Deno.env.get("SITE_URL") || "https://your-site.lovable.app"}" style="color: #006B3F;">${Deno.env.get("SITE_URL") || "https://your-site.lovable.app"}</a></p>
          
          <p style="margin-top: 30px;">Best regards,<br>GRA PROVEN Platform Team</p>
          
          <hr style="margin-top: 30px; border: none; border-top: 1px solid #e0e0e0;">
          <p style="color: #888; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
        </div>
      `,
    });

    console.log("Email sent:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: {
          id: authData.user.id,
          email: authData.user.email,
          full_name,
          role: dbRole,
        }
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in create-user function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
