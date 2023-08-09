<template>
<div>
    <div>
        {{task.todo}}
        <input @change="update" type="checkbox" id="completed" value="completed" v-model="completed">
     </div>
</div>
</template>
<script>
export default {
    name: "UpdatableTask",
    props: [ "index", "task" ],
    data() {
      return {
            completed: this.task.completed
        }
    },
    methods: {
        update: function(){
            this.$store.dispatch("changeCompletedOfTask", {index:this.index, completed: this.completed});
        }
    }
}
</script>

