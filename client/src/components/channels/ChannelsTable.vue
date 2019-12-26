<template>
    <v-data-table
        :headers="headers"
        :items="tableData"
        :items-per-page="10"
        :sort-by="['updateTime']"
        :sort-desc="[true]"
        class="elevation-1"
    >
    <template v-if="tableData" v-slot:item="{ item }">
        <tr
            @click="$emit('table-row-clicked', item)"
            :class="{'red-status': checkStatus(item.updateTime) === 'red', 'orange-status': checkStatus(item.updateTime) === 'orange'  }"
        >
            <td>{{ item.history[item.history.length - 1].title }}</td>
            <td>{{ item.history[item.history.length - 1].count }}</td>
            <td>{{ item.history[item.history.length - 1].description }}</td>
            <td>{{ formatDate(item.updateTime) }}</td>
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
          { text: 'Описание', value: 'description', sortable: false, width: '60%'},
          { text: 'Последнее обновление', value: 'updateTime' }
        ],
      }
    },
    methods: {
        checkStatus(date) {
            const status = moment(date).fromNow()
            return !(status.includes('days') || status.includes('month')) ? 'red' : 'orange'
    },
    formatDate(date) {
        return moment(date).lang('ru').startOf('minute').fromNow()
    }
  } 
}
</script>
<style lang="sass">
.red-status
    background-color: red
.orange-status
    background-color: orange
</style>
