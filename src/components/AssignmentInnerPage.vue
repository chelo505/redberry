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

<style scoped>
.header {
    position: relative;
    width: 715px;
    height: 239px;
    top: 140px;
    left: 121px;
    gap: 26px;
}

.task-priority {
    position: relative;
    width: 106;
    height: 32;
    gap: 4px;
    padding-top: 4px;
    padding-right: 5px;
    padding-bottom: 4px;
    padding-left: 5px;
    border-radius: 3px;
    border-width: 0.5px;
}

.task-department {
    position: relative;
    top: -12px;
    left: 5px;
    font-weight: 400;
    font-size: 12px;
    color: white;
    background: #FF66A8;
    line-height: 22px;
    width: 88px;
    height: 29px;
    padding-top: 5px;
    padding-right: 10px;
    padding-bottom: 5px;
    padding-left: 10px;
    border-radius: 15px;
}

.task-title {
    display: block;
    top: 5px;
    left: 0px;
    position: relative;
    width: 715px;
    height: 44px;
    font-family: 'Inter';
    font-weight: 600;
    font-size: 34px;
    line-height: 150%;
    letter-spacing: 0%;
    padding: 5px;
    line-clamp: unset;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.task-description {
    position: relative;
    width: 715px;
    height: 108px;
    font-weight: 400;
    font-size: 16px;
    left: 0px;
    top: 50px; 
    display: -webkit-box;
    line-height: 150%;
    letter-spacing: 0%;
    padding: 5px;
}

.task-details {
    display: grid;
    position: relative;
    width: 291px;
    height: 277px;
    top: 60px;
    margin-top: 50px;
    gap: 40px
}

.task-details-right {
    display: grid;
    position: relative;
    width: 283px;
    height: 277px;
    top: -267px;
    margin-top: 50px;
    left: 250px;
    gap: 40px
}

.task-details-header {
    padding: 5px;
    position: relative;
    left: 0;
    font-weight: 600;
    font-size: 24px;
    line-height: 100%;
    letter-spacing: 0%;
    color: #2A2A2A;
}

.task-status-icon {
    position: relative;
    left: 0px;
    top: -20px;
    padding: 5px;
    margin-top: 30px
}

.task-status {
    position: relative;
    height: 50px;
    left: 0px;
    top: 80px
}

.status-icons-container {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #FFFFFF;
  border: 1px solid #DEE2E6;
  border-top: none;
  border-radius: 0 0 4px 4px;
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.status-item {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
}

.status-item:hover {
  background-color: #f8f9fa;
}

.employee {
    position: relative;
    top: 50px
}

.task-employee-icon {
    position: relative;
    left: 0px;
    top: -10px;
    padding: 5px
}

.task-date-icon {
    position: relative;
    left: 0px;
    top: 5px;
    padding: 5px
}

.employee-avatar {
  position: relative;
  margin-left: 0px;
  top: 10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border-color: white;
  border-width: 1px;
}

.employee-name {
    width: 170px;
    display: block;
    position: relative;
    font-weight: 400;
    font-size: 15px;
    line-height: 150%;
    letter-spacing: 0%;
    top: -20px;
    left: 33px;
    text-align: left;
}

.employee-department {
    position: relative;
    top: -21px;
    left: 10px;
    font-weight: 300;
    font-size: 11px;
    line-height: 100%;
    letter-spacing: 0%;
    text-align: right;
    color: #979797;
}

.task-deadline {
    position: relative;
    top: 30px;
    font-weight: 400;
    font-size: 15px;
    line-height: 150%;
    letter-spacing: 0%;
}

.comments-box {
    position: relative;
    width: 741px;
    height: auto;
    left: 1059px;
    border-radius: 10px;
    border-width: 0.3px;
    background: #F8F3FEA6;
    border: 0.3px solid #DDD2FF;
    padding-bottom: 150px;
    overflow: visible;
}

.comment-area {
    position: relative;
    width: 651px;
    height: 135px;
    top: 40px;
    left: 25px;
    border-radius: 10px;
    border-width: 0.3px;
    padding: 20px;
    gap: 30px;
    border: 0.3px solid #ADB5BD;
    resize: none;
}

.submit-button-container {
    position: absolute;
    width: 691px;
    height: 80px;
    top: 137px;
    left: 26px;
    background-color: white;
    border-radius: 10px;
    border-bottom: 0.3px solid #ADB5BD;
    z-index: 10;
}

.submit-comment {
    position: absolute;
    top: 30px;
    right: 20px;
    width: 155;
    height: 35;
    border-radius: 20px;
    padding-top: 8px;
    padding-right: 20px;
    padding-bottom: 8px;
    padding-left: 20px;
    background: #8338EC;
    border: 0;
    color: white;
    z-index: 11;
    cursor: pointer;
}

.comments {
    position: relative;
    display: grid;
    list-style: none;
    top: 140px;
    margin-bottom: 30px;
    padding-left: 0;
    width: 100%;
}

.comment {
    position: relative;
    left: 26px;
    width: calc(100% - 52px);
    margin-bottom: 20px;
    overflow-wrap: break-word;
}

.comments-header {
    position: relative;
    font-weight: 600;
    font-size: 20px;
    line-height: 100%;
    letter-spacing: 0%;
    left: 26px;
    top: 100px
}

.comments-number {
    top: 100px;
    left: 36px;
    position: relative;
    width: 32px;
    height: 22px;
    border-radius: 30px;
    padding: 4px;
    padding-right: 8px;
    padding-left: 8px;
    text-align: center;
    background: #8338EC;
    color: white;
    line-height: 23px;
}

.commenter-avatar {
    position: relative;
    margin-left: 0px;
    top: 10px;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border-color: white;
    border-width: 1px;
    margin-right: 10px;
}

.commenter-name {
    position: relative;
    top: -10px;
    font-weight: 500;
    font-size: 18px;
    line-height: 100%;
    letter-spacing: 0%;
}

.comment-text {
    position: relative;
    font-weight: 350;
    font-size: 16px;
    line-height: 150%;
    letter-spacing: 0%;
    color: #343A40;
    display: block; 
    word-wrap: break-word; 
    max-width: 600px;
    margin-top: 8px;
    left: 50px
}

.reply-button {
    position: relative;
    width: 67px;
    height: 26px;
    gap: 6px;
    border-bottom-width: 1px;
    padding-top: 6px;
    padding-bottom: 6px;
    left: 50px;
    cursor: pointer;
    margin-bottom: 20px;
}

.reply-area {
    position: relative;
    top: 22px;
    left: -15px;
    width: 350px;
    height: 40px;
    resize: none;
    border-radius: 10px;
    border-width: 0.3px;
    padding: 5px;
    border: 0.3px solid #ADB5BD;
    margin-bottom: 50px;
}

.submit-reply {
    position: relative;
    top: 0px;
    right: 105px;
    width: 90px;
    height: 25px;
    border-radius: 20px;
    padding-top: 8px;
    padding-right: 20px;
    padding-bottom: 8px;
    padding-left: 20px;
    background: #8338EC;
    border: 0;
    color: white;
    z-index: 11;
    cursor: pointer;
    line-height: 0px; 
}

.cancel-reply {
    position: relative;
    top: 0px;
    right: 300px;
    width: 95px;
    height: 25px;
    border-radius: 20px;
    padding-top: 8px;
    padding-right: 20px;
    padding-bottom: 8px;
    padding-left: 20px;
    background: #b4b4b4;
    border: 0;
    color: white;
    z-index: 11;
    cursor: pointer;
    line-height: 0px; 
}

.reply {
    position: relative;
    left: 50px;
    top: -10px
}

.reply-avatar {
    position: relative;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border-color: white;
    border-width: 1px;
    margin-right: 10px;
}

.reply-text {
    position: relative;
    top: -20px;
    font-weight: 350;
    font-size: 16px;
    line-height: 150%;
    letter-spacing: 0%;
    color: #343A40;
    display: block; 
    word-wrap: break-word; 
    max-width: 450px;
    margin-top: 8px;
    left: 50px
}

.reply-author {
    position: relative;
    top: -20px;
    font-weight: 500;
    font-size: 18px;
    line-height: 100%;
    letter-spacing: 0%;
}
</style>