#flask backend
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import openai
import os

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route('/api/book', methods=['POST'])
def get_book_data():
    data = request.get_json()

    print("Received data:", data)  # Log received data

    if not data:
        return jsonify({'error': 'No data received'}), 400

    title = data.get('title')
    author = data.get('author')
    chapter = data.get('chapter')

    try:
        summary_response = openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant who will summarize a chapter of a specified book. If you do not know this book, say that and then give what you believe the summary would be like."},
                    {"role": "user", "content": f"Summarize chapter {chapter} of {title} by {author}."}
                ]
            )
            
            # Generate quiz using OpenAI API
        quiz_response = openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant who will provide a 5 question quiz about a certain chapter of a book."},
                    {"role": "user", "content": f"Give a multiple choice quiz over chapter {chapter} of {title} by {author}."}
                ]
            )   

        summary_text = summary_response.choices[0].message.content
        quiz_text = quiz_response.choices[0].message.content

        # Split quiz text into individual questions
        quiz_questions = quiz_text.split('\n')  # Assumes quiz text is newline separated

        # Return both summary and quiz as a JSON response
        return jsonify({'summary': summary_text, 'quiz': quiz_questions}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/book', methods=['OPTIONS'])
def options():
    return '', 200
    
if __name__ == '__main__':
    app.run(host='localhost', port=4020, debug=True)