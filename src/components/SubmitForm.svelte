<script>
  import { createEventDispatcher } from "svelte";
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

<!-- note Modal -->
<div class="modal fade" id="submitModal" tabindex="-1" role="dialog" aria-labelledby="submitModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="submitModalLabel">Assignment Submit</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <!-- Form started -->
        <form on:submit={onSubmitAssignment}>
          <div class="form-group">
            <input type="text" disabled bind:value={$selectedAssignment.title} class="form-control"  aria-describedby="name">
          </div>
          <div class="form-group">
            <input type="text" bind:value={editingSubmit.title} class="form-control"  aria-describedby="name">
          </div>
          <div class="form-group">
            <input type="test" bind:value={editingSubmit.description} class="form-control" >
          </div>
          <div class="form-group">
            <div class="custom-file my-1">
              <label class="custom-file-label" for="customFile">Choose file</label>
              <input type="file"  bind:files class="custom-file-input" id="customFile">
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary">{editingSubmit.id ? 'Update' : 'Create'}</button>
        </form>
        <!-- Form ended -->
      </div>
      
    </div>
  </div>
</div>
<!-- group Modal ended-->

