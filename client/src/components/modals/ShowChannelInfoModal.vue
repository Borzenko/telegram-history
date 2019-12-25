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
                    <span><span class="bold">Текущее название:</span> {{channelInfo.title}} 
                    <span v-if="channelInfo.lastUpdatedTitle"> (было обновленно {{ formatDate(channelInfo.lastUpdatedTitle) }})</span>
                    <span v-else> (было обновленно {{ formatDate(channelInfo.lastUpdated )}})</span>
                    </span>
                    <span class="sub-description" v-if="channelInfo.oldTitle">Старое название: {{channelInfo.oldTitle}}</span>
                </div>
                    <div class="description-container">
                        <span><span class="bold" v-if="channelInfo.description">Текущее описание:</span> 
                        <span> {{channelInfo.description}}</span> 
                        <span v-if="channelInfo.lastUpdatedDescription"> (было обновленно {{formatDate(channelInfo.lastUpdatedDescription)}})</span>
                        <span v-else> (было обновленно {{formatDate(channelInfo.lastUpdated)}})</span>

                        </span>
                        <span class="sub-description" v-if="channelInfo.oldDescription">Старое описание: {{channelInfo.oldDescription}}</span>
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
                        :no-results-text="noDataText"
                        hide-default-footer
                        class="elevation-1"
                    >
                        <template v-slot:item="{ item }">
                            <tr v-if="item.oldTitle">
                                <td v-if="item.oldTitle">{{ item.oldTitle }}</td>
                                <td v-if="item.history">{{ item.history[item.history.length - 1].title }}</td>
                                <td v-if="item.lastUpdatedTitle">{{ formatDate(item.lastUpdatedTitle) }}</td>
                                <td v-else>{{ formatDate(item.updateTime) }}</td>
                            </tr>
                            <tr v-if="item.oldDescription">
                                <td>{{ item.oldDescription }}</td>
                                <td v-if="item.history">{{ item.history[item.history.length - 1].description }}</td>
                                <td v-if="item.lastUpdatedDescription">{{ formatDate(item.lastUpdatedDescription) }}</td>
                                <td v-else>{{ formatDate(item.updateTime) }}</td>
                            </tr>
                            <tr v-if="!item.oldTitle && !item.oldDescription">
                                <td></td>
                                <td>{{noDataText}}</td>
                                <td></td>
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
                { text: 'Старое значение', value: 'oldDescription', sortable: false, width: '33%'},
                { text: 'Новое значение', value: 'description', sortable: false, width: '33%'},
                { text: 'Последнее обновление', value: 'lastUpdated', width: '30%'  }
            ],
            noDataText: "Канал был недавно создан. Истории изменений нет"
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
        this.tableData = dataForChannel
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