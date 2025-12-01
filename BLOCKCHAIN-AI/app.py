from flask import Flask, render_template, request, jsonify
import re
import pandas as pd

# transformers is optional for local/dev. If it's not installed we'll fall back to CSV-only check.
try:
    from transformers import pipeline
except Exception:
    pipeline = None

app = Flask(__name__)

# ✅ Read bad words from CSV file
# Make sure your CSV has ONE column with the words
bad_words_df = pd.read_csv("profanity_en.csv")
BAD_WORDS = [str(w).strip().lower() for w in bad_words_df.iloc[:, 0].dropna()]

# ✅ Load Hugging Face model (pretrained for toxicity) if available
classifier = None
if pipeline is not None:
    try:
        classifier = pipeline("text-classification", model="unitary/unbiased-toxic-roberta")
    except Exception:
        classifier = None

def contains_profanity(text):
    """Check for profanity using keyword match and (optionally) ML classifier.

    Returns True if profanity likely present.
    """
    # Keyword-based check
    for word in BAD_WORDS:
        if re.search(rf"\b{re.escape(word)}\b", text, re.IGNORECASE):
            return True

    # ML-based check (optional)
    if classifier is not None:
        try:
            result = classifier(text)[0]
            label = str(result.get("label", "")).lower()
            score = float(result.get("score", 0))
            if label == "toxic" and score > 0.5:
                return True
        except Exception:
            # if classifier errors, ignore and rely on keyword list
            pass

    return False


@app.route("/api/check", methods=["POST"])
def api_check():
    """JSON API for profanity check. Accepts {"text": "..."} and returns structured result.

    Example response:
      {"is_toxic": false, "label": "", "score": 0.0}
    """
    data = None
    if request.is_json:
        data = request.get_json()
    else:
        # try form fallback
        data = {"text": request.form.get("feedback", "")} if request.form else {"text": ""}

    text = (data or {}).get("text", "")
    if not isinstance(text, str):
        text = str(text)

    # First run keyword check
    keyword_flag = False
    for word in BAD_WORDS:
        if re.search(rf"\b{re.escape(word)}\b", text, re.IGNORECASE):
            keyword_flag = True
            break

    label = ""
    score = 0.0
    ml_flag = False
    if classifier is not None:
        try:
            result = classifier(text)[0]
            label = result.get("label", "")
            score = float(result.get("score", 0))
            if str(label).lower() == "toxic" and score > 0.5:
                ml_flag = True
        except Exception:
            ml_flag = False

    is_toxic = keyword_flag or ml_flag
    return jsonify({"is_toxic": is_toxic, "label": label, "score": score})


@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        feedback = request.form["feedback"]

        if contains_profanity(feedback):
            message = "⚠️ Your feedback contains inappropriate language. It was not sent."
            return render_template("index.html", message=message, feedback=feedback)

        message = "✅ Feedback submitted successfully!"
        return render_template("index.html", message=message)

    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
