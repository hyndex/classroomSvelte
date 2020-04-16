<script>
    import Cookies from 'universal-cookie';
    import { server, authtoken, username, email, phone, name, selectedGroup} from '../store/stores.js';
    import { Link, Route } from 'svelte-routing';
    let apiBaseUrl=$server
    import { onMount } from 'svelte';
    import GroupFrom from '../components/GroupForm.svelte';
    import RoleFrom from '../components/RoleForm.svelte';
    let loading=false;
    let posts=[];
    let roles=[];
    let editingPost={
        name:'',
        description:'',
        id:null
    }
    let addingRole={
        username:'',
        role:'',
        groupid:null
    }
    let gotoGroupstatus=false;
    onMount( async () => {
        selectedGroup.set(false)
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
    editingPost=post;
}
function focusRole(role){
    addingRole=role;
}
function clearRoles(){
    console.log('clear')
    return roles = [];
}

async function getRoles(id) {
        await fetch(apiBaseUrl+'/add/?search='+id,{
            method: "GET",
            credentials: "include",
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json",
                'Authorization': 'Token ' + $authtoken
            },
        }).then(async data => {
            if (data.status < 300) {
                roles = await data.json();
                const cookies = new Cookies();
            }
            else{
                response= await data.json();
                console.log(response)
            }
        })
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

function deleteRole(id){
    if(confirm("Are you sure?")){
        fetch(`${apiBaseUrl}/add/${id}`,{
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
            roles=roles.filter(p => p.id !== id)
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

function addRole({detail: role}){
    if (roles.find(p => p.id === role.id)) {
      const index = roles.findIndex(p => p.id === role.id);
      let rolesUpdated = roles;
      rolesUpdated.splice(index, 1, role);
      roles = rolesUpdated;
    } else roles = [role, ...roles];
    addingRole={
        username:'',
        role:'',
        groupid:null
    }
}

function gotoGroup(id){
    selectedGroup.set(id);
    gotoGroup=true;
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
    {#if gotoGroupstatus === true}
         <Route path="/" component={Class} />
    {/if}
    {#if roles.length != 0}
        <button on:click={clearRoles} class="waves-effect waves-light btn">clear</button>
    {/if}
     <div class="row">
        <div class="col s3">
            <GroupFrom on:postCreated={addPost} editingPost={editingPost}/>
        </div>
        <div class="col s3">
            <RoleFrom on:postCreated={addRole} addingRole={addingRole}/>
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
                            <Link to='/class' on:click={()=>gotoGroup(post.id)}>Enter</Link>
                            <a href="#" class="delete-btn" on:click={() => deletePost(post.id)}>Delete</a>
                            <a href="#" on:click={() => getRoles(post.id)}>Roles</a>
                            <a href="#" on:click={() => focusRole(post)}>Add Roles</a>
                        </div>
                    </div>
                </div>
            {/each}
        {/if}
    </div>


        <div class="row">
        {#if roles.length === 0}
            <h1>No group selected ...</h1>
        {:else}
            {#each roles as role}
                <div class="col s6">
                    <div class="card">
                        <div class="card-content">
                            <p class="card-title">{role.profile.name}</p>
                            <p class="body">{role.profile.user.username}</p>
                            <p class="body">{role.role}</p>
                        </div>
                        <div class="card-action">
                            <a href="#" on:click={() => deleteRole(role.id)} class="delete-btn">Delete</a>
                        </div>
                    </div>
                </div>
            {/each}
        {/if}
    </div>

{/if}
