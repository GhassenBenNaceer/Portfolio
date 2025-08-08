from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
import re

app = Flask(__name__, template_folder='templates', static_folder='static')
"""
# Security configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

# Database configuration for production
database_url = os.environ.get('DATABASE_URL')
print(f"Original DATABASE_URL: {database_url}")

if database_url:
    # Fix for Render's PostgreSQL URL format
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    print(f"Final DATABASE_URL: {database_url}")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///contact_messages.db'
    print("Using SQLite database")

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class ContactMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)

@app.before_request
def create_tables():
    db.create_all()
"""
@app.route('/')
def home():
    return render_template('index.html')
"""
#undeer dev
@app.route('/contact', methods=['POST'])
def contact():
    data = request.get_json()
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    subject = data.get('subject', '').strip()
    message = data.get('message', '').strip()

    # Basic validation
    if not name or not email or not subject or not message:
        return jsonify({'success': False, 'error': 'All fields are required.'}), 400
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({'success': False, 'error': 'Invalid email address.'}), 400

    # Save to database
    try:
        contact_msg = ContactMessage(name=name, email=email, subject=subject, message=message)
        db.session.add(contact_msg)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Your message has been saved!'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': 'Failed to save message.'}), 500
"""
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
