  <script>
    import { Link } from 'svelte-routing';
  </script>
  
  <nav>
    <div class="nav-wrapper">
      <Link to="/" class="brand-logo">ClassRoom</Link>
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/class'>Class</Link></li>
      </ul>
    </div>
  </nav>