<script>
  import Cookies from "universal-cookie";
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
  import NoteForm from "../components/NoteForm.svelte";
  import AssignmentForm from "../components/AssignmentForm.svelte";
  import SubmitForm from "../components/SubmitForm.svelte";

  let apiBaseUrl = $server;
  import { onMount } from "svelte";
  let response = "";
  let group = "";
  let owner = false;
  let assignments = [];
  let AssignmentTab="nav-link active";
  let NotesTab="nav-link";
  let editingAssignment = {
    id: null,
    title: "",
    description: "",
    deadline: ""
  };
  
  let notes = [];
  let editingNote = {
    id: null,
    title: "",
    description: ""
  };
  
  let submits = [];
  let editingSubmit = {
    id: null,
    title: "",
    description: ""
  };
  
  onMount(async () => {
    loadingstore.set(true)
    fetch($server + "/users/group/" + $selectedGroup + "/", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + $authtoken
      }
    }).then(async data => {
      if (data.status < 300) {
        group = await data.json();
      } else {
        group = await data.json();
      }
    });

    fetch($server + "/class/assignment/?group__id=" + $selectedGroup, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + $authtoken
      }
    }).then(async data => {
      if (data.status < 300) {
        assignments = await data.json();
        assignmentStore.set(assignments);
      }
    });

    fetch($server + "/class/notes/?group__id=" + $selectedGroup, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + $authtoken
      }
    }).then(async data => {
      if (data.status < 300) {
        notes = await data.json();
        noteStore.set(notes);
      }
    });
    loadingstore.set(false)
  });


function getAllAssignments(){
  loadingstore.set(true)
  fetch($server + "/class/assignment/?group__id=" + $selectedGroup, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + $authtoken
      }
    }).then(async data => {
      if (data.status < 300) {
        assignments = await data.json();
        assignmentStore.set(assignments);
      }
    });
    loadingstore.set(false)
}

function getAllNotes(){
  loadingstore.set(true)
  fetch($server + "/class/notes/?group__id=" + $selectedGroup, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + $authtoken
      }
    }).then(async data => {
      if (data.status < 300) {
        notes = await data.json();
        noteStore.set(notes);
      }
    });
    loadingstore.set(false)
}




  function editAssignment(assignment) {
    editingAssignment = assignment;
  }
  function editNote(note) {
    editingNote = note;
  }
  function editSubmit(submit) {
    editingSubmit = submit;
  }
  function addSubmit(){
    editingSubmit = {
      id: null,
      title: "",
      description: ""
    };
  }
function addNote(){
    editingNote = {
      id: null,
      title: "",
      description: ""
    };
  }
  function addAssignment(){
    editingAssignment = {
      id: null,
      title: "",
      description: "",
      deadline: ""
    };
  }


  function deleteAssignment(id) {
    if (confirm("Are you sure?")) {
      loadingstore.set(true)
      fetch(`${apiBaseUrl}/class/assignment/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: "Token " + $authtoken
        }
      })
        .then(async data => {
          if (data.status < 300) {
            console.log("success");
          }
        })
        .then(() => {
          assignments = $assignmentStore;
          assignments = assignments.filter(p => p.id !== id);
          assignmentStore.set(assignments);
        });
        loadingstore.set(false)
    }
  }
  function deleteNote(id) {
    if (confirm("Are you sure?")) {
      loadingstore.set(true)
      fetch(`${apiBaseUrl}/class/notes/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: "Token " + $authtoken
        }
      })
        .then(async data => {
          if (data.status < 300) {
            console.log("success");
          }
        })
        .then(() => {
          notes = $noteStore;
          notes = notes.filter(p => p.id !== id);
          noteStore.set(notes);
        });
      loadingstore.set(false)
    }
  }

  async function getRoles(id) {
    loadingstore.set(true)
    await fetch(apiBaseUrl + "/add/?search=" + id, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + $authtoken
      }
    }).then(async data => {
      if (data.status < 300) {
        roles = await data.json();
        const cookies = new Cookies();
      } else {
        response = await data.json();
        console.log('error',response);
      }
    });
    loadingstore.set(false)
  }
  async function getSubmits(id) {
    loadingstore.set(true)
    await fetch(apiBaseUrl + "/class/submit/?assignment__id=" + id, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + $authtoken
      }
    }).then(async data => {
      if (data.status < 300) {
        let temp = await data.json();
        submitStore.set(temp)
        return temp
      } else {
        let temp = await data.json();
        return false
      }
    });
    loadingstore.set(false)
  }

