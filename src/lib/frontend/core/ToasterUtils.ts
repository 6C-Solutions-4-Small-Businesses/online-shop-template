import toast from 'svelte-french-toast';

export function toastError(message: string): string {
	return toast.error(message, {
		style: 'background-color: #EF4444; color: white',
		iconTheme: {
			primary: '#fff',
			secondary: 'red'
		}
	});
}

export function toastGenericError(): void {
	toastError("Désolé, quelque chose n'a pas fonctionné");
}

export function toastSuccess(message: string): void {
	toast.success(message, {
		style: 'background-color: #F0FDF4;',
		iconTheme: {
			primary: 'green',
			secondary: 'white'
		}
	});
}
