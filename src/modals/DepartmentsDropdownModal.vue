<template>
  <div class="modal-overlay" v-if="isVisible" @click.self="closeModal">
    <div class="modal-container">
      <div class="modal-content">
        <div class="checkbox-group">
          <div v-for="dep in departments" v-bind:key="dep.id" class="checkbox-item">
            <label class="custom-checkbox-label">
              <input 
                id="checkbox" 
                type="checkbox" 
                :value="dep.name" 
                v-model="tempFilter"
              >
              <span class="custom-checkbox"></span>
              <span class="label-text">{{ dep.name }}</span>
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
  name: 'DepartmentsModal',
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
      departments: []
    }
  },
  created() {
    this.fetchDepartmentData()
  },
  methods: {
    async fetchDepartmentData() {
      const response = await axios("https://momentum.redberryinternship.ge/api/departments")
      .catch(error => console.log(error))
      this.departments = response.data
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

<style scoped src="F:\vscodes\redberry\src\styles\DepartmentsDropdownModal.css">
</style>