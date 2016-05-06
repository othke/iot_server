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
    url = 'http://localhost:8080/messages/'
    jsondata = json.dumps(message)
    jsondataasbytes = jsondata.encode('utf-8')
    req = urllib2.Request(url, jsondata)
    req.add_header('Content-Type', 'application/json')
    result = urllib2.urlopen(req)


def main():
    """
    Main process
    """
    start = datetime.now()
    # Prepare x messages
    X = 100000
    messages = []
    for i in range(X):
        messages.append(random_message())

    # Make multiprocessing request
    pool = multiprocessing.Pool(2)
    pool.map(request, messages)
    pool.close()
    pool.join()
    end = datetime.now()
    delta = end - start
    print delta



if __name__ == '__main__':
    main()
