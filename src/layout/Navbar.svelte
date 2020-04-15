  <script>
    import { Link } from 'svelte-routing';
  </script>
  
  <nav>
    <div class="nav-wrapper">
      <div class="container">
        <Link to="/">
          <span class="brand-logo">Classroom</span>
        </Link>
        <ul id="nav-mobile" class="right hide-on-med-and-down">
          <li><Link to='/'>Log</Link></li>
          <li><Link to='/class'>Class</Link></li>
          <li><Link to='/profile'>Profile</Link></li>
          <li><Link to='/home'>Home</Link></li>
        </ul>
      </div>
    </div>
  </nav>