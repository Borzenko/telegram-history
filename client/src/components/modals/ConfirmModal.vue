<template>
    <v-dialog v-model="showModal" :width="width" :max-width="maxWidth" persistent>
        <v-card class="confirm-modal">
            <v-icon @click="$emit('close-modal')" class="close-modal-btn">
                close
             </v-icon>
            <v-card-title>
                {{modalTitle}}
            </v-card-title>
        <v-card-text class="confirm-modal-text">
            {{modalText}}
        </v-card-text>
        <v-card-actions class="confirm-modal-btn-container">
            <v-btn
                color="green"
                class="confirm-btn"
                @click="$emit('confirm-deleting')"
            >
                {{okButtonText}}
            </v-btn>
            <v-btn
                color="red"
                class="cancel-btn"
                @click="$emit('close-modal')"
            >
                {{cancelButtonText}}
            </v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        showModal:{
            type: Boolean,
            default: false
        },
        modalTitle: {
            type: String,
            default: ''
        },
        modalText: {
            type: String,
            default: ''
        },
        okButtonText: {
            type: String,
            default: 'Ок'
        },
        cancelButtonText: {
            type: String,
            default: 'Отмена'
        },
        width: {
            type: String,
            default: '50%'
        },
        maxWidth: {
            type: String,
            default: '50%'
        }
    }
}
</script>

<style lang="sass">
.close-modal-btn
    position: absolute
    top: 5px
    right: 5px
.confirm-modal
    min-height: 250px
.confirm-modal-btn-container
    display: flex
    justify-content: center
    .confirm-btn, .cancel-btn
        width: 150px !important
        color: white !important
.confirm-modal-text
    margin: 2rem 0
    font-size: 20px
</style>