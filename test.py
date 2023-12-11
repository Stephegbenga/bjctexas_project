from controllers.models import Events, Settings
from controllers.utils import should_message_be_sent


setting = Settings.find_one({})

print(should_message_be_sent(setting))