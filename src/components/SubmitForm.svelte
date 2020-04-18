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
    submitStore,
    loadingstore,
    selectedSubmit
  } from "../store/stores.js";
  let apiBaseUrl = $server;
  const dispatch = createEventDispatcher();
  export let editingSubmit;

  $: title = editingSubmit.title;
  $: description = editingSubmit.description;

  let loading = false;
  let files;

  async function onSubmitAssignment(event) {
    event.preventDefault();
    loadingstore.set(true)
    if (
      title.trim() === "" ||
      description.trim() === "" 
    ) {
      console.log("All data are not present");
      return;
    }
    loading = true;
    let url, method;
    if (editingSubmit.id) {
      url = `${apiBaseUrl}/class/submit/${editingSubmit.id}/`;
      method = "PUT";
    } else {
      url = `${apiBaseUrl}/class/submit/`;
      method = "POST";
    }
    console.log(editingSubmit)
    await fetch(url, {
      method: method,
      body: JSON.stringify({
        assignmentid: $selectedAssignment.id,
        title: editingSubmit.title,
        description: editingSubmit.description,
      }),
      credentials: "include",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + $authtoken
      }
    }).then(async data => {
      if (data.status < 300) {
        let submit = await data.json();
        if ($submitStore.find(p => p.id === submit.id)) {
          const index = $submitStore.findIndex(p => p.id === submit.id);
          let submitsUpdated = $submitStore;
          submitsUpdated.splice(index, 1, submit);
          submitStore.set(submitsUpdated);
        } else submitStore.set([submit, ...$submitStore]);
      } else {
        let submit = await data.json();
      }
    });
    loading = false;
    loadingstore.set(false)
  }
</script>

<style>
</style>

{#if loading === false}
  <form on:submit={onSubmitAssignment}>
    <input
      type="Text"
      disabled
      bind:value={$selectedAssignment.title}
      placeholder="Assignment" />
    <input
      type="Text"
      bind:value={editingSubmit.title}
      placeholder="title" />
    <input
      type="Text"
      bind:value={editingSubmit.description}
      placeholder="Description" />
    <input type="file" bind:files />
    <button type="submit">
      <button type="submit">
        {editingSubmit.id ? 'Update Assignment' : 'Submit Assignment'}
      </button>
    </button>

  </form>
{:else}
  <div class="progress">
    <div class="indeterminate" />
  </div>
{/if}
