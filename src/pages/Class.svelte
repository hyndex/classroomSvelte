<script>
    import Cookies from 'universal-cookie';
    import { server, authtoken, username, email, phone, name, userid, selectedGroup, groupStore, assignmentStore, noteStore, roleStore} from '../store/stores.js';
    import NoteForm from '../components/NoteForm.svelte';
    import AssignmentForm from '../components/AssignmentForm.svelte';
    let apiBaseUrl=$server
    import { onMount } from 'svelte';
    let loading=false;
    let response='';
    let group='';
    let owner=false;
    let assignments=[];
    let editingAssignment = {
        id: null,
        title: "",
        description: "",
        deadline: ""
    };
    let notes=[];
    let editingNote = {
        id: null,
        title: "",
        description: "",
    };
    

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
                assignmentStore.set(assignments)
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
                noteStore.set(notes)
            }
        })
    })

    function editAssignment(assignment) {
        editingAssignment = assignment;
    }
    function editNote(note) {
        editingNote = note;
    }

    function deleteAssignment(id){
        if(confirm("Are you sure?")){
            fetch(`${apiBaseUrl}/class/assignment/${id}`,{
                method:'DELETE',
                credentials: 'include',
                headers: {
                    "Content-type": "application/json",
                    'Accept': 'application/json',
                    'Authorization': 'Token ' + $authtoken
                }
            }).then(async data => {
                if (data.status < 300) {
                    console.log('success')
                }
            }).then(()=>{
                assignments=$assignmentStore
                assignments=assignments.filter(p => p.id !== id)
                assignmentStore.set(assignments)
            });
        }
        
    }
    function deleteNote(id){
        if(confirm("Are you sure?")){
            fetch(`${apiBaseUrl}/class/notes/${id}`,{
                method:'DELETE',
                credentials: 'include',
                headers: {
                    "Content-type": "application/json",
                    'Accept': 'application/json',
                    'Authorization': 'Token ' + $authtoken
                }
            }).then(async data => {
                if (data.status < 300) {
                    console.log('success')
                }
            }).then(()=>{
                notes=$noteStore
                notes=notes.filter(p => p.id !== id)
                noteStore.set(notes)
            });
        }
        
    }

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
            <AssignmentForm  {editingAssignment}/>
            <NoteForm {editingNote}/>
{/if}
<h1>{group.createdBy}</h1>
<h1>{$userid}</h1>
<h1>{$selectedGroup}</h1>
<h1>{group.name}</h1>
<h2>{group.description}</h2>

<br/>
<hr/>
<br/>
<h3>Assignments</h3>

{#each $assignmentStore as assignment}
    title: {assignment.title}<br/>
    description: {assignment.description}<br/>
    deadline{assignment.deadline}<br/>
    attachment: {assignment.file? assignment.file:"No file attached"}<br/>
    <a href="#" on:click={() => editAssignment(assignment)}>Edit</a><br/>
    <button class="delete-btn" on:click={() => deleteAssignment(assignment.id)}>Delete</button><br/><hr/>
{/each}


<br/>
<hr/>
<br/>
<h3>Notes</h3>

{#each $noteStore as note}
    title: {note.title}<br/>
    description: {note.description}<br/>
    attachment: {note.file? note.file:"No file attached"}<br/>
    <a href="#" on:click={() => editNote(note)}>Edit</a><br/>
    <button class="delete-btn" on:click={() => deleteNote(note.id)}>Delete</button><br/><hr/>
{/each}
