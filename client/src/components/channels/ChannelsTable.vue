<template>
    <v-data-table
        :headers="headers"
        :items="tableData"
        :items-per-page="10"
        :sort-by="['lastUpdated']"
        :sort-desc="[true]"
        @click:row="$emit('table-row-clicked', $event)"
        class="elevation-1"
    >
    <template v-if="tableData" v-slot:items="props">
        <tr class="red-status"></tr>
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
            text: 'Channel Name',
            align: 'left',
            sortable: false,
            value: 'title',
          },
          { text: 'Subscribers', value: 'count' },
          { text: 'Description', value: 'description', sortable: false, width: '60%'},
          { text: 'Last Updated', value: 'lastUpdated' }
        ],
      }
    },
    methods: {
        // generateTableData(tableDataArray) {
        //     let responseData = []
        //     tableDataArray.map((item, index) => {
        //         let rowObject = {}
        //         rowObject[0] = {
        //             type: 'text',
        //             class: ''
        //         }
        //     })
        // }
        checkStatus(date) {
            const status = moment(date).fromNow()
            return !(status.includes('days') || status.includes('month')) ? 'red' : 'orange'
    }
  } 
}
</script>
<style lang="sass">
.red-status
    background-color: red
</style>
