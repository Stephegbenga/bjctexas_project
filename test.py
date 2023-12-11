from controllers.models import Events, Settings
from controllers.utils import should_message_be_sent


events = Events.find({})

for event in events:
    print(event)