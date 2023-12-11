from datetime import datetime, timedelta
from controllers.models import Settings
import requests
from dotenv import load_dotenv
load_dotenv()
import os
from time import sleep

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
    print(response.text)



def get_interval_in_seconds(value, unit):
    if unit == "min":
        value_in_seconds = int(value) * 60
    elif unit == "hour":
        value_in_seconds = int(value) * 60 * 60
    elif unit == "day":
        value_in_seconds = int(value) * 24 * 60 * 60
    else:
        value_in_seconds = int(value)
    return value_in_seconds



def send_email_on_schedule(message, settings):
    try:
        unit = settings.get("unit")
        value = int(settings.get('value'))

        max_email = int(settings.get("max_email"))

        email_list = settings.get("email")
        last_reset = settings.get("reset")

        emails = email_list.split(",")
        emails = [email.strip() for email in emails]

        forwarding = settings.get("forwarding")

        if not forwarding:
            return False

        sent_emails = 0
        interval = get_interval_in_seconds(value, unit)

        while True:
            if sent_emails >= max_email:
                return

            settings = Settings.find_one({})
            new_reset = settings.get("reset")

            if new_reset != last_reset:
                return

            for email in emails:
                sendemail("New Event Received", email, message)

            sent_emails += 1
            sleep(interval)

    except Exception as e:
        print(e)

