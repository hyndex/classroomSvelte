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
  export let addingRole;

  let profile = "";
  let userrole = "student";

  $: id = addingRole.id;
  let loading = false;

  async function onSubmit(event) {
    loadingstore.set(true)
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
    loadingstore.set(false)
    dispatch("roleCreated", removeEventListener);
    profile = "";
  }
</script>

<style>

</style>

<!-- role Modal -->
<div class="modal fade" id="roleModal" tabindex="-1" role="dialog" aria-labelledby="roleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="roleModalLabel">new member</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <!-- Form started -->
        <form on:submit={onSubmit}>
          <div class="form-group">
            <label for="roleModalPhone1">Name</label>
            <input type="text" disabled="disabled" bind:value={addingRole.name} class="form-control"  aria-describedby="group">
          </div>
          <div class="form-group">
            <label for="roleModalPassword1">Description</label>
            <input type="test" bind:value={profile} placeholder="username/phone" class="form-control" >
          </div>
          <button type="submit" class="btn btn-primary">ADD</button>
        </form>
        <!-- Form ended -->
      </div>
      
    </div>
  </div>
</div>
<!-- role Modal ended-->
