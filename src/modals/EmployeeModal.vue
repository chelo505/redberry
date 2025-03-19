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

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(122, 122, 122, 0.5);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  width: 913px;
  height: 766px;
  border-radius: 10px;
  padding-top: 40px;
  padding-right: 50px;
  padding-bottom: 60px;
  padding-left: 50px;
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

h2 {
  top: 90px;
  position: relative;
  font-size: 24px;
  font-weight: 500;
  font-size: 32px;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: center;
  z-index: 100;
}

.close-button {
  top: 20px;
  position: absolute;
  right: 20px;
  background-color: #DEE2E6;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.close-button span {
  text-align: center;
  line-height: 0;
  padding-bottom: 2px;
}

.close-button:hover {
  background-color: #cacaca;
}

.form-container {
  width: 913px;
  height: 720px;
  top: 0;
  left: 0;
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background-color: white;
  border: 0
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.names-container {
  margin-top: 130px;
  display: flex;
  flex-direction: row;
  gap: 16px;
  width: 100%;
}

label {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

input, select {
  height: 44px;
  padding: 0 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  outline: none;
}

input:focus, select:focus {
  border-color: #8338EC;
}

.error-border {
  border-color: #ff4d4f !important;
}

.requirements {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 4px;
}

.requirement {
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
}

.check-icon {
  margin-right: 4px;
  opacity: 0.5;
}

.valid .check-icon {
  opacity: 1;
  color: green;
}

.select-container {
  width: 384px;
  height: 42px;
  position: relative;
  display: flex;
  align-items: center;
}

select {
  appearance: none;
  width: 100%;
  background-color: white;
  cursor: pointer;
  padding-right: 40px;
}

.select-arrow {
  position: absolute;
  right: 16px;
  pointer-events: none;
}

.arrow-down {
  border: solid #333;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(45deg);
}

.avatar-upload-container {
  width: 100%;
  height: 100px;
  border: 1px dashed #ccc;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.avatar-preview {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.avatar-preview img {
  max-width: 80px;
  max-height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.remove-avatar {
  position: absolute;
  right: 8px;
  top: 8px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.upload-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #8338EC;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 30px;
}

.cancel-button {
  position: relative;
  bottom: 120px;
  padding: 10px 20px;
  width: 102px;
  height: 42px;
  border: 1px solid #8338EC;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

.submit-button {
  position: relative;
  bottom: 120px;
  width: 263px;
  height: 42px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #8338EC;
  color: white;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: #6a2cc5;
}

.cancel-button:hover {
  background-color: #f1f1f1;
}
</style>