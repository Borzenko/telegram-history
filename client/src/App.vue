<template>
  <v-app>
      <channels-info-container />
  </v-app>
</template>

<script>
import ChannelsInfoContainer from './components/channels/ChannelsInfoContainer'

export default {
  name: 'App',

  components: {
      ChannelsInfoContainer
  },

  data: () => ({
    //
  }),
};
</script>
