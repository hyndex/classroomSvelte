import { writable } from 'svelte/store';

function url() {
	const { subscribe } = writable('http://127.0.0.1:8000');

	return {
		subscribe,
	};
}

export const server = url();
export const authtoken = writable(false);
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
export const groupStore = writable([]);
export const assignmentStore = writable([]);
export const noteStore = writable([]);
export const roleStore = writable([]);
export const submitStore = writable([]);