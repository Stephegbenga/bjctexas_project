from controllers.models import Settings

setting = Settings.find_one({})

print(setting)