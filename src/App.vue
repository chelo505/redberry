<template>
<div class="app">
    <div class="nav-bar">
      <img class="nav-bar-image" src="./assets/Frame 1000006027.png">
      <div class="empasign-container">
        <button class="employee-create">თანამშრომლის შექმნა</button>
        <button class="assignment-create">+ შექმენი ახალი დავალება</button>
      </div>
      </div>
      <router-view></router-view>
</div>
</template>

<script>
export default {
  name: "App",
  data() {

  },
  methods: {

  }
}
</script>

<style>
* {
  padding: 0px;
  margin: 0px;
}

body {
  width: 1920px;
  height: 1080px;
  overflow-x: hidden;
}

.nav-bar {
  position: fixed;
  width: 1920px;
  height: 50px;
  justify-content: space-between;
  padding-top: 30px;
  padding-right: 120px;
  padding-bottom: 30px;
  padding-left: 120px;
  background: #ffffff;
  z-index: 1000;
}

.nav-bar-image {
  position: fixed;
  width: 210px;
  height: 38px;
  gap: 4px;
}

.empasign-container {
  position: fixed;
  top: 29px;
  width: 533px;
  height: 40px;
  gap: 40px;
  right: 50px
}

.employee-create {
  width: 225px;
  height: 39px;
  gap: 10px;
  border-radius: 5px;
  border-width: 1px;
  padding-top: 10px;
  padding-right: 20px;
  padding-bottom: 10px;
  padding-left: 20px;
  border: 1px solid hsl(265, 83%, 57%);
  font-family: 'FiraGO';
  font-weight: 400;
  font-size: 16px;
  letter-spacing: 0%;
  color: #212529;
  margin-right: 40px;
  line-height: 0;
  background: #FFFFFF;
  cursor: pointer;
  transition: background 0.3s;
}

.employee-create:hover {
  background: #e2d1ff;
}

.assignment-create {
  width: 268px;
  height: 40px;
  gap: 4px;
  border-radius: 5px;
  padding-top: 10px;
  padding-right: 20px;
  padding-bottom: 10px;
  padding-left: 20px;
  background: #8338EC;
  border: 0px;
  font-family: 'FiraGO';
  font-weight: 400;
  font-size: 16px;
  line-height: 0;
  letter-spacing: 0%;
  color: white;
  cursor: pointer;
  transition: background 0.3s;
}

.assignment-create:hover {
  background: #5c0fc7;
}
</style>

