api_id = 777963
api_hash = 'aef5ef37352eee476dbfe33a52aa2b3d'

import base64
import os
import asyncio
import sys
import telethon


import hypercorn.asyncio, pymongo
from quart import Quart, render_template_string, request, jsonify
from quart_cors import cors
from bson.json_util import dumps

from telethon import TelegramClient, utils
from telethon.tl.functions.channels import GetFullChannelRequest
import eventlet

# Telethon client
client = TelegramClient('79192868958', api_id, api_hash)
client.start()
# Quart app
app = Quart(__name__)
app = cors(app)
app.secret_key = '123'


# Connect the client before we start serving with Quart
@app.before_serving
async def startup():
    print('Server started')
    await client.connect()
    # await proceed()

@app.route('/get-information-about-channels', methods=['GET'])
def getInformationAboutChannels():
    return 'works'


# After we're done serving (near shutdown), clean up the client
@app.after_serving
async def cleanup():
     await client.disconnect()


from telethon.errors.rpcerrorlist import UserAlreadyParticipantError

@app.route('/', methods=['POST'])
async def root():
    try:
        body = await request.get_json()
        print(body)
        res = await proceed(body)
        print(res)
        return dumps(res)
    except telethon.errors.rpcerrorlist.UserAlreadyParticipantError: 
        return dumps({ 'error': 'UserAlreadyParticipantError'})
    except telethon.errors.rpcerrorlist.FloodWaitError:
        return dumps({ 'error': 'FloodWaitError'})
    except:
        e = sys.exc_info()[0]
        print(e)
        return dumps({ 'error': 'Error join' })


@app.route('/sync', methods=['POST'])
async def syncData():
    channels = mycol.find()
    for channel in channels: 

        channel_entity= await client.get_entity(channel.get('channel_id'))
        print(channel_entity)
        count = ( await client.get_participants(channel.get('channel_id'), limit=0)).total
    
        # mycol.update({ 'channel_id': channel.get('channel_id') }, {
        #     '$push': {
        #         'history': {
        #             "title": channel_entity.title,
        #             "count": count
        #         }
        #     }
        # })

    return dumps(channels)

@app.route('/info', methods=['GET'])
def getPosts():
    result = dumps(mycol.find())
    return result


async def main():
    await hypercorn.asyncio.serve(app, hypercorn.Config())

if __name__ == '__main__':
    client.loop.run_until_complete(main())