<script>
import Cookies from 'universal-cookie';
    import { server, authtoken, username, email, phone, name, selectedGroup,userid} from '../store/stores.js';
    let apiBaseUrl=$server
    import { onMount } from 'svelte';
    let loading=false;
    let response='';
    let group='';
    let owner=false;
    let assignments=[];
    let notes=[];

    onMount( async () =>{
        fetch($server+'/users/group/'+$selectedGroup+'/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                "Content-type": "application/json",
                'Accept': 'application/json',
                'Authorization': 'Token ' + $authtoken
            }
        }).then(async data =>{
            if (data.status < 300) {
                group = await data.json();
                console.log(group)
            }
            else{
                group = await data.json();
            }
        })
        
        fetch($server+'/class/assignment/?group__id='+$selectedGroup, {
            method: 'GET',
            credentials: 'include',
            headers: {
                "Content-type": "application/json",
                'Accept': 'application/json',
                'Authorization': 'Token ' + $authtoken
            }
        }).then(async data =>{
            if (data.status < 300) {
                assignments = await data.json();
                console.log(assignments)
            }
        })

        fetch($server+'/class/notes/?group__id='+$selectedGroup, {
            method: 'GET',
            credentials: 'include',
            headers: {
                "Content-type": "application/json",
                'Accept': 'application/json',
                'Authorization': 'Token ' + $authtoken
            }
        }).then(async data =>{
            if (data.status < 300) {
                notes = await data.json();
                console.log(notes)
            }
        })
    })


    async function getRoles(id) {
            await fetch(apiBaseUrl+'/add/?search='+id,{
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-type": "application/json",
                    "Accept": "application/json",
                    'Authorization': 'Token ' + $authtoken
                },
            }).then(async data => {
                if (data.status < 300) {
                    roles = await data.json();
                    const cookies = new Cookies();
                }
                else{
                    response= await data.json();
                    console.log(response)
                }
            })
        }
</script>
{#if group.createdBy == $userid}
            hello
{/if}
<h1>{group.createdBy}</h1>
<h1>{$userid}</h1>
<h1>{group.name}</h1>
<h2>{group.description}</h2>

<br/>
<hr/>
<br/>
<h3>Assignments</h3>

{#each assignments as assignment}
    title: {assignment.title}<br/>
    description: {assignment.title}<br/>
    deadline{assignment.deadline}<br/>
    attachment: {assignment.file? assignment.file:"No file attached"}<br/><hr/>
{/each}


<br/>
<hr/>
<br/>
<h3>Notes</h3>

{#each notes as note}
    title: {note.title}<br/>
    description: {note.title}<br/>
    attachment: {note.file? note.file:"No file attached"}<br/><hr/>
{/each}
