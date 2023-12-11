from controllers.models import Settings

settings = Settings.find({})

for setting in settings:
    print(setting)