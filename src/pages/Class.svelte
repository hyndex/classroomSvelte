<script>
  import Cookies from "universal-cookie";
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
    submitStore
  } from "../store/stores.js";
  import NoteForm from "../components/NoteForm.svelte";
  import AssignmentForm from "../components/AssignmentForm.svelte";
  import SubmitForm from "../components/SubmitForm.svelte";
  let apiBaseUrl = $server;
  import { onMount } from "svelte";
  let loading = false;
  let response = "";
  let group = "";
  let owner = false;
  let assignments = [];
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
  });

  function editAssignment(assignment) {
    editingAssignment = assignment;
  }
  function editNote(note) {
    editingNote = note;
  }
  function editSubmit(submit) {
    editingSubmit = submit;
  }

  function deleteAssignment(id) {
    if (confirm("Are you sure?")) {
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
    }
  }
  function deleteNote(id) {
    if (confirm("Are you sure?")) {
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
    }
  }

  async function getRoles(id) {
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
  }
  async function getSubmits(id) {
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
  }

 
</script>


 <!-- FORM SECTION  START-->


{#if group.createdBy == $userid}
  <AssignmentForm {editingAssignment} />
  <NoteForm {editingNote} />
  
  {:else}
     <SubmitForm {editingSubmit} />
{/if}

 <!-- FORM SECTION  END-->

<br />
<hr />
<br />


 <!-- ASSIGNMENT SECTION  START -->

<h3>Assignments</h3>

{#each $assignmentStore as assignment}
  title: {assignment.title}
  <br />
  description: {assignment.description}
  <br />
  deadline{assignment.deadline}
  <br />
  attachment: {assignment.file ? assignment.file : 'No file attached'}
  <br />
  {console.log(assignment)}
  {#if group.createdBy == $userid}
    <button on:click={() => editAssignment(assignment)}>Edit</button>
    <button on:click={() => getSubmits(assignment.id)}>Show submits</button>
    <button class="delete-btn" on:click={() => deleteAssignment(assignment.id)}>Delete</button>
  {:else}
    <button on:click={() => selectedAssignment.set(assignment)}>Submit Answer</button>
    <button on:click={() => getSubmits(assignment.id)}>Show submits</button>
  {/if} 
  <br />
  <hr />
{/each}
 <!-- ASSIGNMENT SECTION  END -->



 <!-- ASSIGNMENT SUBMIT SECTION  START -->


<h1>Assignment submissions</h1>
{#each $submitStore as submit}
  title: {submit.title}
  <br />
  description: {submit.description}
  <br />
  attachment: {submit.file ? submit.file : 'No file attached'}
  <br />
  <br />
  <br />
  <hr />
{/each}

 <!-- ASSIGNMENT SUBMIT SECTION  END -->

 <!-- NOTES SECTION  START -->

<br />
<hr />
<br />
<h3>Notes</h3>

{#each $noteStore as note}
  title: {note.title}
  <br />
  description: {note.description}
  <br />
  attachment: {note.file ? note.file : 'No file attached'}
  <br />
  {#if group.createdBy == $userid}
  <button on:click={() => editNote(note)}>Edit</button>
  <br />
  <button class="delete-btn" on:click={() => deleteNote(note.id)}>
    Delete
  </button>
  {/if}
  <br />
  <hr />
{/each}



