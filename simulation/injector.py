import uuid
from datetime import datetime, timedelta
import random
import urllib2
import json
import multiprocessing


def random_message():
    """
    Make a random message
    """
    MAX_SENSOR = 20
    MAX_VALUE = 1000
    message = dict(id='', timestamp='', sensorType=0, value=0)
    message['id'] = str(uuid.uuid4())
    message['timestamp'] = random_date().isoformat('T') + 'Z'
    message['sensorType'] = int(random.random() * MAX_SENSOR)
    message['value'] = int(random.random() * MAX_VALUE)
    return message


def random_date(hour=2):
    """
    Get a random date x hours before
    """
    now = datetime.now()
    minutes = int(random.random() * hour * 60) * -1
    delta = timedelta(minutes=minutes)
    time_delta = now + delta
    return time_delta


def request(message):
    """
    Make request
    """
    start = datetime.now()
    url = 'http://192.168.0.16:8000'

    req = urllib2.Request(url)
    # req.add_header('Content-Type', 'application/json')
    result = urllib2.urlopen(req)
    end = datetime.now()
    delta = end - start
    print delta


def main():
    """
    Main process
    """

    # Prepare x messages
    X = 1000
    messages= []
    for i in range(X):
        message = random_message()
        message['id'] = 'id' + str(i)
        messages.append(message)

    # Make multiprocessing request
    pool = multiprocessing.Pool(4)
    start = datetime.now()
    pool.map(request, messages)
    pool.close()
    pool.join()
    end = datetime.now()
    delta = end - start
    print delta

if __name__ == '__main__':
    main()
