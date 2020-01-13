import axios from 'axios'

const getChannels = () => {
    return  axios.get('http://178.128.244.121/api/channels')
}
const addNewChannel = (link) => {
    const body = {
        link: link
    } 
    return axios.post('http://178.128.244.121/api/join-channel', body)
}
const updateChannelInfo = (id) => {
    return axios.get(`http://178.128.244.121/api/get-channel-data/${id}`)
}
const synchronizeChannels = () => {
    return axios.get(`http://178.128.244.121/api/export-channels`)
}
const deleteChannel = (id) => {
    return axios.delete(`http://178.128.244.121/api/delete-channel/${id}`)
}
 
export {
    getChannels,
    addNewChannel,
    updateChannelInfo,
    synchronizeChannels,
    deleteChannel
}