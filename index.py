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
from telethon.tl.functions.channels import GetFullChannelRequest
from telethon.tl.types import PeerChannel
from telethon.tl.functions.messages import ImportChatInviteRequest
from telethon.tl.functions.channels import JoinChannelRequest
from telethon import errors
from telethon.tl.functions.channels import LeaveChannelRequest
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

        channel_entity = await client.get_entity(channel.get('channel_id'))
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

@app.route('/join-channel', methods=['POST'])
async def joinChannel():
    try:
        req = await request.get_json()

        joinLink = req['link']
        isPrivate = False

        if(len(joinLink.split("joinchat/",1)) == 2):
            link = joinLink.split("joinchat/",1)[1]
            isPrivate = True
        else:
            link = joinLink.split("https://t.me/",1)[1]

        if (isPrivate):
            res = await client(ImportChatInviteRequest(link))
        else:
            res = await client(JoinChannelRequest(link))

        channel = res.chats[0]
        count = ( await client.get_participants(channel.id, limit=0)).total

        return { "channel_id": channel.id,
            "history": [{
                "title": channel.title,
                "count": count
            }]
        }
    except telethon.errors.rpcerrorlist.UserAlreadyParticipantError: 
        return dumps({ 'error': 'UserAlreadyParticipantError'})
    except telethon.errors.rpcerrorlist.FloodWaitError:
        return dumps({ 'error': 'FloodWaitError'})
    except:
        e = sys.exc_info()[0]
        print(e)
        return dumps({ 'error': 'Error join' })
from telethon import functions, types
@app.route('/get-channel-data/<int:id>', methods=['GET'])
async def getChannelInfo(id):
    try:
        channel = await client.get_entity(PeerChannel(id))
        chat_request = await client(GetFullChannelRequest(channel=channel))
        chat_full = chat_request.full_chat.about
        count = (await client.get_participants(id, limit=0)).total
        photo = await client.get_profile_photos(id)
        channel_photo = await client.download_media(photo[0])
        return {
            "title": channel.title,
            "description": chat_full,
            "count": count,
            "avatar": channel_photo
        }
    except telethon.errors.rpcerrorlist.FloodWaitError:
        return dumps({ 'error': 'FloodWaitError'})
# @app.route('/delete-channel/<int:id>', methods=['DELETE'])
# async def deleteChannel(): 
#     try:
#         client(functions.messages.DeleteChatUserRequest(
#         chat_id=chat_id,
#         user_id='me'
# ))

async def main():
    await hypercorn.asyncio.serve(app, hypercorn.Config())

if __name__ == '__main__':
    client.loop.run_until_complete(main())