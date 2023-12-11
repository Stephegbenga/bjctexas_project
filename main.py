from flask import Flask, request
app = Flask(__name__)


@app.get("/")
def get():
    return {"status":"received"}


@app.post("/webhook")
def webhook():
    req = request.json
    return {"status":"received"}


if __name__ == '__main__':
    app.run()

