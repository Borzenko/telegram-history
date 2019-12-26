<template>
    <v-flex class="add-channel-container">
        <v-text-field
            label="Введите ссылку на телеграм канал"
            class="add-channel-input"
            v-model="channelLink"
            single-line
            solo
          />
          <v-btn
            outlined
            color='red'
            class="add-channel-btn"
            @click="joinChannel"
          >
              Добавить канал
          </v-btn>
    </v-flex>
</template>

<script>
export default {
    data() {
        return {
            channelLink: ''
        }
    },
    methods: {
        joinChannel() {
            this.$emit('join-channel', this.channelLink)
            this.channelLink = ''
        }
    }
}
</script>
<style lang="sass">
.add-channel-container
    display: flex
    flex-direction: row
    justify-content: space-between
    height: 50px
    margin-bottom: 2rem
.add-channel-input
    padding-right: 20px !important
.add-channel-btn
    margin: auto !important
</style>