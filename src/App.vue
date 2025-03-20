<template>
  <div class="app">
    <div class="nav-bar">
      <img @click="goToHome" class="nav-bar-image" src="./assets/Frame 1000006027.png">
      <div class="empasign-container">
        <button @click="showEmployeeModal = true" class="employee-create">თანამშრომლის შექმნა</button>
        <button @click="goToAssignmentCreatePage" class="assignment-create">+ შექმენი ახალი დავალება</button>
      </div>
    </div>
  <Transition mode="in-out" fade>
    <EmployeeModal 
      :showModal="showEmployeeModal" 
      @close="showEmployeeModal = false"
      @employee-created="handleEmployeeCreated"
    />
  </Transition>
    <router-view @open-employee-modal="openEmployeeModal"></router-view>
  </div>
</template>

<script>
import router from './router'
import EmployeeModal from './modals/EmployeeModal.vue'

export default {
  name: "App",
  components: {
    EmployeeModal
  },
  data() {
    return {
      showEmployeeModal: false
    }
  },
  methods: {
    goToHome() {
      router.push('/')
    },
    goToAssignmentCreatePage() {
      sessionStorage.setItem('prioFilters', [])
      sessionStorage.setItem('depFilters', [])
      sessionStorage.setItem('empFilters', [])
      router.push('/createAssignment')
    },
    openEmployeeModal() {
      this.showEmployeeModal = true
    },
    handleEmployeeCreated() {
      alert("Employee created!")
    }
  }
}
</script>

<style src="./styles/App.css">
</style>