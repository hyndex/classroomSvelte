<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    export let editingPost;
    $: title=editingPost.title;
    $: body=editingPost.body;
    let loading=false;

    const apiBaseUrl='https://ndb99xkpdk.execute-api.eu-west-2.amazonaws.com/dev';
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
            url=`${apiBaseUrl}/post/${editingPost.id}`
            method='PUT'
        }
        else{
            url=`${apiBaseUrl}/post`
            method='POST'
        }

        const response = await fetch(url,{
            method: method,
            body:JSON.stringify(newPost)

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
            <input type="Text" bind:value={editingPost.title}/>
        </div>
        <div class="input-field">
            <label for="body">Body</label>
            <input type="Text" bind:value={editingPost.body}/>
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