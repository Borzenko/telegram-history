import axios from 'axios'

const getChannels = async () => {
    return await axios.get('http://localhost:3000/channels')
}
const addNewChannel = async (link) => {
    const body = {
        link: link
    } 
    return await axios.post('http://localhost:3000/join-channel', body)
}
const updateChannelInfo = async (id) => {
    return await axios.get(`http://localhost:3000/get-channel-data/${id}`)
}

export {
    getChannels,
    addNewChannel,
    updateChannelInfo
}