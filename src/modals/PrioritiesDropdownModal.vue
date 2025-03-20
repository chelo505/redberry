<template>
  <div class="modal-overlay" v-if="isVisible" @click.self="closeModal">
    <div class="modal-container">
      <div class="modal-content">
        <div class="checkbox-group">
          <div v-for="prio in priorities" v-bind:key="prio.id" class="checkbox-item">
            <label class="custom-checkbox-label">
              <input 
                id="checkbox" 
                type="checkbox" 
                :value="prio.name" 
                v-model="tempFilter"
              >
              <span class="custom-checkbox"></span>
              <span class="label-text">{{ prio.name }}</span>
            </label>
          </div>
        </div>
        <div class="button-container">
          <button class="submit-button" @click="submitSelection">არჩევა</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'PrioritiesModal',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tempFilter: [],
      filter: [],
      priorities: []
    }
  },
  created() {
    this.fetchPrioritiesData()
  },
  methods: {
    async fetchPrioritiesData() {
      const response = await axios("https://momentum.redberryinternship.ge/api/priorities")
      .catch(error => console.log(error))
      this.priorities = response.data
    },
    closeModal() {
      this.$emit('close')
    },
    submitSelection() {
      this.filter = this.tempFilter
      this.$emit('submit', this.filter)
      this.tempFilter = []
      this.closeModal()
    }
  }
}
</script>

<style scoped src="F:\vscodes\redberry\src\styles\PrioritiesDropdown.css">
</style>