<template>
  <!-- Icon -->
  <IconMail class="opacity-60" v-if="type == 'E-Mail'" />
  <IconMemo class="opacity-60" v-if="type == 'Notiz'" />
  <IconPhoneIngoing class="opacity-60" v-if="type == 'Eingehender Anruf'" />
  <IconPhoneOutgoing class="opacity-60" v-if="type == 'Ausgehender Anruf'" />
  <!-- Description -->
  <p class="inline pl-4" v-if="type == 'E-Mail'">E-Mail</p>
  <p class="inline pl-4" v-else-if="type == 'Notiz'">Notiz</p>
  <p class="inline pl-4" v-else-if="type == 'Eingehender Anruf'">Telefonat</p>
  <p class="inline pl-4" v-else-if="type == 'Ausgehender Anruf'">Telefonat</p>
  <p class="inline pl-4" v-else>{{ type }}</p>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true,
    },
  },
};
</script>
