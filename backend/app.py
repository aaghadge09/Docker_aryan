from flask import Flask, jsonify, request

app = Flask(__name__)


@app.get("/health")
def health():
    return jsonify({"status": "backend is running"})


@app.post("/submit")
def submit():
    data = request.get_json(silent=True) or request.form

    item_name = (data.get("itemName") or "").strip()
    item_description = (data.get("itemDescription") or "").strip()

    if not item_name or not item_description:
        return jsonify({"error": "Both item name and description are required."}), 400

    return jsonify({
        "message": "Data submitted successfully",
        "item": {
            "itemName": item_name,
            "itemDescription": item_description
        }
    }), 201


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
