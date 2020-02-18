<template>
    <v-data-table
        :headers="headers"
        :items="tableData"
        :items-per-page="100"
        :sort-by="['updateTime']"
        :sort-desc="[true]"
        class="elevation-1"
    >
    <template v-if="tableData" v-slot:item="{ item }">
        <tr
            @click="$emit('table-row-clicked', item)"
            :class="{'red-status': checkStatus(item.updateTime) === 'red', 'orange-status': checkStatus(item.updateTime) === 'orange'  }"
        >
            <td>
                <v-avatar
                    class="table-avatar"
                >
                <img
                    :src="item.history[item.history.length - 1].avatar"
                />
                </v-avatar>{{ item.history[item.history.length - 1].title }}</td>
            <td>{{ item.history[item.history.length - 1].count }}</td>
            <td>{{ item.history[item.history.length - 1].description }}</td>
            <td>{{ formatDate(item.updateTime) }}</td>
            <td>
                <v-btn
                    outlined
                    class="update-channel-btn"
                    @click="$emit('update-channel', { data: item.channel_id, event: $event })"
                >
                    Обновить
                </v-btn>
            </td>
            <td>
                <v-icon
                    @click="$emit('delete-channel', { data: item.channel_id, event: $event })"
                >
                    mdi-delete
                </v-icon>
            </td>
        </tr>
      </template>
    </v-data-table>
</template>
 <script>
 import moment from 'moment'
  export default {
      props: {
          tableData: {
              type: Array,
              default: () => ([])
          }
      },
    data () {
      return {
        headers: [
          {
            text: 'Название канала',
            align: 'left',
            sortable: false,
            value: 'title',
          },
          { text: 'Подписчики', value: 'count' },
          { text: 'Описание', value: 'description', sortable: false, width: '45%'},
          { text: 'Последнее обновление', value: 'updateTime' }
        ]
      }
    },
    methods: {
        checkStatus(date) {
            const status = moment(date).fromNow()
            return !(status.includes('day') || status.includes('month')) ? 'red' : 'orange'
    },
    formatDate(date) {
        return moment(date).lang('ru').startOf('minute').fromNow()
    }
  } 
}
</script>
<style lang="sass">
.red-status
    background-color: rgba(238, 85, 101, .11 )
.orange-status
    background-color: orange
.table-avatar
    margin-right: 20px
.update-channel-btn
    border-color: red
    color: red !important
.table-avatar
    width: 40px !important
    height: 40px !important
</style>
