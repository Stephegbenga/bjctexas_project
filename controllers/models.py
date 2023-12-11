from dotenv import load_dotenv
load_dotenv()
from pymongo import MongoClient
import os

DB_URL=os.getenv("database_url")

conn = MongoClient(DB_URL)
db = conn.get_database("bjctexas")

#timestamp, value
Events = db.get_collection("events")

#only one setting
Settings = db.get_collection("settings")


