<script>
  import Cookies from "universal-cookie";
  import {
    server,
    authtoken,
    username,
    email,
    phone,
    name,
    userid,
    selectedGroup,
    selectedAssignment,
    selectedNote,
    groupStore,
    assignmentStore,
    noteStore,
    roleStore,
    submitStore
  } from "../store/stores.js";
  import Class from "./Class.svelte";
  import { Link, Route } from "svelte-routing";
  let apiBaseUrl = $server;
  import { onMount } from "svelte";
  import GroupFrom from "../components/GroupForm.svelte";
  import RoleFrom from "../components/RoleForm.svelte";
  let loading = false;
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
    const res = await fetch(apiBaseUrl + "/group/", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + $authtoken
      }
    });
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
  }

  function deleteGroup(id) {
    if (confirm("Are you sure?")) {
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
    }
  }

  function deleteRole(id) {
    if (confirm("Are you sure?")) {
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

{console.log('store', $roleStore)}
{#if $authtoken != false}
  {#if $selectedGroup != false}
    <Route path="/" component={Class} />
  {/if}
  {#if roles.length != 0}
    <button on:click={clearRoles} class="waves-effect waves-light btn">
      clear
    </button>
  {/if}
  <div class="row">
    <div class="col s3">
      <GroupFrom on:groupCreated={addGroup} {editingGroup} />
    </div>
    <div class="col s3">
      <RoleFrom on:groupCreated={addRole} {addingRole} />
    </div>
  </div>

  <div class="row">
    {#if $groupStore.length === 0}
      <h1>loading groups ...</h1>
    {:else}
      {#each $groupStore as group}
        <div class="col s6">
          <div class="card">
            <div class="card-content">
              <p class="card-title">{group.name}</p>
              <p class="timestamp">{group.date_updated}</p>
              <p class="body">{group.description}</p>
            </div>
            <div class="card-action">
            {#if group.createdBy == $userid}
              <button on:click={() => editGroup(group)}>Edit</button>
              <button class="delete-btn" on:click={() => deleteGroup(group.id)}> Delete </button>
              <button on:click={() => getRoles(group.id)}>Roles</button>
              <button on:click={() => focusRole(group)}>Add Roles</button>
            {/if}
                          
            <button><Link to="/class" on:click={() => selectedGroup.set(group.id)}>Enter</Link></button>
              
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </div>

  <div class="row">
    {#if $roleStore.length === 0}
      <h1>No group selected ...</h1>
    {:else}
      {#each $roleStore as role}
        <div class="col s6">
          <div class="card">
            <div class="card-content">
              <p class="card-title">{role.profile.name}</p>
              <p class="body">{role.profile.user.username}</p>
              <p class="body">{role.role}</p>
            </div>
            <div class="card-action">
              <a
                href="#"
                on:click={() => deleteRole(role.id)}
                class="delete-btn">
                Delete
              </a>
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </div>
{/if}
