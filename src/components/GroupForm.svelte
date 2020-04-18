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
    loadingstore
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
    loadingstore.set(true)
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
        name: editingGroup.title,
        description: editingGroup.description
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
    loadingstore.set(false)
    dispatch("groupCreated", group);
  }
</script>

<style>



</style>

<!-- group Modal -->
<div class="modal fade" id="groupModal" tabindex="-1" role="dialog" aria-labelledby="groupModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="groupModalLabel">New group</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <!-- Form started -->
        <form on:submit={onSubmit}>
          <div class="form-group">
            <label for="groupModalPhone1">Name</label>
            <input type="text" bind:value={editingGroup.name} class="form-control"  aria-describedby="name">
          </div>
          <div class="form-group">
            <label for="groupModalPassword1">Description</label>
            <input type="test" bind:value={editingGroup.description} class="form-control" >
          </div>
          <button type="submit" class="btn btn-primary">{editingGroup.id ? 'Update' : 'Create'}</button>
        </form>
        <!-- Form ended -->
      </div>
      
    </div>
  </div>
</div>
<!-- group Modal ended-->
