<script>
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
  import { onMount } from "svelte";
  let response = "";
  let profile = {
    username: "",
    name: "",
    email: "",
    phone: "",
    password: ""
  };

  let token = false;
  onMount(async () => {
    authtoken.set(new Cookies().get("token"));
    loadingstore.set(true)
    fetch("http://localhost:8000/users/profile/", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + $authtoken
      }
    }).then(async data => {
      if (data.status < 300) {
        response = await data.json();
        response = response[0];
        username.set(response.user.username);
        name.set(response.name);
        phone.set(response.phone);
        email.set(response.user.email);
        profile.name = $name;
        profile.email = $email;
        profile.phone = $phone;
        profile.username = $username;
      } else {
        authtoken.set(false);
        username.set(false);
        email.set(false);
        phone.set(false);
        name.set(false);
      }
    });
    loadingstore.set(false)
  });
  async function validateToken() {
    authtoken.set(new Cookies().get("token"));
    loadingstore.set(true)
    fetch("http://localhost:8000/users/profile/", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + $authtoken
      }
    }).then(async data => {
      if (data.status < 300) {
        response = await data.json();
        response = response[0];
        username.set(response.user.username);
        name.set(response.name);
        phone.set(response.phone);
        email.set(response.user.email);
      } else {
        authtoken.set(false);
        username.set(false);
        email.set(false);
        phone.set(false);
        name.set(false);
      }
    });
    loadingstore.set(false)
  }
  async function updateProfile(event) {
    event.preventDefault();
    loadingstore.set(true)
    await fetch(apiBaseUrl + "/profile/", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + $authtoken
      },
      body: JSON.stringify({
        user: {
          username: profile.phone,
          password: null,
          email: profile.email
        },
        name: profile.name,
        image: null,
        phone: profile.phone
      })
    }).then(async data => {
      if (data.status < 300) {
        response = await data.json();
        console.log(response);
      } else {
        console.log(response);
      }
    });
    loadingstore.set(false)
  }
</script>

<style>

</style>

<!-- <button on:click={validateToken} class="waves-effect waves-light btn">
  validate Token
</button>
<h5>{$authtoken}</h5>
<h5>{$username}</h5> -->
<!-- 
<div class="row">
  <div class="row">
    <form class="col s12" on:submit={updateProfile}>
      <div class="row">
        <div class="input-field col s12">
          <input bind:value={profile.name} type="text" class="validate" />
          <label for="name">Name</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input bind:value={profile.phone} type="text" class="validate" />
          <label for="phone">Phone</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input bind:value={profile.email} type="email" class="validate" />
          <label for="email">Email</label>
        </div>
      </div>
      <div class="row">
        <button type="submit" class="waves-effect waves-light btn">
          Update
        </button>
      </div>

    </form>
  </div>
</div> -->


<!-- log In Modal -->
<div class="modal fade" id="ProfileModal" tabindex="-1" role="dialog" aria-labelledby="ProfileModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">log In Up</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <!-- Form started -->
        <form on:submit={updateProfile}>
          <div class="form-group">
            <label for="ProfileModalPhone1">Phone Number</label>
            <input type="text" bind:value={profile.phone} class="form-control"  aria-describedby="phoneHelp">
          </div>
          <div class="form-group">
            <label for="ProfileModalPhone1">Email </label>
            <input type="text" bind:value={profile.email} class="form-control"  aria-describedby="phoneHelp">
          </div>
          <div class="form-group">
            <label for="ProfileModalPhone1">Full Name</label>
            <input type="text" bind:value={profile.name} class="form-control"  aria-describedby="phoneHelp">
          </div>

          <button type="submit" class="btn btn-primary">Update</button>
        </form>
        <!-- Form ended -->
      </div>
      
    </div>
  </div>
</div>

<!-- log In Modal ended-->