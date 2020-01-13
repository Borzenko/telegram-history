<template>
    <v-flex class="info-container">
        <add-channel-input
            @join-channel="joinNewChannel($event)"
        />
        <channels-table
            :table-data="channels"
            @table-row-clicked="openInfoModal($event)"
            @update-channel="updateChannel($event)"
            @delete-channel="confirmDeleting($event)"
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
        <confirm-modal
            :modal-title="'Предупреждение'"
            :modal-text="'Вы уверены что хотите удалить канал? После удаления вы не сможете получать информацию об этом канале'"
            :width="'50%'"
            :max-width="'50%'"
            :show-modal="showConfirmModal"
            @confirm-deleting="deleteChannel(id)"
            @close-modal="showConfirmModal=false"
        />
    </v-flex>
</template>

<script>
import ChannelsTable from '../channels/ChannelsTable'
import AddChannelInput from '../channels/AddChannelInput'
import ShowChannelInfoModal from '../modals/ShowChannelInfoModal'
import ConfirmModal from '../modals/ConfirmModal'
import { getChannels, addNewChannel, updateChannelInfo, synchronizeChannels, deleteChannel } from '../../../services/channelService'
export default {
    components: {
        ChannelsTable,
        AddChannelInput,
        ShowChannelInfoModal,
        ConfirmModal
    },
    data() {
        return {
            channels: [],
            modalData: null,
            allData: null,
            showInfoModal: false,
            isAddedNewChannel: false,
            showConfirmModal: false,
            isDeleted: false,
            id: null
        }
    },
    watch: {
        isAddedNewChannel() {
            this.getClientChannels()
        },
        isDeleted() {
            this.confirmDeleting()
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

        },
        async deleteChannel() {
            const result = await deleteChannel(this.id)
            setTimeout(() => {
                if(result) {
                this.isAddedNewChannel = !this.isAddedNewChannel
                this.channels = []
            }
            }, 1000)
            this.showConfirmModal = false
        },
        async confirmDeleting({ data, event }) {
            this.id = data
            event.stopPropagation()
            this.showConfirmModal=true
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