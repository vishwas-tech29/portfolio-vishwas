from flask import Flask, request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Optional, useful if frontend is served separately

# Email credentials (use environment variables in production)
YOUR_EMAIL = "your_email@gmail.com"
YOUR_PASSWORD = "your_app_password"  # Use an app password, not your Gmail password

@app.route('/contact', methods=['POST'])
def contact():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')

    msg = MIMEMultipart()
    msg['From'] = YOUR_EMAIL
    msg['To'] = YOUR_EMAIL
    msg['Subject'] = f"New Contact Form Message from {name}"
    msg.attach(MIMEText(f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}", 'plain'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(YOUR_EMAIL, YOUR_PASSWORD)
        server.send_message(msg)
        server.quit()
        return jsonify({'success': True})
    except Exception as e:
        print("Error:", e)
        return jsonify({'success': False}), 500

if __name__ == '__main__':
    app.run(debug=True)
# To run the app, use the command: python app.py
# Make sure to replace YOUR_EMAIL and YOUR_PASSWORD with your actual email and app password.