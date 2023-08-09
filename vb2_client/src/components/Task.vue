<template>
<div>
    <div>
    {{task.todo}} 
     </div>
   <div>
    <div>
      <br />
      <select v-model="selected">
        <option v-for="option in $store.state.users" v-bind:value="{ id: option._id, name : option.username}">{{option.username}}</option>
      </select>

  </div>

  <br />
  <button @click="allowThisTaskToThisUser">Allow this task to this user</button> 
  <br />
  <br />
  <hr> 
</div>
</div>
</template>
<script>

export default {
    name: "Task",
    components: {
       
   
    },
    props: [ "index", "task" ],
    data() {
      return {
            selected: '' 
        }
    },
    methods:{
        allowThisTaskToThisUser: function(){
            return this.$store.dispatch("allowATaskToAnUser", {taskId: this.task._id, userId: this.selected.id});
        },
    },
    beforeMount(){
      this.$store.dispatch("showAllUsersforAdmin");
    },
}
</script>