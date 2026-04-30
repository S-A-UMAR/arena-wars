import requests
import os

RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "re_4M7cqYSP_DerGjCXdvMBHwZgSLN4KwJMC")

def send_verification_email(email, code):
    url = "https://api.resend.com/emails"
    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "from": "Arena Wars <auth@arenawars.pro>", # You need to verify this domain in Resend
        "to": [email],
        "subject": "Your Neural Access Code",
        "html": f"""
            <div style="background: #0a0a0a; color: #ffffff; padding: 40px; font-family: sans-serif; border: 1px solid #ffdb00;">
                <h1 style="color: #ffdb00; font-style: italic; text-transform: uppercase;">Arena Wars</h1>
                <p style="font-size: 16px; opacity: 0.8;">Secure Uplink Initiated. Use the following code to synchronize your profile:</p>
                <div style="background: #1a1a1a; padding: 20px; font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #ffdb00; text-align: center; border-radius: 10px;">
                    {code}
                </div>
                <p style="margin-top: 40px; font-size: 12px; opacity: 0.4;">If you did not initiate this request, please ignore this communique.</p>
            </div>
        """
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        return response.status_code == 200 or response.status_code == 201
    except Exception as e:
        print(f"Error sending email: {e}")
        return False
