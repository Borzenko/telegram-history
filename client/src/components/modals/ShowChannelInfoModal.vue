<template>
    <v-dialog v-model="showModal" class="channel-info-modal" width="60%">
        <v-card>
            <v-icon @click="$emit('close-modal')" class="close-modal-btn">
                close
             </v-icon>
            <v-card-title>
                Channel Info
            </v-card-title>
            <v-card-text v-if="channelInfo">
                <div v-if="oldChannelInfo">
                    <span class="bold">Old Channel Info</span>
                    <span v-for="(channel, index) in Object.keys(oldChannelInfo)" :key="index">
                        <div>{{channel}} : {{oldChannelInfo[channel]}} </div>
                    </span>
                </div>
                    <span class="bold">New Channel Info</span>
                    <span v-for="(item, index) in Object.keys(channelInfo)" :key="index">
                        <div>{{item}} : {{channelInfo[item]}} </div>
                    </span>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        channelInfo: {
            type: Object,
            default: () => ({})
        },
        showModal: {
            type: Boolean,
            default: false
        },
        allChannelsInfo: {
            type: Array,
            default: () => ([])
        }
    },
    data() {
        return {
            oldChannelInfo: null
        }

    },
    watch: {
        channelInfo() {
            this.getChannelData()
        }
    },
    methods: {
        isDataUpdated(newData, oldData) {
            return Object.keys(oldData).every(key => 
                oldData[key] === newData[key])
        },
        getChannelData() {
        const dataForChannel = this.allChannelsInfo && this.channelInfo ? this.allChannelsInfo.filter(item => item.channel_id === this.channelInfo.channel_id) : []
        const data = dataForChannel ? dataForChannel[0].history[dataForChannel[0].history.length - 2] : {}
         const res = data ? this.isDataUpdated(this.channelInfo, data) : false
         if(!res) {
             const obj = {
                 title: data.title,
                 count: data.count,
                 description: data.description,
             }
             this.oldChannelInfo = obj
         }
        }
    },
    created() {
        this.getChannelData()
    }
}
</script>

<style lang="sass">
.channel-info-modal
    position: relative
.close-modal-btn
    position: absolute
    top: 5px
    right: 5px
.bold
    font-weight: bold

</style>