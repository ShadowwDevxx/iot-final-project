import paho.mqtt.client as mqtt
import pymongo
import os
from dotenv import load_dotenv
from loguru import logger


load_dotenv()

# Load environment variables
db_url = os.environ.get("DATABASE_URL")
client_id = os.environ.get("MQTT_CLIENT_ID")
remote_ip = os.environ.get("MQTT_REMOTE_IP")
port = int(os.environ.get("MQTT_PORT"))
db_name = os.environ.get("DB_NAME")
username = os.environ.get("MQTT_USERNAME")
password = os.environ.get("MQTT_PASSWORD")

# Check if environment variables are set
if (
    not db_url
    or not client_id
    or not remote_ip
    or not port
    or not db_name
    or not username
    or not password
):
    raise Exception("Environment variables are not set")
else:
    logger.info("Environment variables loaded")
    logger.debug(f"DATABASE_URL: {db_url}")
    logger.debug(f"MQTT_CLIENT_ID: {client_id}")
    logger.debug(f"MQTT_REMOTE_IP: {remote_ip}")
    logger.debug(f"MQTT_PORT: {port}")
    logger.debug(f"DB_NAME: {db_name}")
    logger.debug(f"MQTT_USERNAME: {username}")
    logger.debug(f"MQTT_PASSWORD: {password}")

# MongoDB connection
db_client = pymongo.MongoClient(db_url)
iot_db = db_client[db_name]

# MQTT connection
mq_client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1, client_id)
