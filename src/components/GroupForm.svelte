<script>
    import { createEventDispatcher } from 'svelte';
    import Cookies from 'universal-cookie';
    import { server, authtoken, username, email, phone, name } from '../store/stores.js';
    let apiBaseUrl=$server
    const dispatch = createEventDispatcher();

    export let editingPost;
    $: title=editingPost.name;
    $: body=editingPost.description;

    let loading=false;

        async function onSubmit(event){
        event.preventDefault()
        if(title.trim() === '' || body.trim()===''){
            console.log('All data are not present')
            return
        }
        const newPost = {title , body}

        loading=true;
        let url, method;

        if(editingPost.id){
            url=`${apiBaseUrl}/group/${editingPost.id}/`
            method='PUT'
        }
        else{
            url=`${apiBaseUrl}/group/`
            method='POST'
        }
        console.log(JSON.stringify({
                name: title,
                description: body
            }))
        const response = await fetch(url,{
            method: method,
            body:JSON.stringify({
                id:editingPost.id,
                name: title,
                description: body
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
            <label for="title">Title</label>
            <input type="Text" bind:value={editingPost.name}/>
        </div>
        <div class="input-field">
            <label for="body">Body</label>
            <input type="Text" bind:value={editingPost.description}/>
        </div>
        <button type="submit" class="waves-effect waves-light btn">
        {editingPost.id ? 'Update' : 'Add'}
        </button>

    </form>
    {:else}
         <div class="progress">
            <div class="indeterminate" />
         </div>
{/if}