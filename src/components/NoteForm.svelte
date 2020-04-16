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
    groupStore,
    assignmentStore,
    noteStore,
    roleStore
  } from "../store/stores.js";
  let apiBaseUrl = $server;
  const dispatch = createEventDispatcher();
  export let editingNote;

  $: title = editingNote.title;
  $: description = editingNote.description;

  let loading = false;
  let files;

  async function onSubmit(event) {
    event.preventDefault();
    if (title.trim() === "" || description.trim() === "") {
      console.log("All data are not present");
      return;
    }
    loading = true;
    let url, method;
    if (editingNote.id) {
      url = `${apiBaseUrl}/class/notes/${editingNote.id}/`;
      method = "PUT";
    } else {
      url = `${apiBaseUrl}/class/notes/`;
      method = "POST";
    }

    await fetch(url, {
      method: method,
      body: JSON.stringify({
        groupid: $selectedGroup,
        title: editingNote.title,
        description: editingNote.description
      }),
      credentials: "include",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + $authtoken
      }
    }).then(async data => {
      if (data.status < 300) {
        let note = await data.json();
        if ($noteStore.find(p => p.id === note.id)) {
          const index = $noteStore.findIndex(p => p.id === note.id);
          let notesUpdated = $noteStore;
          notesUpdated.splice(index, 1, note);
          noteStore.set(notesUpdated);
        } else noteStore.set([note, ...$noteStore]);
      } else {
        let note = await data.json();
      }
    });
    loading = false;
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
    <input type="Text" bind:value={editingNote.title} placeholder="Title" />
    <input
      type="Text"
      bind:value={editingNote.description}
      placeholder="Description" />
    <input type="file" bind:files />
    <button type="submit">{editingNote.id ? 'Update Note' : 'Add Note'}</button>

  </form>
{:else}
  <div class="progress">
    <div class="indeterminate" />
  </div>
{/if}
