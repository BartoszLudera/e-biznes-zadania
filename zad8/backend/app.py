from flask import Flask, request, jsonify
from flask_cors import CORS
from gpt_service import ask_gpt

app = Flask(__name__)
CORS(app)

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json
    prompt = data.get("message", "")
    if not prompt:
        return jsonify({"error": "Empty message"}), 400
    response = ask_gpt(prompt)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)
