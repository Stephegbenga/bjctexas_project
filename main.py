from flask import Flask, request, render_template
from controllers.models import Settings



app = Flask(__name__, static_url_path='',
                  static_folder='frontend/build',
                  template_folder='frontend/build')

@app.post("/webhook")
def webhook():
    req = request.json
    return {"status":"received"}


@app.post("/updatesettings")
def updatesettings():
    req = request.json
    Settings.update_one({}, {"$set": req})
    return {"status":"success", "message":"received"}


# Serve React build
@app.route('/')
def serve():
    return render_template("index.html")


if __name__ == '__main__':
    app.run()

