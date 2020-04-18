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
    loadingstore.set(true)
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
    editingNote = {
      id: null,
      title: "",
      description: ""
    };
    loading = false;
    loadingstore.set(false)
  }
</script>

<style>

</style>


<!-- note Modal -->
<div class="modal fade" id="noteModal" tabindex="-1" role="dialog" aria-labelledby="noteModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="noteModalLabel">Note</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <!-- Form started -->
        <form on:submit={onSubmit}>
          <div class="form-group">
            <input type="text" bind:value={editingNote.title} class="form-control"  aria-describedby="name">
          </div>
          <div class="form-group">
            <input type="test" bind:value={editingNote.description} class="form-control" >
          </div>
          <div class="form-group">
            <div class="custom-file my-1">
              <label class="custom-file-label" for="customFile">Choose file</label>
              <input type="file"  bind:files class="custom-file-input" id="customFile">
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary">{editingNote.id ? 'Update' : 'Create'}</button>
        </form>
        <!-- Form ended -->
      </div>
      
    </div>
  </div>
</div>
<!-- group Modal ended-->
