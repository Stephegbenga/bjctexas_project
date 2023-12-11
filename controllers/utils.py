from datetime import datetime, timedelta

def timestamp():
    return datetime.utcnow().isoformat()

def sendemail(subject, email, message)