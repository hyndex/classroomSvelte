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

  export let editingGroup;
  $: title = editingGroup.name;
  $: body = editingGroup.description;

  let loading = false;
  let files;

  async function onSubmit(event) {
    event.preventDefault();
    if (title.trim() === "" || body.trim() === "") {
      console.log("All data are not present");
      return;
    }
    const newGroup = { title, body };

    loading = true;
    let url, method;

    if (editingGroup.id) {
      url = `${apiBaseUrl}/group/${editingGroup.id}/`;
      method = "PUT";
    } else {
      url = `${apiBaseUrl}/group/`;
      method = "POST";
    }
    console.log(
      JSON.stringify({
        name: title,
        description: body
      })
    );
    const response = await fetch(url, {
      method: method,
      body: JSON.stringify({
        id: editingGroup.id,
        name: title,
        description: body
      }),
      credentials: "include",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + $authtoken
      }
    });

    const group = await response.json();
    loading = false;
    dispatch("groupCreated", group);
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
    <div class="input-field">
      <input type="Text" placeholder="Name" bind:value={editingGroup.name} />
    </div>
    <div class="input-field">
      <input
        type="Text"
        placeholder="description"
        bind:value={editingGroup.description} />
    </div>
    <input type="file" bind:files />
    <button type="submit">
      {editingGroup.id ? 'Update' : 'Add'}
    </button>

  </form>
{:else}
  <div class="progress">
    <div class="indeterminate" />
  </div>
{/if}
