<script>
    import { createEventDispatcher } from 'svelte';
    import Cookies from 'universal-cookie';
    import { server, authtoken, username, email, phone, name } from '../store/stores.js';
    let apiBaseUrl=$server
    const dispatch = createEventDispatcher();
    export let editingPost;

    let profile=''
    let role=''
    
    let loading=false;


    async function onSubmit(event){
        event.preventDefault()
        if(name.trim() === '' || description.trim()===''){
            console.log('All data are not present')
            return
        }
        const newPost = {name , description}

        loading=true;
        let url, method;

        url=`${apiBaseUrl}/add/`;
        method='POST';


        const response = await fetch(url,{
            method: method,
            body:JSON.stringify({
                groupid:editingPost.id,
                username: profile,
                role: role
            }),
            credentials: 'include',
            headers: {
                "Content-type": "application/json",
                'Accept': 'application/json',
                'Authorization': 'Token ' + $authtoken
            }
        });

        const post = await response.json()
        loading = false;
        dispatch('postCreated',post)
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
        <div class="input-field">
            <label for="title">groupid</label>
            <input type="Text" disabled="disabled" bind:value={editingPost.name}/>
        </div>
        <div class="input-field">
            <label for="body">username/phone</label>
            <input type="Text" bind:value={profile}/>
        </div>
        <select class="custom-select" bind:value={role}>
            <option value="student">student</option>
            <option value="teacher">One</option>
        </select>
        <button type="submit" class="waves-effect waves-light btn">
        {editingPost.id ? 'Update' : 'Add'}
        </button>

    </form>
    {:else}
         <div class="progress">
            <div class="indeterminate" />
         </div>
{/if}