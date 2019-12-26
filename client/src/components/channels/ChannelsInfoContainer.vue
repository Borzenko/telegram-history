<template>
    <v-flex class="info-container">
        <add-channel-input
            @join-channel="joinNewChannel($event)"
        />
        <channels-table
            :table-data="channels"
            @table-row-clicked="openInfoModal($event)"
        />
        <show-channel-info-modal
            v-if="allData && test"
            :show-modal="showInfoModal"
            :channel-info="test"
            :all-channels-info="allData"
            @close-modal="showInfoModal=false"
        />
        <v-flex class="sync-btn-container">
            <v-btn
                class="sync-btn"
            >
                Sync Data
            </v-btn>
        </v-flex>
    </v-flex>
</template>

<script>
import ChannelsTable from '../channels/ChannelsTable'
import AddChannelInput from '../channels/AddChannelInput'
import ShowChannelInfoModal from '../modals/ShowChannelInfoModal'
import { getChannels, addNewChannel } from '../../../services/channelService'
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
            allData: null,
            showInfoModal: false
        }
    },
    methods: {
        async getClientChannels() {
            const res = (await getChannels()).data
            this.allData = res
            res.forEach(item => {
                if(item.history.length) {
                    this.channels.push(item)
                }
            });
            return res
        },
        openInfoModal(data) {
            this.test = data
            this.showInfoModal = true
        },
        async joinNewChannel(link) {
           await addNewChannel(link)
        }

    },
    created() {
        this.getClientChannels()
    }
    // mounted() {
    //     setTimeout(() => {
    //         this.channels = []
    //         this.getClientChannels()
    //     }, 10000)
    // }
    
}
</script>

<style lang="sass">
.info-container
    padding: 32px
.sync-btn-container
    margin-top: 2rem
    display: flex
    justify-content: flex-end
</style>