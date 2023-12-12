from controllers.models import Settings

setting = Settings.update_one({}, {"$set":{"password": "1234"}})

print(setting)