<script>
    import { createEventDispatcher } from 'svelte';
    import Cookies from 'universal-cookie';
    import { server, authtoken, username, email, phone, name, userid, selectedGroup, groupStore, assignmentStore, noteStore, roleStore} from '../store/stores.js';
    let apiBaseUrl=$server
    const dispatch = createEventDispatcher();
    export let editingAssignment;

    $: title=editingAssignment.title;
    $: description=editingAssignment.description;
    $: deadline=editingAssignment.deadline;
    
    let loading=false;


    async function onSubmitAssignment(event){
        event.preventDefault()
        console.log('title',title)
        console.log('description',description)
        console.log('deadline',deadline)
        if(title.trim() === '' || description.trim() === ''|| deadline.trim() === ''){
            console.log('All data are not present')
            return
        }
        loading=true;
        let url, method;
        if (editingAssignment.id) {
            url = `${apiBaseUrl}/class/assignment/${editingAssignment.id}/`;
            method = "PUT";
        } 
        else {
            url = `${apiBaseUrl}/class/assignment/`;
            method = "POST";
        }


        await fetch(url,{
            method: method,
            body:JSON.stringify({
                groupid:$selectedGroup,
                title:editingAssignment.title,
                description:editingAssignment.description,
                deadline:editingAssignment.deadline,
            }),
            credentials: 'include',
            headers: {
                "Content-type": "application/json",
                'Accept': 'application/json',
                'Authorization': 'Token ' + $authtoken
            }
        }).then(async data =>{
            if (data.status < 300) {
                let assignment = await data.json();
                if ($assignmentStore.find(p => p.id === assignment.id)) {
                    const index = $assignmentStore.findIndex(p => p.id === assignment.id);
                    let assignmentsUpdated = $assignmentStore;
                    assignmentsUpdated.splice(index, 1, assignment);
                    assignmentStore.set(assignmentsUpdated);
                } else assignmentStore.set([assignment, ...$assignmentStore]);
                
            }
            else{
                let assignment = await data.json();
            }
        })
        loading = false;
    }
</script>
<style>
    form {
        margin: 50px;
    }

    .progress{
        margin: 100px, 0;
    }
</style>
{console.log(editingAssignment)}
{#if loading === false}
     <form on:submit={onSubmitAssignment}>
            <input type="Text" bind:value={editingAssignment.title} placeholder="Title"/>
            <input type="Text" bind:value={editingAssignment.description} placeholder="Description"/>
            <input type="Text" bind:value={editingAssignment.deadline} placeholder="Deadline yyyymmdd"/>
            <button type="submit"><button type="submit">{editingAssignment.id ? 'Update Assignment' : 'Add Assignment'}</button></button>

    </form>
    {:else}
         <div class="progress">
            <div class="indeterminate" />
         </div>
{/if}










  
  