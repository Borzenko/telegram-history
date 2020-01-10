<template>
    <v-flex class="info-container">
        <add-channel-input
            @join-channel="joinNewChannel($event)"
        />
        <channels-table
            :table-data="channels"
            @table-row-clicked="openInfoModal($event)"
            @update-channel="updateChannel($event)"
        />
        <show-channel-info-modal
            v-if="allData && modalData"
            :show-modal="showInfoModal"
            :channel-info="modalData"
            :all-channels-info="allData"
            @close-modal="showInfoModal=false"
        />
        <v-flex class="sync-btn-container">
            <v-btn
                outlined
                class="sync-btn"
                @click="synchronizeChannelsInfo()"
            >
                Синхронизировать
            </v-btn>
        </v-flex>
    </v-flex>
</template>

<script>
import ChannelsTable from '../channels/ChannelsTable'
import AddChannelInput from '../channels/AddChannelInput'
import ShowChannelInfoModal from '../modals/ShowChannelInfoModal'
import { getChannels, addNewChannel, updateChannelInfo, synchronizeChannels } from '../../../services/channelService'
export default {
    components: {
        ChannelsTable,
        AddChannelInput,
        ShowChannelInfoModal
    },
    data() {
        return {
            channels: [],
            modalData: null,
            allData: null,
            showInfoModal: false,
            isAddedNewChannel: false
        }
    },
    watch: {
        isAddedNewChannel() {
            this.getClientChannels()
        }

    },
    methods: {
        async getClientChannels() {
            const res = (await getChannels()).data
            this.allData = res
            res.forEach(item => {
                if(item.history) {
                    this.channels.push(item)
                }
            });
            return res
        },
        openInfoModal(data) {
            this.modalData = data
            this.showInfoModal = true
        },
        async joinNewChannel(link) {
           await addNewChannel(link)
           this.isAddedNewChannel = !this.isAddedNewChannel
           this.channels = []

        },
        async updateChannel({ data, event }) {
           event.stopPropagation()
           await updateChannelInfo(data)
           this.isAddedNewChannel = !this.isAddedNewChannel
           this.channels = []
        },
        async synchronizeChannelsInfo() {
           await synchronizeChannels()
            this.isAddedNewChannel = !this.isAddedNewChannel
            this.channels = []

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
.sync-btn-container
    margin-top: 2rem
    display: flex
    justify-content: flex-end
</style>