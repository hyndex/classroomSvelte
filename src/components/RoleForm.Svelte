<script>
  import { createEventDispatcher } from "svelte";
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
  let apiBaseUrl = $server;
  const dispatch = createEventDispatcher();
  export let addingRole;

  let profile = "";
  let userrole = "student";

  $: id = addingRole.id;
  let loading = false;

  async function onSubmit(event) {
    console.log("profile", profile);
    console.log("role", userrole);
    event.preventDefault();
    if (profile.trim() === "" || userrole.trim() === "") {
      console.log("All data are not present");
      return;
    }
    loading = true;
    let url, method;

    url = `${apiBaseUrl}/add/`;
    method = "POST";

    await fetch(url, {
      method: method,
      body: JSON.stringify({
        groupid: addingRole.id,
        username: profile,
        role: userrole
      }),
      credentials: "include",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + $authtoken
      }
    }).then(async data => {
      if (data.status < 300) {
        let roles = $roleStore;
        const role = await data.json();
        roles = [role, ...roles];
        roleStore.set(roles);
      } else {
        const role = await data.json();
      }
    });

    loading = false;
    dispatch("roleCreated", removeEventListener);
    profile = "";
  }
</script>

<style>
  form {
    margin: 50px;
  }

  .progress {
    margin: 100px, 0;
  }
</style>

{#if loading === false}
  <form on:submit={onSubmit}>
    <input type="Text" disabled="disabled" bind:value={addingRole.name} />
    <input type="Text" bind:value={profile} placeholder="username/phone" />
    <select bind:value={userrole}>
      <option value="student">Student</option>
      <option value="teacher">Teacher</option>
    </select>

    <button type="submit">Add ROle</button>

  </form>
{:else}
  <div class="progress">
    <div class="indeterminate" />
  </div>
{/if}
