<template>
    <v-flex class="info-container">
        <add-channel-input />
        <channels-table
            :table-data="channels"
            @table-row-clicked="openInfoModal($event)"
        />
        <show-channel-info-modal
            :show-modal="showInfoModal"
            :channel-info="test"
            @close-modal="showInfoModal=false"
        />
    </v-flex>
</template>

<script>
import ChannelsTable from '../channels/ChannelsTable'
import AddChannelInput from '../channels/AddChannelInput'
import ShowChannelInfoModal from '../modals/ShowChannelInfoModal'
import { getChannels } from '../../../services/channelService'
export default {
    components: {
        ChannelsTable,
        AddChannelInput,
        ShowChannelInfoModal
    },
    data() {
        return {
            channels: [],
            test: null,
            showInfoModal: false
        }
    },
    methods: {
        async getClientChannels() {
            const res = (await getChannels()).data
            res.forEach(item => {
                if(item.history.length) {
                    this.channels.push({
                    title: item.history[item.history.length-1].title,
                    count: item.history[item.history.length-1].count,
                    description: item.history[item.history.length-1].description,
                    lastUpdated: item.updateTime
                })
                }
            });
            return res
        },
        openInfoModal(data) {
            this.test = data
            this.showInfoModal = true
        }
    },
    created() {
        this.getClientChannels()
    }
    
}
</script>

<style lang="sass">
.info-container
    padding: 32px
</style>