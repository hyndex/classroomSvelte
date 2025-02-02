import { writable } from 'svelte/store';

function url() {
	const { subscribe } = writable('https://087f178e.ngrok.io');

	return {
		subscribe,
	};
}

export const server = url();
export const authtoken = writable(false);
export const validate = writable(false);
export const username = writable(false);
export const userid = writable(false);
export const name = writable(false);
export const email = writable(false);
export const phone = writable(false);
export const status = writable(false);
export const isGroupOwner = writable(false);
export const selectedGroup = writable(false);
export const selectedAssignment = writable(false);
export const selectedNote = writable(false);
export const selectedSubmit = writable(false);
export const groupStore = writable([]);
export const assignmentStore = writable([]);
export const noteStore = writable([]);
export const roleStore = writable([]);
export const submitStore = writable([]);
export const loadingstore = writable(false);