<template>
<div>
    <div>
        
        <div v-if="$store.state.user">
            <div v-if="$store.state.user.roles.includes('admin')">
                <h1>Admin</h1>
                <pre>{{$store.state.user}}</pre>
                <button @click="getAllUsers">Show all users</button>
                 <div v-if="$store.state.users.length">
                    <hr>
                    <div v-for="user,index in $store.state.users">
                        <Admin v-bind:user="user" v-bind:index="index"></Admin> 
                    </div>
                </div>
                <hr>
            
                <button @click="getAllTasks">Show all free tasks</button>
                 <div v-if="$store.state.tasks.length">
                    <hr>
                    <div v-for="task,index in $store.state.tasks">
                        <Task v-bind:task="task" v-bind:index="index"></Task>
                    </div>
                </div>
            </div>
            
            <div v-else-if="$store.state.user.roles.includes('user')">
                <h1>User: {{$store.state.user.username}}</h1>
                <button @click="retrieveOwnTasks">Retrieve my tasks</button>
                <div v-if="$store.state.tasks.length">
                    <hr>
                    <div  v-for="task,index in $store.state.tasks">
                        <UpdatableTask v-bind:task="task" v-bind:index="index"></UpdatableTask> 
                    </div>
                </div>
            </div>
        <div>
            <hr>
            <button @click="logout">Log out</button>
        </div>
        </div>
        <div v-else>
                username:<br> 
                <input type="text" v-model="user.username"><br>
                password:<br>
                <input type="password" v-model="user.password"><br><br>
                <button @click="login">Login</button>
            </div>
     </div>
    <div v-if="$store.state.error">
            {{$store.state.error}}
    </div>
  
</div>
</template>
<script>
import UpdatableTask from "./UpdatableTask.vue";
import Admin from "./Admin.vue";
import Task from "./Task.vue";

export default {
    name: "User",
    components: {
        UpdatableTask,
        Admin,
        Task,
     
    },
    data() {
      return {
            user: {username:"", password:""}
        }
    },
    methods: {
        login: function(){    
            this.$store.dispatch("login", {username:this.user.username, password: this.user.password});
        },
        logout: function(){
            this.$store.dispatch("logout");
        },

        retrieveOwnTasks: function(){    
            this.$store.dispatch("retrieveOwnTasks");
        },
        getAllUsers: function(){
            this.$store.dispatch("showAllUsersforAdmin");
        },
        getAllTasks: function(){
            this.$store.dispatch("showAllTasksForAdmin");
        }

    },
    beforeMount(){
        this.$store.dispatch("checkLogin");
    }
}
</script>
