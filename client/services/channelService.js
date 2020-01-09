import axios from 'axios'

const getChannels = async () => {
    return await axios.get('http://178.128.244.121/api/channels')
}
const addNewChannel = async (link) => {
    const body = {
        link: link
    } 
    return await axios.post('http://178.128.244.121/api/join-channel', body)
}
const updateChannelInfo = async (id) => {
    return await axios.get(`http://178.128.244.121/api/get-channel-data/${id}`)
}
const synchronizeChannels = async() => {
    return await axios.get(`http://178.128.244.121/api:3000/export-channels`)
}

export {
    getChannels,
    addNewChannel,
    updateChannelInfo,
    synchronizeChannels
}