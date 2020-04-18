  <script>
    import { Link } from 'svelte-routing';
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
    validate,
  } from "../store/stores.js";
  </script>
  
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" href="#">GoToClass.Online</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <Link to='/home'><a class="nav-link" href="#">Home<span class="sr-only">(current)</span></a></Link>
      </li>
      <li class="nav-item">
        <!-- <Link to='/profile'> -->
        <a class="nav-link" data-toggle="modal" data-target="#ProfileModal" href="#">Profile</a>
        <!-- </Link> -->
      </li>
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Help
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
          <a class="dropdown-item" href="#">Create Group</a>
          <a class="dropdown-item" href="#">Add Members</a>
          <a class="dropdown-item" href="#">Add Assignment</a>
          <a class="dropdown-item" href="#">Add Notes</a>
          <a class="dropdown-item" href="#">Submit Assignment</a>
          <a class="dropdown-item" href="#">Start Class</a>
          <a class="dropdown-item" href="#">Join Class</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="#">Something else here</a>
        </div>
      </li>
      <li class="nav-item">
        <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">{$loadingstore?"loading":""}</a>
      </li>
      <li class="nav-item">
        <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Welcome {$name}</a>
      </li>
    </ul>
    <form class="form-inline my-2 my-lg-0">
    {#if $validate == true}
       <button type="button" class="btn btn-warning my-2 my-sm-0 mx-2" data-toggle="modal" data-target="#logoutModal">log Out</button>
    {:else}
      <button type="button" class="btn btn-danger my-2 my-sm-0 mx-2" data-toggle="modal" data-target="#signupModal">sign Up</button>
      <button type="button" class="btn btn-outline-success my-2 my-sm-0 mx-2" data-toggle="modal" data-target="#loginModal">log In</button>
    {/if}
    </form>
  </div>
</nav>
