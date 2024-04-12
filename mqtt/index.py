from conn import iot_db, mq_client, username, password, remote_ip, port
from loguru import logger
import json


topics = [("r/dht22/temp", 0), ("r/dht22/humi", 0), ("r/ldr/lux", 0)]


# Message handler to parse and insert data into the database
def message_handler(payload, topic):
    sensor = iot_db["Reading"]

    if "isBatch" in payload and payload["isBatch"]:
        # If it's a batch insert, the data should be an array of documents
        if isinstance(payload["data"], list):
            sensor.insert_many(payload["data"])
        else:
            logger.error(f"Batch insert requested but data is not an array: {payload}")
    else:
        sensor.insert_one(payload)

    logger.debug(f"Message received [{topic}]: {payload}")


# Connection callback for mqtt client
def on_connect(mq_client, userdata, flags, rc):
    logger.info(f"Connected with result code {rc}")
    mq_client.subscribe(topics)


# Message callback for mqtt client
def on_message(mq_client, userdata, msg):
    logger.info(f"Message received on topic: {msg.topic}")
    payload = json.loads(msg.payload)
    message_handler(payload, msg.topic)


try:
    # Setup connection and message callbacks
    mq_client.on_connect = on_connect
    mq_client.on_message = on_message
    mq_client.username_pw_set(username, password)
    mq_client.connect(remote_ip, port)
    mq_client.loop_forever()
except Exception as e:
    logger.error(f"Error: {e}")
