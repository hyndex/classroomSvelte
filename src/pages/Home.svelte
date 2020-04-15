<script>
    import { onMount } from 'svelte';
    import PostFrom from '../components/PostForm.svelte';
    const apiBaseUrl='https://ndb99xkpdk.execute-api.eu-west-2.amazonaws.com/dev';
    let posts=[];
    let loading=false;
    let editingPost={
        body:'',
        title:'',
        id:null
    }
    let postLimit = 10;

    onMount( async () => {
        const res = await fetch(apiBaseUrl+'/posts');
        posts= await res.json()
    })

function editPost(post){
    editingPost=post
}

function deletePost(id){
    if(confirm("Are you sure?")){
        fetch(`${apiBaseUrl}/post/${id}`,{
            method:'DELETE',
        }).then(res =>{
            return res.json()
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
        body:'',
        title:'',
        id:null
    }
}

function setLimit() {
    fetch(`${apiBaseUrl}/posts/${postLimit}`)
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

<div class="row">
    <div class="col s6">
        <PostFrom on:postCreated={addPost} editingPost={editingPost}/>
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
                        <p class="card-title">{post.title}</p>
                        <p class="timestamp">{post.createdAt}</p>
                        <p class="body">{post.body}</p>
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
