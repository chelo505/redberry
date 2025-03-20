<template>
  <div v-if="showModal" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h2>თანამშრომლის დამატება</h2>
      <button class="close-button" @click="closeModal">
        <span>&times;</span>
      </button>
      <div class="form-container">
        <div class="names-container">
    <div class="field-group">
      <label for="firstName">სახელი*</label>
      <input 
        id="firstName" 
        type="text" 
        v-model="firstName"
        :class="{ 'error-border': errors.firstName }"
      />
      <div class="requirements">
        <div class="requirement" :class="{ 'valid': firstName.length >= 2 }">
          <span class="check-icon">✔️</span> მინიმუმ 2 სიმბოლო
        </div>
        <div class="requirement" :class="{ 'valid': firstName.length <= 255 }">
          <span class="check-icon">✔️</span> მაქსიმუმ 255 სიმბოლო
        </div>
      </div>
    </div>
    
    <div class="field-group">
      <label for="lastName">გვარი*</label>
      <input 
        id="lastName" 
        type="text" 
        v-model="lastName"
        :class="{ 'error-border': errors.lastName }"
      />
      <div class="requirements">
        <div class="requirement" :class="{ 'valid': lastName.length >= 2 }">
          <span class="check-icon">✔️</span> მინიმუმ 2 სიმბოლო
        </div>
        <div class="requirement" :class="{ 'valid': lastName.length <= 255 }">
          <span class="check-icon">✔️</span> მაქსიმუმ 255 სიმბოლო
        </div>
      </div>
    </div>
  </div>
        
        <div class="field-group avatar-group">
          <label>ავატარი*</label>
          <div class="avatar-upload-container" :class="{ 'error-border': errors.avatar }">
            <div v-if="avatarPreview" class="avatar-preview">
              <img :src="avatarPreview" alt="Avatar Preview" />
              <button class="remove-avatar" @click="removeAvatar">
                <img src="@/assets/trash-2.svg" alt="Remove" />
              </button>
            </div>
            <div v-else class="upload-placeholder" @click="triggerFileInput">
              <span class="upload-text">ატვირთეთ ფოტო</span>
              <input 
                ref="fileInput"
                type="file" 
                accept="image/*" 
                style="display: none;"
                @change="onFileChange"
              />
            </div>
          </div>
        </div>
        
        <div class="field-group">
          <label for="department">დეპარტამენტი*</label>
          <div class="select-container" >
            <select id="department" v-model="department" :class="{ 'error-border': errors.department }">
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
            <div class="select-arrow">
              <i class="arrow-down"></i>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="cancel-button" @click="closeModal">გაუქმება</button>
        <button class="submit-button" @click="submitForm">დაამატე თანამშრომელი</button>
      </div>
    </div>
  </div>
</template>
  
<script>
import axios from 'axios'

export default {
  name: "EmployeeModal",
  props: {
    showModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      firstName: "",
      lastName: "",
      avatar: null,
      avatarPreview: null,
      department: null,
      departments: [],
      errors: {
        firstName: false,
        lastName: false,
        avatar: false,
        department: false
      },
      token: "9e75ea39-cb24-4933-bcbc-2640b97d99f4"
    }
  },
  mounted() {
    this.fetchDepartments()
    document.addEventListener('keydown', this.handleEscKey)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleEscKey)
  },
  methods: {
    async fetchDepartments() {
      const response = await axios("https://momentum.redberryinternship.ge/api/departments")
      .catch(error => console.log(error))
      this.departments = response.data
    },
    handleEscKey(event) {
      if (event.key === 'Escape' && this.showModal) {
        this.closeModal()
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    onFileChange(event) {
      const file = event.target.files[0]
      if (!file) return
  
      if (!file.type.includes('image/')) {
        alert('გთხოვთ აირჩიოთ სურათის ფაილი')
        return
      }
      
      if (file.size > 614400) {
        alert('სურათის ზომა არ უნდა აღემატებოდეს 600KB-ს')
        return
      }
      
      this.avatar = file
      this.createPreview(file)
      this.errors.avatar = false
    },
    createPreview(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.avatarPreview = e.target.result
      }
      reader.readAsDataURL(file)
    },
    removeAvatar() {
      this.avatar = null
      this.avatarPreview = null
    },
    validateForm() {
      let isValid = true
      
      const nameRegex = /^[a-zA-Zა-ჰ]+$/
      if (!this.firstName || this.firstName.length < 2 || this.firstName.length > 255 || !nameRegex.test(this.firstName)) {
        this.errors.firstName = true
        isValid = false
      } else {
        this.errors.firstName = false
      }
      
      if (!this.lastName || this.lastName.length < 2 || this.lastName.length > 255 || !nameRegex.test(this.lastName)) {
        this.errors.lastName = true
        isValid = false
      } else {
        this.errors.lastName = false
      }
      
      if (!this.avatar) {
        this.errors.avatar = true
        isValid = false
      } else {
        this.errors.avatar = false
      }

      if (!this.department) {
        this.errors.department = true
        isValid = false
      } else {
        this.errors.department = false
      }
      
      return isValid
    },
    submitForm() {
      if (this.validateForm()) {
        const formData = new FormData()
        formData.append('name', this.firstName)
        formData.append('surname', this.lastName)
        formData.append('avatar', this.avatar)
        formData.append('department_id', this.department)
        
        axios.post("https://momentum.redberryinternship.ge/api/employees/", formData, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'multipart/form-data'
          }
        }).catch(error => console.log(error))
        
        this.$emit('employee-created', formData)
        
        this.resetForm()
        this.closeModal()
      }
    },
    resetForm() {
      this.firstName = ""
      this.lastName = ""
      this.avatar = null
      this.avatarPreview = null
      this.department = ""
      Object.keys(this.errors).forEach(key => {
        this.errors[key] = false
      })
    },
    closeModal() {
      this.resetForm()
      this.$emit('close')
    }
  }
}
</script>

<style scoped src="F:\vscodes\redberry\src\styles\EmployeeModal.css">
</style>