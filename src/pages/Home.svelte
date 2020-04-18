<script>
  import Cookies from "universal-cookie";
  import {
    server,
    authtoken,
    validate,
    username,
    userid,
    name,
    email,
    phone,
    status,
    isGroupOwner,
    selectedGroup,
    selectedAssignment,
    selectedNote,
    selectedSubmit,
    groupStore,
    assignmentStore,
    noteStore,
    roleStore,
    submitStore,
    loadingstore
  } from "../store/stores.js";
  import Class from "./Class.svelte";
  import { Link, Route } from "svelte-routing";
  let apiBaseUrl = $server;
  import { onMount } from "svelte";
  import GroupFrom from "../components/GroupForm.svelte";
  import RoleFrom from "../components/RoleForm.svelte";
  let groups = [];
  let roles = [];
  let editingGroup = {
    name: "",
    description: "",
    id: null
  };
  let addingRole = {
    username: "",
    group: [],
    profile: [],
    profile: [],
    role: "",
    groupid: null
  };
  let gotoGroupstatus = false;
  onMount(async () => {
    selectedGroup.set(false);
    // authtoken.set(new Cookies.get('token'));
    loadingstore.set(true)
    const res = await fetch(apiBaseUrl + "/group/", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + $authtoken
      }
    });
    loadingstore.set(false)
    groups = await res.json();
    groupStore.set(groups);
  });

  function editGroup(group) {
    editingGroup = group;
  }
  function focusRole(role) {
    addingRole = role;
  }
  function clearRoles() {
    console.log("clear");
    roleStore.set([]);
    return (roles = []);
  }

  async function getRoles(id) {
    loadingstore.set(true)
    await fetch(apiBaseUrl + "/add/?search=" + id, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + $authtoken
      }
    }).then(async data => {
      if (data.status < 300) {
        roles = await data.json();
        roleStore.set(roles);
        const cookies = new Cookies();
      } else {
        response = await data.json();
        console.log(response);
      }
    });
    loadingstore.set(false)
  }

  function deleteGroup(id) {
    if (confirm("Are you sure?")) {
      loadingstore.set(true)
      fetch(`${apiBaseUrl}/group/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: "Token " + $authtoken
        }
      })
        .then(async data => {
          if (data.status < 300) {
            console.log("success");
          }
        })
        .then(() => {
          groups = $groupStore;
          groups = groups.filter(p => p.id !== id);
          groupStore.set(groups);
        });
      loadingstore.set(false)
    }
  }

  function deleteRole(id) {
    if (confirm("Are you sure?")) {
      loadingstore.set(true)
      fetch(`${apiBaseUrl}/add/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: "Token " + $authtoken
        }
      })
        .then(async data => {
          if (data.status < 300) {
            console.log("success");
          }
        })
        .then(() => {
          roles = $roleStore;
          roles = roles.filter(p => p.id !== id);
          roleStore.set(roles);
        });
        loadingstore.set(false)
    }
  }

  function addGroup({ detail: group }) {
    groups = $groupStore;
    if (groups.find(p => p.id === group.id)) {
      const index = groups.findIndex(p => p.id === group.id);
      let groupsUpdated = groups;
      groupsUpdated.splice(index, 1, group);
      groups = groupsUpdated;
    } else groups = [group, ...groups];
    editingGroup = {
      name: "",
      description: "",
      id: null,
      group: [],
      profile: [],
      date_updated: []
    };
    groupStore.set(groups);
  }

  function addRole({ detail: role }) {
    roles = $roleStore;
    if (roles.find(p => p.id === role.id)) {
      const index = roles.findIndex(p => p.id === role.id);
      let rolesUpdated = roles;
      rolesUpdated.splice(index, 1, role);
      roles = rolesUpdated;
    } else roles = [role, ...roles];
    addingRole = {
      username: "",
      role: "",
      groupid: null
    };
  }

  function gotoGroup(id) {
    selectedGroup.set(id);
  }

  
</script>

<style>

</style>

{#if $authtoken != false}
  {#if $selectedGroup != false}
    <Route path="/" component={Class} />
  {/if}
  {#if roles.length != 0}
    <!-- <button on:click={clearRoles} class="waves-effect waves-light btn">
      clear
    </button> -->
  {/if}
  <div class="row">
    <div class="col s3">
      <GroupFrom on:groupCreated={addGroup} {editingGroup} />
    </div>
    <div class="col s3">
      <RoleFrom on:groupCreated={addRole} {addingRole} />
    </div>
  </div>

<button type="button" class="btn btn-primary my-5" data-toggle="modal" data-target="#groupModal">
    Create New Group
</button>


  <!-- groups section started-->

  <div class="row">
    {#if $groupStore.length === 0}
      <h1>loadingstore groups ...</h1>
    {:else}
      {#each $groupStore as group}
        <div class="card bg-light mb-3 mx-3 my-2" style="width: 25rem;">
          <div class="card-header">{group.name}</div>
          <div class="card-body">
            <h5 class="card-title">{group.description}</h5>
            <p class="card-text">{group.date_updated}</p>
          </div>
          <div class="row align-middle">
            {#if group.createdBy == $userid}
                <button class="btn btn-outline-danger ml-1 btn-xs ml-4 my-2" data-toggle="modal" data-target="#groupModal" on:click={() => editGroup(group)}>Edit</button>
                <button class="btn btn-outline-danger ml-1 btn-xs my-2" on:click={() => deleteGroup(group.id)}> Delete </button>
                <button class="btn btn-outline-secondary ml-1 btn-xs my-2" data-toggle="modal" data-target="#roleListModal" on:click={() => getRoles(group.id)}>Roles</button>
                <button class="btn btn-outline-success ml-1 btn-xs my-2" data-toggle="modal" data-target="#roleModal" on:click={() => focusRole(group)}>Add Roles</button>
            {/if}
            <Link to="/class" on:click={() => selectedGroup.set(group.id)}><button class="btn ml-4 my-2 btn-outline-primary btn-xs" >Enter</button></Link>
          </div>
        </div>
      {/each}
    {/if}
  </div>



  <!-- groups section ended-->

  <!-- Roles modal start-->

  <!-- Modal -->
  <div class="modal fade" id="roleListModal" tabindex="-1" role="dialog" aria-labelledby="roleListModal" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="roleListModaTitle">Members </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          .{#if $roleStore.length === 0}
              <h1>No Members Found ...</h1>
            {:else}
            <ul class="list-group">
              {#each $roleStore as role}
                <li class="list-group-item d-flex justify-content-between align-items-center" data-toggle="popover" title={role.profile.user.username} >
                  {role.profile.name}   {role.role}  
                  <button class="badge badge-danger badge-pill mx-1" on:click={() => deleteRole(role.id)}>x</button>
                </li>
              {/each}
              </ul>
            {/if}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-warning" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>


  <!-- Roles modal end-->


{/if}

