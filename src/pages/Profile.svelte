<script>
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
  import { onMount } from "svelte";
  let loading = false;
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
  });
  async function validateToken() {
    authtoken.set(new Cookies().get("token"));
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
  }
  async function updateProfile(event) {
    event.preventDefault();
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
  }
</script>

<style>

</style>

<button on:click={validateToken} class="waves-effect waves-light btn">
  validate Token
</button>
<h5>{$authtoken}</h5>
<h5>{$username}</h5>

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
</div>
