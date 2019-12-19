<template>
    <v-dialog v-model="showModal" class="channel-info-modal" width="60%">
        <v-card>
            <v-icon @click="$emit('close-modal')" class="close-modal-btn">
                close
             </v-icon>
            <v-card-title>
                Channel Info
            </v-card-title>
            <v-card-text>
                <span v-for="(channel, index) in channelInfo" :key="index">
                    <div>{{channel}}</div>
                </span>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        channelInfo: {
            type: Object,
            default: () => ({})
        },
        showModal: {
            type: Boolean,
            default: false
        }
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

</style>