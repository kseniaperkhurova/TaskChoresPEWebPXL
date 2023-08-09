import { createStore } from "vuex"
import axios from "axios";

let url = "http://localhost:3000";
export default createStore({
    state: {
        user: null,
        tasks: [],
        error: "",
        users :[]
    },
    actions:{
        login: async function ({commit,state}, payload) { 
            try{
                const username = payload.username;
                const password = payload.password;
                commit("_reset");
                const axiosConfig = {withCredentials: "true"};
                const response = await axios.post(`${url}/user/login`, { username, password }, axiosConfig);
                commit("_updateUser", response.data.user);
            } catch(error){ 
                commit("_updateError", error.message);
            }
        },
        logout: async function ({commit,state}, payload) { 
            try{
                commit("_reset");
                const axiosConfig = {withCredentials: "true"};
                const response = await axios.post(`${url}/user/logout`,{}, axiosConfig);
            } catch(error){ 
                commit("_updateError", error.message);
            }
        },
        checkLogin: async function ({commit,state}) { 
            try{
                commit("_reset");
                const axiosConfig = {withCredentials: "true"};
                const response = await axios.post(`${url}/user/login/check`,{}, axiosConfig);
                commit("_updateUser", response.data.user);
            } catch(error){ 
            }
        },
        retrieveOwnTasks: async function ( {commit,state} ) { 
            try{
                commit("_updateError", "");
                const axiosConfig = {withCredentials: "true"};
                let response = await axios.get(`${url}/user/${state.user._id}/task`, axiosConfig);
                commit("_updateTasks", response.data);
            } catch(error){ 
                commit("_updateError", error.message);
            }
        },
        changeCompletedOfTask: async function ({commit,state}, payload) { 
            try{
                commit("_updateError", "");
                const index = payload.index;
                const completed = payload.completed;
                const taskId=state.tasks[index]._id;
                const axiosConfig = {withCredentials: "true"};
                const response = await axios.patch(`${url}/user/${state.user._id}/task/${taskId}`, { completed }, axiosConfig);
                commit("_updateTask", {index, completed});
            } catch(error){ 
                commit("_updateError", error.message);
            }
        },
        showAllUsersforAdmin: async function({commit, state}, payload){
            try{
                commit("_updateError", "");
                const axiosConfig = {withCredentials: "true"};
                let response = await axios.get(`${url}/user/users`, axiosConfig);
              
                commit("_getUsers", response.data);
                console.log(response.data)

            }catch(error){
                commit("_updateError", error.message);
            }
        },
        showAllTasksForAdmin: async function({commit, state}, payload){
            try{
                commit("_updateError", "");
                const axiosConfig = {withCredentials: "true"};
                let response = await axios.get(`${url}/user/tasks`, axiosConfig);
                commit("_getTasks", response.data);
                console.log(response.data)

            }catch(error){
                commit("_updateError", error.message);
            }
        }
        ,
        allowATaskToAnUser: async function({commit, state}, payload){
            try{
                console.log("ik ben in de task allow stap 1");
                commit("_updateError", "");
                console.log("ik ben in de task allow stap 2");
                const taskId = payload.taskId;
                console.log("ik ben in de task allow stap 3" + taskId);
                const userId = payload.userId;
                console.log("ik ben in de task allow stap 4" + userId);
                const axiosConfig = {withCredentials: "true"};
                let response = await axios.post(`${url}/user/allow`,{taskId, userId},  axiosConfig);
                console.log("ik ben in de task allow stap 5");
                commit("_allowTask", response.data.user);

            }catch(error){
                commit("_updateError", error.message);
            }
        }
    },
    mutations: {
        _reset(state){
            state.user=null;
            state.tasks=[];
            state.error="";
            state.users =[];
        },
        _updateUser(state, payload) {
            state.user = payload;
        },
        _updateError(state, payload) {
            state.error = payload;
        },
        _updateTasks(state, payload) {
            state.tasks=[];
            state.tasks = payload;
        },
        _updateTask(state, payload) {
            state.tasks[payload.index].completed = payload.completed;
        },
        _getUsers(state, payload){
            state.users =[];
            state.users = payload;
           

        },
        _getTasks(state, payload){
            state.tasks =[];
            state.tasks = payload;
           

        },
        _allowTask(state, payload){
            state.user = payload;
        }
    }
} );


