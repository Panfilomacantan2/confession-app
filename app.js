const BASE_URL = 'https://confession-wall.herokuapp.com/api/post';
const BASE_URL_USER = 'https://confession-wall.herokuapp.com/api/user';
let isLoading = false;

const submitMessageBtn = document.querySelector('#submitMessageBtn');

const fetchData = async (url) => {
	isLoading = true;
	checkLoading(isLoading);

	const response = await fetch(url);
	const data = await response.json();
	displayConfessions(data);

	isLoading = false;
	checkLoading(isLoading);

	return data;
};

const checkLoading = (loaded) => {
	const loaderContainer = document.querySelector('.loader-container');
	if (loaded) {
		console.log('show spinner');
		loaderContainer.classList.add('show-loader');
	} else {
		console.log('hide spinner');
		loaderContainer.classList.remove('show-loader');
	}
};
fetchData(BASE_URL);

const addNewConfession = async (e) => {
	e.preventDefault();
	const codeName = document.querySelector('#codeName').value.trim();
	const messageBody = document.querySelector('#messageBody').value.trim();

	if (!codeName || !messageBody) {
		swal('Your message was not a valid.', 'Please try again.', 'error');
		return;
	}

	axios
		.post(BASE_URL, {
			codeName: codeName,
			message: messageBody,
		})
		.then((response) => {
			console.log(response);
			swal('Your message was sent successfully.', '', 'success');
			submitMessageBtn.innerText = 'Send';
			resetFields();
			displayConfessions();
		});
	submitMessageBtn.innerText = 'Send...';
};

submitMessageBtn.addEventListener('click', addNewConfession);

const resetFields = () => {
	document.querySelector('#codeName').value = '';
	document.querySelector('#messageBody').value = '';
};

const displayConfessions = async (data) => {
	const confessionsContainer = document.querySelector('.confession-container');
	let output = '';

	if (data.length > 0) {
		data.forEach((confession) => {
			const { createdAt, codeName, message } = confession;
			output += `
		<div class="confession-item">
				<p class="confession-message">
					${message}
				</p>
				<p class="confession-code-name">-<strong>${codeName}</strong>-</p>
			</div>
		`;
		});
	} else {
		output += '<p class="no-result">No confessions yet.</p>';
	}
	confessionsContainer.innerHTML = output;
	console.log(data);
};

// TOGGLE CONFESSIONS CONTAINER
const showConfessionsBtn = document.querySelector('#showConfessions');

const showConfessions = () => {
	const confessionsContainer = document.querySelector('.confession-container');
	confessionsContainer.classList.toggle('show');

	if(confessionsContainer.classList.contains('show')){
		showConfessionsBtn.innerText = 'Hide Confessions';
	}else{
		showConfessionsBtn.innerText = 'Show Confessions';
	}
};

showConfessionsBtn.addEventListener('click', showConfessions);
