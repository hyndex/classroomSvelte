<script>
    import Cookies from 'universal-cookie';
    import { server, authtoken, username, email, phone, name, userid } from '../store/stores.js';
    let apiBaseUrl=$server
    import { onMount } from 'svelte';
    let loading=false;
    let response=''
    let profile={
        username:'',
        name:'',
        email:'',
        phone:'',
        password:'',
    }
    let token=false;
    let accountCreate=false
    
    async function validateToken(){
        authtoken.set(new Cookies().get('token'));
        fetch($server+'/users/profile/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                "Content-type": "application/json",
                'Accept': 'application/json',
                'Authorization': 'Token ' + $authtoken
            }
        }).then(async data =>{
            if (data.status < 300) {
                response = await data.json();
                response=response[0]
                username.set(response.user.username)
                name.set(response.name)
                phone.set(response.phone)
                email.set(response.user.email)
                userid.set(response.id)
            }
            else{
                authtoken.set(false)
                username.set(false)
                email.set(false)
                phone.set(false)
                name.set(false)
            }
        })
    }
    async function signUp(event) {
        event.preventDefault()
        await fetch($server+'/profile/',{
            method: "POST",
            credentials: "include",
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json"
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
            console.log(response)
            }
            else{
            console.log(response)
            }
        });
    }
    async function logIn(event) {
        event.preventDefault()
        await fetch(apiBaseUrl+'/login/',{
            method: "POST",
            credentials: "include",
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
            username: profile.phone,
            password: profile.password
            })
        }).then(async data => {
            if (data.status < 300) {
                token = await data.json();
                token=token.token
                const cookies = new Cookies();
                cookies.set('token', token, { path: '/' });
                authtoken.set(cookies.get('token'));
            }
            else{
                response= await data.json();
                console.log(response)
            }
        });
        validateToken()
    }

    async function logOut(){
        console.log('inlogout')
        fetch('http://localhost:8000/users/logout/', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({}),
            headers: {
                "Content-type": "application/json",
                'Accept': 'application/json',
                'Authorization': 'Token ' + $authtoken
            }
        }).then(async data => {
            if (data.status < 300) {
                    token=false
                    console.log('logout successful')
                }
                else{
                    console.log('logout unsuccessful')
                }
                
            })
    }

</script>

<style>

</style>
<button on:click={logOut}>Logout</button>
<button on:click={validateToken}>validate Token</button>
<h5>{$authtoken}</h5>
<h5>{$username}</h5>

<div class="row">
    <div class="row">
    <form class="col s12" on:submit={logIn}>
      <div class="row">
          <input  bind:value={profile.phone} type="text" class="validate">
          <label for="phone">Phone</label>
      </div>
      <div class="row">
          <input  bind:value={profile.password} autocomplete="on" type="password" class="validate">
          <label for="password">Password</label>
      </div>
      <div class="row">
        <button type="submit">
            login
        </button>
      </div>     
    </form>
  </div>
</div>



<h5>{token===false?'':token}</h5>








<div class="row">
    <div class="row">
    <form class="col s12" on:submit={signUp}>
      <div class="row">
          <input  bind:value={profile.name} type="text" class="validate">
          <label for="name">Name</label>
      </div>
      <div class="row">
          <input  bind:value={profile.phone} type="text" class="validate">
          <label for="phone">Phone</label>
      </div>
      <div class="row">
          <input bind:value={profile.password} autocomplete="on" type="password" class="validate">
          <label for="password">Password</label>
      </div>
      <div class="row">
          <input  bind:value={profile.email} type="email" class="validate">
          <label for="email">Email</label>
      </div>
      <div class="row">
        <button type="submit">
            Signup
        </button>
      </div>
      
    </form>
  </div>
</div>



