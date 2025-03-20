<template>
    <div class="app">
        <div class="header" v-if="taskData">
            <img v-if="taskData.priority.id == 1" :src="require('@/assets/low.png')" class="task-priority">
            <img v-if="taskData.priority.id == 2" :src="require('@/assets/medium.png')" class="task-priority">
            <img v-if="taskData.priority.id == 3" :src="require('@/assets/high.png')" class="task-priority">
            <span class="task-department">{{ taskData.department.name.split(' ')[0] }}</span>
            <span class="task-title">{{ taskData.name }}</span>
            <span class="task-description">{{ taskData.description }}</span>
            <div class="task-details" v-if="taskData">
                <span class="task-details-header">დავალების დეტალები</span>
                <img :src="require('@/assets/status.png')" class="task-status-icon">
                <img :src="require('@/assets/employee.png')" class="task-employee-icon">
                <img :src="require('@/assets/duedate.png')" class="task-date-icon">
            </div>
            <div class="task-details-right">
                <div class="task-status">
                    <div class="priority-wrapper">
                        <div class="custom-select" @click="openStatuses = !openStatuses">
                        <span class="status-default">{{ defaultStatus }}</span>
                        <img class="dropdown-arrow" :src="require('@/assets/IconBlack.svg')">
                        </div>
                        <div v-show="openStatuses" class="status-icons-container">
                        <div 
                            v-for="status in statuses" 
                            :key="status.id" 
                            class="status-item"
                            @click="selectStatus(status)"
                        >
                            <span>{{ status.name }}</span>
                        </div>
                        </div>
                    </div>
                </div>
                <div class="employee">
                    <img class="employee-avatar" :src="taskData.employee.avatar">
                    <span class="employee-department">{{ taskData.employee.department.name }}</span>
                    <span class="employee-name">{{ taskData.employee.name }} {{ taskData.employee.surname }}</span>
                </div>
                <span class="task-deadline">{{ convertDateFormat(taskData.due_date.split('T')[0]) }}</span>
            </div>
        </div>
        <div class="comments-box" v-if="comments">
            <textarea class="comment-area" placeholder="დაწერე კომენტარი" maxlength="255" v-model="newCommentText"></textarea>
            <div class="submit-button-container">
                <button @click="createComment" class="submit-comment">დააკომენტარე</button>
            </div>
            <span class="comments-header">კომენტარები</span>
            <span class="comments-number">{{ numberOfComments }}</span>
            <ul class="comments">  
                <li v-for="comment in comments" v-bind:key="comment.id" class="comment">
                    <img :src="comment.author_avatar" class="commenter-avatar">
                    <span class="commenter-name">{{ comment.author_nickname }}</span>
                    <span class="comment-text">{{ comment.text }}</span>
                    <img @click="replying(comment)" :src="require('@/assets/reply.png')" class="reply-button">
                    <textarea v-if="comment.replying" maxlength="255" v-model="replyText" class="reply-area"></textarea>
                    <button @click="sendReply(comment)" v-if="comment.replying" class="submit-reply">პასუხი</button>
                    <button @click="cancelReply(comment)" v-if="comment.replying" class="cancel-reply">გაუქმება</button>
                    <div v-if="comment.sub_comments">
                        <li v-for="subcom in comment.sub_comments" v-bind:key="subcom.id" class="reply">
                            <img :src="subcom.author_avatar" class="reply-avatar">
                            <span class="reply-author">{{ subcom.author_nickname }}</span>
                            <span class="reply-text"> {{ subcom.text }}</span>
                        </li>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            task: this.$route.query.task,
            token: "9e75ea39-cb24-4933-bcbc-2640b97d99f4",
            taskData: null,
            statuses: [],
            defaultStatus: null,
            openStatuses: false,
            selectedStatus: null,
            newCommentText: '',
            replyText: '',
            comments: [],
            numberOfComments: null
        }
    },
    created() {
        this.fetchStatusesData()
        this.fetchTaskData()
        this.fetchCommentsData()
        this.fetchAllTaskData()
        document.addEventListener('click', this.handleClickOutside)
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside)
    },  
    methods: {
    async fetchAllTaskData() {
      const response = await axios("https://momentum.redberryinternship.ge/api/tasks/", {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).catch(err => console.log(err))
      let tasks = response.data
      let thisTask
      for (let task of tasks) {
        if (task.id == this.task) thisTask = task
      }
      this.numberOfComments = thisTask.total_comments
    },
    async fetchTaskData() {
      const response = await axios("https://momentum.redberryinternship.ge/api/tasks/"+this.task, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).catch(err => console.log(err))
      this.taskData = response.data
      this.defaultStatus = response.data.status.name
    },
    async fetchStatusesData() {
      const response = await axios("https://momentum.redberryinternship.ge/api/statuses")
      .catch(error => console.log(error))
      this.statuses = response.data
    },
    async fetchCommentsData() {
      const response = await axios("https://momentum.redberryinternship.ge/api/tasks/"+this.task+"/comments", {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).catch(err => console.log(err))
      this.comments = response.data.sort((a, b) => a.id < b.id)
      for (let comment of this.comments) {
        comment.replying = false
      }
    },
    handleClickOutside(event) {
        const dropdown = document.querySelector('.priority-wrapper')
        if (dropdown && !dropdown.contains(event.target)) {
        this.openStatuses = false
      }
    },
    selectStatus(status) {
        axios.put("https://momentum.redberryinternship.ge/api/tasks/"+this.taskData.id, {
            status_id: status.id
        },
        {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        }
    ).catch(err => console.log(err))
        this.defaultStatus = status.name
        this.selectedStatus = status
        this.openStatuses = false
    },
    convertDateFormat(inputDate) {
        const date = new Date(inputDate)
        const day = date.getDate() + 1
        const month = date.getMonth() + 1
        const year = date.getFullYear()
        const weekday = date.getDay()
        const weekdays = ['ორშ', 'სამ', 'ოთხ', 'ხუთ', 'შაბ', 'კვი']
        return `${weekdays[weekday]} - ${day}/${month}/${year}`
    },
    async createComment() {
        let newComment = {
            id: this.numberOfComments,
            text: this.newCommentText,
            task_id: this.taskData.id,
            parent_id: null
        }
        if (!this.newCommentText.trim() == '') {
        axios.post("https://momentum.redberryinternship.ge/api/tasks/"+this.task+"/comments", newComment, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        }).catch(err => console.log(err))
        } else alert('ცარიელ კომენტარს ვერ დაამატებთ')
        this.newCommentText = ''
        await this.fetchTaskData()
        await this.fetchCommentsData()
        await this.fetchAllTaskData() 
    },
    cancelReply(comment) {
        this.replyText = ''
        comment.replying = false
    },
    async sendReply(comment) {
        let reply = {
            id: comment.sub_comments.maxlength,
            text: this.replyText,
            task_id: this.task,
            parent_id: comment.id
        }
        if (!this.replyText.trim() == '') {
        axios.post("https://momentum.redberryinternship.ge/api/tasks/"+this.task+"/comments", reply, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        }).catch(err => console.log(err))
        this.replyText = ''
        comment.replying = false
        await this.fetchTaskData()
        await this.fetchCommentsData()
        await this.fetchAllTaskData() 
        } else alert('ცარიელ პასუხს ვერ დაამატებთ')
    },
    replying(comment) {
        comment.replying = !comment.replying
        setTimeout(() => {
            const area = document.getElementsByClassName('reply-area')[0]
            area.focus()
            }, 5) 
    }         
    }
}
</script>

<style scoped src="F:\vscodes\redberry\src\styles\AssignmentInnerPage.css">
</style>