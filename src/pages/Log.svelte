<script>
  import Cookies from "universal-cookie";
  import { Router, Route } from "svelte-routing";
  import Home from "./Home.svelte";
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
  let loginSucccess = false;
  let token = false;
  let accountCreate = false;

  let loadingstoreClass = "spinner-border text-info";
  async function validateToken() {
    authtoken.set(new Cookies().get("token"));
    loadingstore.set(true);
    fetch($server + "/users/profile/", {
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
        userid.set(response.id);
        loginSucccess = true;
        validate.set(true);
      } else {
        authtoken.set(false);
        username.set(false);
        email.set(false);
        phone.set(false);
        name.set(false);
      }
    });
    loadingstore.set(false);
  }
  async function signUp(event) {
    event.preventDefault();
    loadingstore.set(true);
    await fetch($server + "/profile/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        user: {
          username: profile.phone,
          password: profile.password,
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
    loadingstore.set(false);
  }
  async function logIn(event) {
    event.preventDefault();
    loadingstore.set(true);
    await fetch(apiBaseUrl + "/login/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        username: profile.phone,
        password: profile.password
      })
    }).then(async data => {
      if (data.status < 300) {
        token = await data.json();
        console.log(token);
        token = token.token;
        const cookies = new Cookies();
        cookies.set("token", token, { path: "/" });
        authtoken.set(cookies.get("token"));
        console.log(token);
        loginSucccess = true;
      } else {
        response = await data.json();
        console.log("error");
      }
    });
    validateToken();
    loadingstore.set(false);
  }

  async function logOut() {
    console.log("inlogout");
    loadingstore.set(true);
    fetch("http://localhost:8000/users/logout/", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({}),
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + $authtoken
      }
    }).then(async data => {
      if (data.status < 300) {
        token = false;
        authtoken.set(false);
        username.set(false);
        userid.set(false);
        name.set(false);
        email.set(false);
        phone.set(false);
        status.set(false);
        isGroupOwner.set(false);
        selectedGroup.set(false);
        selectedAssignment.set(false);
        selectedNote.set(false);
        groupStore.set(false);
        assignmentStore.set(false);
        noteStore.set(false);
        roleStore.set(false);
        submitStore.set(false);
        validate.set(false);
        console.log("logout successful");
      } else {
        console.log("logout unsuccessful");
      }
    });
    loadingstore.set(false);
  }

  onMount(async () => {
    loadingstore.set(true);
    validateToken();
    loadingstore.set(false);
  });
</script>

<style>

</style>

{#if $validate == true}
  <Router>
    <Route path="/" component={Home} />
  </Router>
{/if}

<!-- Sign Up Modal -->
<div
  class="modal fade"
  id="signupModal"
  tabindex="-1"
  role="dialog"
  aria-labelledby="signupModalLabel"
  aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="signupModalLabel">Sign Up</h5>
        <button
          type="button"
          class="close"
          data-dismiss="modal"
          aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <!-- Form started -->
        <form on:submit={signUp}>
          <div class="form-group">
            <label for="signupModalName1">Name</label>
            <input
              type="text"
              bind:value={profile.name}
              class="form-control"
              aria-describedby="NameHelp" />
            <small class="form-text text-muted">
              We'll never share your email with anyone else.
            </small>
          </div>
          <div class="form-group">
            <label for="signupModalPhone1">Phone Number</label>
            <input
              type="text"
              bind:value={profile.phone}
              class="form-control"
              aria-describedby="phoneHelp" />
            <small class="form-text text-muted">
              We'll never share your email with anyone else.
            </small>
          </div>
          <div class="form-group">
            <label for="signupModalEmail1">Email address</label>
            <input
              type="email"
              bind:value={profile.email}
              class="form-control"
              aria-describedby="emailHelp" />
            <small class="form-text text-muted">
              We'll never share your email with anyone else.
            </small>
          </div>
          <div class="form-group">
            <label for="signupModalPassword1">Password</label>
            <input
              type="password"
              autocomplete="on"
              bind:value={profile.password}
              class="form-control" />
          </div>
          <div class="form-group form-check">
            <input type="checkbox" class="form-check-input" />
            <label class="form-check-label" for="signupModal1">
              Check me out
            </label>
          </div>
          <button type="submit" class="btn btn-primary">Sign Up</button>
        </form>
        <!-- Form ended -->
      </div>

    </div>
  </div>
</div>

<!-- log In Modal -->
<div
  class="modal fade"
  id="loginModal"
  tabindex="-1"
  role="dialog"
  aria-labelledby="loginModalLabel"
  aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="loginModalLabel">log In Up</h5>
        <button
          type="button"
          class="close"
          data-dismiss="modal"
          aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <!-- Form started -->
        <form on:submit={logIn}>
          <div class="form-group">
            <label for="loginModalPhone1">Phone Number</label>
            <input
              type="text"
              bind:value={profile.phone}
              class="form-control"
              aria-describedby="phoneHelp" />
            <small id="phoneHelp" class="form-text text-muted">
              We'll never share your email with anyone else.
            </small>
          </div>
          <div class="form-group">
            <label for="loginModalPassword1">Password</label>
            <input
              type="password"
              autocomplete="on"
              bind:value={profile.password}
              class="form-control" />
          </div>
          <button type="submit" class="btn btn-primary">Log In</button>
        </form>
        <!-- Form ended -->
      </div>

    </div>
  </div>
</div>

<!-- log In Modal ended-->

<!--Log Out Modal start-->
<!-- Modal -->
<div
  class="modal fade"
  id="logoutModal"
  tabindex="-1"
  role="dialog"
  aria-labelledby="exampleModalCenterTitle"
  aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalCenterTitle">
          Are you want to logout for sure ?
        </h5>
        <button
          type="button"
          class="close"
          data-dismiss="modal"
          aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">
          No just kidding!
        </button>
        <button type="button" on:click={logOut} class="btn btn-primary">
          Sure Log-Me Out
        </button>
      </div>
    </div>
  </div>
</div>
<!--Log Out Modal end-->
