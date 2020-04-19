<script>
  import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
  import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
  import "../node_modules/jquery/dist/jquery.min.js";
  import "../node_modules/jquery/dist/jquery.min.js";
  // import '../node_modules/font-awesome/css/font-awesome.min.css'
  // import '../node_modules/font-awesome/fonts/fontawesome-webfont.woff'
  // import '../node_modules/font-awesome/fonts/fontawesome-webfont.ttf'
  // import '../node_modules/font-awesome/fonts/fontawesome-webfont.woff2'
  // import '../node_modules/font-awesome/fonts/fontawesome-webfont.eot'
  // import Icon from '../node_modules/fa-svelte/src/icon.svelte'
  // import  '../node_modules/@fortawesome/free-solid-svg-icons/faCircle'

  // import jQuery from '../node_modules/jquery/dist/jquery.min.js'
  // import '../node_modules/bulma-start/css/main.css'

  import { Router, Route, navigate } from "svelte-routing";
  import { onMount } from "svelte";
  import Navbar from "./layout/Navbar.svelte";
  import Home from "./pages/Home.svelte";
  import Class from "./pages/Class.svelte";
  import Profile from "./pages/Profile.svelte";
  import Log from "./pages/Log.svelte";
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
	selectedSubmit,
	validate,
  } from "./store/stores.js";
  // onMount(async () => {
  //   if($validate==false){
  //     {navigate("/log", { replace: true })}
  //   }
  // });
</script>

<style>

</style>
<!-- {#if $authtoken == false}
  {navigate("/log", { replace: true })}
  
  {:else}
     {navigate("/home", { replace: true })}
{/if} -->


<Router>
  <Navbar />
  <Profile />
  <div class="container">
    <Route path="/" component={Log} />
    <Route path="/class" component={Class} />
    <Route path="/profile" component={Profile} />
    <Route path="/home" component={Home} />
    <Route component={Log} />
  </div>
</Router>
