<script>
    import { createEventDispatcher } from 'svelte';
    import Cookies from 'universal-cookie';
    import { server, authtoken, username, email, phone, name,selectedGroup } from '../store/stores.js';
    let apiBaseUrl=$server
    const dispatch = createEventDispatcher();
    export let editingNote;

    $: title=editingNote.title;
    $: description=editingNote.description;
    
    let loading=false;


    async function onSubmit(event){
        console.log('profile',profile)
        console.log('role',userrole)
        event.preventDefault()
        if(title.trim() === '' || descrtion.trim() === ''){
            console.log('All data are not present')
            return
        }
        loading=true;
        let url, method;
        if (editingNote.id) {
            url = `${apiBaseUrl}/class/notes/${editingNote.id}/`;
            method = "PUT";
        } 
        else {
            url = `${apiBaseUrl}/class/notes/`;
            method = "POST";
        }


        const response = await fetch(url,{
            method: method,
            body:JSON.stringify({
                groupid:$selectedGroup,
                title:editingNote.title,
                description:editingNote.description,
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
        userrole=''
        profile=''
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
     <form on:submit={onSubmit}>
            <input type="Text" bind:value={editingNote.title} placeholder="Title"/>
            <input type="Text" bind:value={editingNote.description} placeholder="Description"/>
            <button type="submit">Add ROle</button>

    </form>
    {:else}
         <div class="progress">
            <div class="indeterminate" />
         </div>
{/if}










  
  