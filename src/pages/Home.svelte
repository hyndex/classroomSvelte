<script>
    import Cookies from 'universal-cookie';
    import { server, authtoken, username, email, phone, name } from '../store/stores.js';
    let apiBaseUrl=$server
    import { onMount } from 'svelte';
    import GroupFrom from '../components/GroupForm.svelte';
    let loading=false;
    let posts=[];
    let editingPost={
        name:'',
        description:'',
        id:null
    }
    let postLimit = 10;

    onMount( async () => {
        // authtoken.set(new Cookies.get('token'));
        const res = await fetch(apiBaseUrl+'/group/',{
            method: 'GET',
            credentials: 'include',
            headers: {
                "Content-type": "application/json",
                'Accept': 'application/json',
                'Authorization': 'Token ' + $authtoken
            }
        });
        posts= await res.json()
    })

function editPost(post){
    editingPost=post
}

function deletePost(id){
    if(confirm("Are you sure?")){
        fetch(`${apiBaseUrl}/group/${id}`,{
            method:'DELETE',
            credentials: 'include',
            headers: {
                "Content-type": "application/json",
                'Accept': 'application/json',
                'Authorization': 'Token ' + $authtoken
            }
        }).then(async data => {
            if (data.status < 300) {
                console.log('success')
            }
        }).then(()=>{
            posts=posts.filter(p => p.id !== id)
        });
    }
    
}

function addPost({detail: post}){
    if (posts.find(p => p.id === post.id)) {
      const index = posts.findIndex(p => p.id === post.id);
      let postsUpdated = posts;
      postsUpdated.splice(index, 1, post);
      posts = postsUpdated;
    } else posts = [post, ...posts];
    editingPost={
        name:'',
        description:'',
        id:null
    }
}

function setLimit() {
    fetch(`${apiBaseUrl}/group/${postLimit}`)
      .then(res => {
        return res.json();
      })
      .then(postsData => {
        posts = postsData;
      });
  }
</script>

<style>
    .delete-btn{
        color:red !important
    }

    .card .card-content .card-title{
        margin-bottom: 0;
    }
    .card .card-content p.timestamp{
        color: #999;
        margin-bottom: 10px;
    }
</style>

{#if $authtoken != false}
     <div class="row">
        <div class="col s6">
            <GroupFrom on:postCreated={addPost} editingPost={editingPost}/>
        </div>
        <div class="col s3" style="margin:50px">
            <p>Limit number of post </p>
            <input type="number" bind:value={postLimit}/>
            <button on:click={setLimit} class="waves-effect waves-light btn">Set</button>
        </div>
    </div>


    <div class="row">
        {#if posts.length === 0}
            <h1>loading posts ...</h1>
        {:else}
            {#each posts as post}
                <div class="col s6">
                    <div class="card">
                        <div class="card-content">
                            <p class="card-title">{post.name}</p>
                            <p class="timestamp">{post.date_updated}</p>
                            <p class="body">{post.description}</p>
                        </div>
                        <div class="card-action">
                            <a href="#" on:click={() => editPost(post)}>Edit</a>
                            <a href="#" class="delete-btn" on:click={() => deletePost(post.id)}>Delete</a>
                        </div>
                    </div>
                </div>
            {/each}
        {/if}
    </div>

{/if}
