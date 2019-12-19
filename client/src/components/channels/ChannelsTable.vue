<template>
  <v-data-table
    :headers="headers"
    :items="tableData"
    :items-per-page="10"
    @click:row="$emit('table-row-clicked', $event)"
    class="elevation-1"
  />
</template>
 <script>
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
  }
</script>
<style lang="sass">

</style>