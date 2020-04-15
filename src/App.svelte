<script>
	import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
	import '../node_modules/materialize-css/dist/css/materialize.min.css'
	import '../node_modules/bootstrap/dist/js/bootstrap.min.js'
	import '../node_modules/materialize-css/dist/js/materialize.min.js'
	import { Router, Route } from "svelte-routing";
	import  Navbar  from './layout/Navbar.svelte';
	import  Home  from './pages/Home.svelte';
	import  Class  from './pages/Class.svelte';
	import  Profile  from './pages/Profile.svelte';
	import  Log  from './pages/Log.svelte';
</script>

<style>

</style>

<Router>
	<Navbar />
	<div class="container">
		<Route path="/" component={Log} />
		<Route path="/class" component={Class} />
		<Route path="/profile" component={Profile} />
		<Route path="/home" component={Home} />
	</div>
</Router>