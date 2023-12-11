from flask import Flask, request, render_template
from controllers.models import Settings, Events
from controllers.utils import timestamp, should_message_be_sent, sendemail


app = Flask(__name__, static_url_path='',
                  static_folder='frontend/build',
                  template_folder='frontend/build')

@app.post("/webhook")
def webhook():
    req = {}
    raw_text = request.data.decode('utf-8')
    req['value'] = raw_text
    req['timestamp'] = timestamp()
    req['sent'] = False

    setting = Settings.find_one({}, {"_id": 0})
    email = setting.get("email")

    emails = email.split(",")

    if should_message_be_sent(setting):
        for email in emails:
            email = email.strip()
            req['sent'] = True
            sendemail("New Event Received", email, req.get("value"))


    Events.insert_one(req)
    return {"status":"received"}


@app.get("/settings")
def getsettings():
    setting = Settings.find_one({}, {"_id": 0})
    return {"status":"success", "data": setting}


@app.post("/settings")
def updatesettings():
    req = request.json
    Settings.update_one({}, {"$set": req}, upsert=True)
    return {"status":"success", "message":"received"}


# Serve React build
@app.route('/')
def serve():
    return render_template("index.html")



if __name__ == '__main__':
    app.run()

