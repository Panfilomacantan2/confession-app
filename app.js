const BASE_URL = 'https://confession-api.onrender.com';
const LOCALHOST_URL = 'http://localhost:3000';
let isLoading = false;

const submitMessageBtn = document.querySelector('#submitMessageBtn');

// UUID
const uuidv4 = () => {
	return `id-${new Date().getFullYear()}-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0,
			v = c == 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};

// From now time
function time_ago(time) {
	switch (typeof time) {
		case 'number':
			break;
		case 'string':
			time = +new Date(time);
			break;
		case 'object':
			if (time.constructor === Date) time = time.getTime();
			break;
		default:
			time = +new Date();
	}
	var time_formats = [
		[60, 'seconds', 1], // 60
		[120, '1 minute ago', '1 minute from now'], // 60*2
		[3600, 'minutes', 60], // 60*60, 60
		[7200, '1 hour ago', '1 hour from now'], // 60*60*2
		[86400, 'hours', 3600], // 60*60*24, 60*60
		[172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
		[604800, 'days', 86400], // 60*60*24*7, 60*60*24
		[1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
		[2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
		[4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
		[29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
		[58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
		[2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
		[5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
		[58060800000, 'centuries', 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
	];
	var seconds = (+new Date() - time) / 1000,
		token = 'ago',
		list_choice = 1;

	if (seconds < 1) {
		return 'Just now';
	}
	if (seconds < 0) {
		seconds = Math.abs(seconds);
		token = 'from now';
		list_choice = 2;
	}
	var i = 0,
		format;
	while ((format = time_formats[i++]))
		if (seconds < format[0]) {
			if (typeof format[2] == 'string') return format[list_choice];
			else return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
		}
	return time;
}

const fetchData = async () => {
	isLoading = true;

	const response = await fetch(LOCALHOST_URL);
	const data = await response.json();

	isLoading = false;

	return data;
};

const checkLoading = (loaded) => {
	const loaderContainer = document.querySelector('.loader-container');
	if (loaded) {
		loaderContainer.classList.add('show-loader');
	} else {
		loaderContainer.classList.remove('show-loader');
	}
};

const addNewConfession = async (e) => {
	e.preventDefault();
	const codeName = document.querySelector('#codeName');
	const messageBody = document.querySelector('#messageBody').value.trim();

	if (!codeName || !messageBody) {
		swal('Your message is not valid.', 'Please try again.', 'error');
		return;
	}

	axios
		.post(LOCALHOST_URL, {
			codeName: codeName.value.trim(),
			message: messageBody,
		})
		.then((response) => {
			swal('Message sent successfully.', '', 'success');
			submitMessageBtn.innerText = 'Send';
			resetFields();
			displayConfessions();
			codeName.focus();
		});
	submitMessageBtn.innerText = 'Sending...';
};

submitMessageBtn.addEventListener('click', addNewConfession);

const resetFields = () => {
	document.querySelector('#codeName').value = '';
	document.querySelector('#messageBody').value = '';
};

const displayConfessions = async () => {
	const confessionsContainer = document.querySelector('.confession-container');
	const data = await fetchData();
	let output = '';
	

	if (data?.length > 0) {
		data.forEach((confession) => {
			const { _id, createdAt, codeName, message, avatar } = confession;

		   output += `<div class="confession-item">
				<div class="confession-header">
					<div class="img-box">
						<img src="${avatar}" class="avatar" alt="" />
					</div>
					<div class="details">
						<div class="name">
							<h4>${codeName}</h4>
						</div>
						<div class="date">
							<h4>${moment(createdAt).format('DD.MM.YYYY')}</h4>
						</div>
					</div>
				</div>
				<hr/>

				<div class="confession">
					<p class="message">${message}</p>
				</div>
			</div>`
		});

		



		confessionsContainer.innerHTML = output;
	} else {
		const noResult = document.createElement('p');
		noResult.classList.add('no-result');
		const noResultMsg = document.createTextNode('No confessions yet.');
		noResult.appendChild(noResultMsg);
		confessionsContainer.appendChild(noResult);
	}
};

// TOGGLE CONFESSIONS CONTAINER
const showConfessionsBtn = document.querySelector('#showConfessions');

const showConfessions = () => {
	const confessionsContainer = document.querySelector('.confession-container');
	confessionsContainer.classList.toggle('show');

	if (confessionsContainer.classList.contains('show')) {
		showConfessionsBtn.innerText = 'Hide Confessions';
	} else {
		showConfessionsBtn.innerText = 'Show Confessions';
	}
};
document.addEventListener('DOMContentLoaded', displayConfessions);
showConfessionsBtn.addEventListener('click', showConfessions);

const deletePost = async (id) => {
	const response = await axios.delete(`${BASE_URL}/${id}`);
	console.log(response);
	// swal('Your message was deleted successfully.', '', 'success');
	// displayConfessions();

	console.log(id);
};
