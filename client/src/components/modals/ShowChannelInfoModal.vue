<template>
    <v-dialog v-model="showModal" persistent class="channel-info-modal" width="70%">
        <v-card>
            <v-icon @click="$emit('close-modal')" class="close-modal-btn">
                close
             </v-icon>
            <v-card-title>
                Информация о канале
            </v-card-title>
            <v-card-text v-if="channelInfo">
                <div class="avatar-container">
                    <v-avatar color="indigo" size="36">
                        <span class="white--text headline"></span>
                    </v-avatar>
                    <span>{{channelInfo.title}}</span>
                </div>
                <div v-if="channelInfo" class="description-container">
                    <span><span class="bold">Текущее название:</span> {{channelInfo.title}} (было обновленно {{formatDate(channelInfo.lastUpdatedTitle)}})</span>
                    <span class="sub-description">Старое название: {{channelInfo.oldTitle}}</span>
                </div>
                    <div class="description-container">
                        <span><span class="bold">Текущее описание:</span> {{channelInfo.description}} (было обновленно {{formatDate(channelInfo.lastUpdatedDescription)}})</span>
                        <span class="sub-description">Старое описание: {{channelInfo.oldDescription}}</span>
                    </div>
                    <div class="description-container">
                        <span><span class="bold">Количество участников:</span> {{channelInfo.count}}</span>
                    </div>
                    <span class="bold channel-title">История Изменений</span>
                     <v-data-table
                        :headers="headers"
                        :items="tableData"
                        :sort-by="['lastUpdated']"
                        :sort-desc="[true]"
                        hide-default-footer
                        class="elevation-1"
                    >
                        <template v-slot:item="{ item }">
                            <tr>
                                <td v-if="item.oldTitle">{{ item.oldTitle }}</td>
                                <td v-else> - </td>
                                <td>{{ item.history[item.history.length - 1].title }}</td>
                                <td v-if="item.lastUpdatedTitle">{{ formatDate(item.lastUpdatedTitle) }}</td>
                                <td v-else>{{ formatDate(item.updateTime) }}</td>
                            </tr>
                            <tr>
                                <td v-if="item.oldDescription">{{ item.oldDescription }}</td>
                                <td v-else> - </td>
                                <td>{{ item.history[item.history.length - 1].description }}</td>
                                <td v-if="item.lastUpdatedDescription">{{ formatDate(item.lastUpdatedDescription) }}</td>
                                <td v-else>{{ formatDate(item.updateTime) }}</td>
                            </tr>
                        </template>
                     </v-data-table>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
 import moment from 'moment'
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
            oldChannelInfo: null,
            tableData: null,
            headers: [
                { text: 'Старое значение', value: 'oldDescription', sortable: false, width: '30%'},
                { text: 'Новое значение', value: 'description', sortable: false, width: '50%'},
                { text: 'Последнее обновление', value: 'lastUpdated' }
            ]
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
        this.tableData = dataForChannel
         const res = data ? this.isDataUpdated(this.channelInfo, data) : false
         if(!res) {
             const obj = {
                 title: data.title,
                 count: data.count,
                 description: data.description,
             }
             this.oldChannelInfo = obj
         }
        },
        formatDate(date) {
          return moment(date).lang('ru').startOf('minute').fromNow()
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
.avatar-container
    display: flex
    justify-content: center
    margin: 1rem 0
.avatar-container span
    padding: 5px 0 0 10px
    vertical-align: middle
    text-transform: capitalize
.description-container
    display: flex
    flex-direction: column
    font-size: 17px
    padding: 5px 0
.sub-description
    font-size: 15px
    padding: 10px 0
.channel-title
    display: flex
    justify-content: center
    padding-bottom: 15px
</style>