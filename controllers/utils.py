from datetime import datetime, timedelta
from controllers.models import Events
import requests
from dotenv import load_dotenv
load_dotenv()
import os

emailsender_url = os.getenv("emailsender_url")

def timestamp():
    return datetime.utcnow().isoformat()

def sendemail(subject, email, message):
    params = {
        "subject": subject,
        "email": email,
        "message": message
    }
    response = requests.get(emailsender_url, params=params)
    print(response.json())


def should_message_be_sent(settings):
    try:
        unit = settings.get("unit")
        value = int(settings.get('value'))
        max_email = int(settings.get("max_email"))
        forwarding = settings.get("forwarding")

        if not forwarding:
            return False

        current_time = datetime.utcnow()

        if unit == "min":
            timeago = datetime.utcnow() - timedelta(minutes=value)
        elif unit == "day":
            timeago = datetime.utcnow() - timedelta(days=value)
        else:
            timeago = datetime.utcnow() - timedelta(hours=value)

        query = {"timestamp": {"$gte": timeago.isoformat(), "$lte": current_time.isoformat()}}
        events = list(Events.find(query))

        if len(events) < max_email:
            return True
        else:
            return False
    except Exception as e:
        print(e)
        return False