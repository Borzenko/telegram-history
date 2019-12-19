<template>
    <v-flex class="info-container">
        <add-channel-input />
        <channels-table />
    </v-flex>
</template>

<script>
import ChannelsTable from '../channels/ChannelsTable'
import AddChannelInput from '../channels/AddChannelInput'
export default {
    components: {
        ChannelsTable,
        AddChannelInput
    }
    
}
</script>

<style lang="sass">
.info-container
    padding: 32px
</style>