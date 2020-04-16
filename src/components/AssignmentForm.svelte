<script>
    import { createEventDispatcher } from 'svelte';
    import Cookies from 'universal-cookie';
    import { server, authtoken, username, email, phone, name,selectedGroup } from '../store/stores.js';
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


        const response = await fetch(url,{
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
        });

        const role = await response.json()
        loading = false;
        dispatch('roleCreated',removeEventListener)
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

{#if loading === false}
     <form on:submit={onSubmitAssignment}>
            <input type="Text" bind:value={editingAssignment.title} placeholder="Title"/>
            <input type="Text" bind:value={editingAssignment.description} placeholder="Description"/>
            <input type="Text" bind:value={editingAssignment.deadline} placeholder="Deadline yyyymmdd"/>
            <button type="submit">Add Assignment</button>

    </form>
    {:else}
         <div class="progress">
            <div class="indeterminate" />
         </div>
{/if}










  
  