function setAssignmentTab(){
  AssignmentTab="nav-link active";
  NotesTab="nav-link";
  getAllAssignments()
  console.log('assignment set')
}
function setNoteTab(){
  NotesTab="nav-link active";
  AssignmentTab="nav-link";
  getAllNotes()
  console.log('notes set')
}
 
</script>


















 <!-- FORM SECTION  START-->



{console.log('created by',group.createdBy)}
{console.log('userid',$userid)}
{#if group.createdBy === $userid}
  <button type="button" on:click={() => addAssignment()} class="btn btn-primary" data-toggle="modal" data-target="#assignmentModal">
        Give New Assignment
  </button>
  <button type="button" on:click={() => addNote()} class="btn btn-primary" data-toggle="modal" data-target="#noteModal">
        Give New Note
  </button>
  <AssignmentForm {editingAssignment} />
  <NoteForm {editingNote} />
  
  {:else}
     <SubmitForm {editingSubmit} />
{/if}

 <!-- FORM SECTION  END-->


<ul class="nav nav-tabs my-5">
  <li class="nav-item">
    <a on:click={() => setAssignmentTab()} class={AssignmentTab} href="#">Assignment</a>
  </li>
  <li class="nav-item">
    <a on:click={() => setNoteTab()} class={NotesTab} href="#">Notes</a>
  </li>
</ul>


 <!-- ASSIGNMENT SECTION  START -->
 {#if AssignmentTab=="nav-link active"}
    {#each $assignmentStore as assignment}
      <div class="card my-3">
        <div class="card-header">
          deadline: {assignment.deadline}
        </div>
        <div class="card-body">
          <h5 class="card-title">{assignment.title}</h5>
          <p class="card-text">{assignment.description} </p>
          <h6 class="card-title">attachment: {assignment.file ? assignment.file : 'No file attached'}</h6>
        
        
        </div>
        <div class="row">
          {#if group.createdBy == $userid}
            <button on:click={() => editAssignment(assignment)} type="button" class="btn btn-outline-primary mx-1 my-2 ml-4" data-toggle="modal" data-target="#assignmentModal">Edit</button>
            <button on:click={() => getSubmits(assignment.id)} type="button" class="btn btn-outline-success mx-1 my-2">Show submits</button>
            <button class="btn btn-outline-danger mx-1 my-2" on:click={() => deleteAssignment(assignment.id)} type="button">Delete</button>
          {:else}
            <button on:click={() => selectedAssignment.set(assignment)} class="btn btn-outline-info mx-1 my-2 ml-4" data-toggle="modal" data-target="#submitModal">Submit Answer</button>
            <button on:click={() => getSubmits(assignment.id)} class="btn btn-outline-secondary mx-1 my-2">Show submits</button>
          {/if} 
        </div>
      </div>
    {/each}

 {/if}
 <!-- ASSIGNMENT SECTION  END -->



 <!-- ASSIGNMENT SUBMIT SECTION  START -->


{#each $submitStore as submit}
  <!-- title: {submit.title}
  <br />
  description: {submit.description}
  <br />
  attachment: {submit.file ? submit.file : 'No file attached'}
  <br />
  <br />
  <br />
  <hr /> -->

  <div class="modal fade" id="submitListModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h6 class="modal-title" id="exampleModalCenterTitle">{submit.title}</h6>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        {submit.description}
      </div>
      <div class="modal-footer">
        <p>attachment: {submit.file ? submit.file : 'No file attached'}</p>
        <button type="button" class="btn btn-secondary mx-3 my-3 ml-4" data-dismiss="modal">No just kidding!</button>
      </div>
    </div>
  </div>
</div>
{/each}


 <!-- ASSIGNMENT SUBMIT SECTION  END -->

 <!-- NOTES SECTION  START -->

 {#if NotesTab=="nav-link active"}
    {#each $noteStore as note}
      <div class="card my-3">
        <div class="card-header">
          deadline: {note.date_updated}
        </div>
        <div class="card-body">
          <h5 class="card-title">{note.title}</h5>
          <p class="card-text">{note.description} </p>
          <h6 class="card-title">attachment: {note.file ? note.file : 'No file attached'}</h6>
        </div>
        <div class="row">
          {#if group.createdBy == $userid}
            <button on:click={() => editNote(note)} type="button" class="btn btn-outline-primary mx-1" data-toggle="modal" data-target="#assignmentModal">Edit</button>
            <button class="btn btn-outline-danger mx-1" on:click={() => deleteNote(note.id)} type="button">Delete</button>
          {/if} 
        </div>
      </div>
    {/each}
 {/if}





