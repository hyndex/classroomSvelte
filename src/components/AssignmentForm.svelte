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
  export let editingAssignment;

  $: title = editingAssignment.title;
  $: description = editingAssignment.description;
  $: deadline = editingAssignment.deadline;

  let loading = false;
  let files;

  async function onSubmitAssignment(event) {
    event.preventDefault();
    loadingstore.set(true)
    console.log("title", title);
    console.log("description", description);
    console.log("deadline", deadline);
    if (
      title.trim() === "" ||
      description.trim() === "" ||
      deadline.trim() === ""
    ) {
      console.log("All data are not present");
      return;
    }
    loading = true;
    let url, method;
    if (editingAssignment.id) {
      url = `${apiBaseUrl}/class/assignment/${editingAssignment.id}/`;
      method = "PUT";
    } else {
      url = `${apiBaseUrl}/class/assignment/`;
      method = "POST";
    }

    await fetch(url, {
      method: method,
      body: JSON.stringify({
        groupid: $selectedGroup,
        title: editingAssignment.title,
        description: editingAssignment.description,
        deadline: editingAssignment.deadline
      }),
      credentials: "include",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + $authtoken
      }
    }).then(async data => {
      if (data.status < 300) {
        let assignment = await data.json();
        if ($assignmentStore.find(p => p.id === assignment.id)) {
          const index = $assignmentStore.findIndex(p => p.id === assignment.id);
          let assignmentsUpdated = $assignmentStore;
          assignmentsUpdated.splice(index, 1, assignment);
          assignmentStore.set(assignmentsUpdated);
        } 
        else{
          assignmentStore.set([assignment, ...$assignmentStore]);
        }
        
      } 
      else {
        let assignment = await data.json();
      }
    });
    loading = false;
    loadingstore.set(false)
    editingAssignment = {
      id: null,
      title: "",
      description: "",
      deadline: ""
    };
  }
</script>

<style>

</style>

<!-- group Modal -->
<div class="modal fade" id="assignmentModal" tabindex="-1" role="dialog" aria-labelledby="noteModalLabel" aria-hidden="true">
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
        <form on:submit={onSubmitAssignment}>
          <div class="form-group">
            <input type="text" placeholder="Title" bind:value={editingAssignment.title} class="form-control"  aria-describedby="name">
          </div>
          <div class="form-group">
            <input type="test" placeholder="Description" bind:value={editingAssignment.description} class="form-control" >
          </div>
          <div class="form-group">
            <input type="test" placeholder="deadline yyyymmdd" bind:value={editingAssignment.deadline} class="form-control" >
          </div>
          <div class="form-group">
            <div class="custom-file">
              <label class="custom-file-label" for="customFile">Choose file</label>
              <input type="file"  bind:files class="custom-file-input" id="customFile">
            </div>
          </div>
          <button type="submit" class="btn btn-primary my-1">{editingAssignment.id ? 'Update' : 'Create'}</button>
        </form>
        <!-- Form ended -->
      </div>
      
    </div>
  </div>
</div>
<!-- group Modal ended-->

