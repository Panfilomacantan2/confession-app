const BASE_URL = 'https://confession-api.onrender.com/api/post';
const BASE_URL_USER = 'https://confession-wall.herokuapp.com/api/user';
let isLoading = false;

const submitMessageBtn = document.querySelector('#submitMessageBtn');

const fetchData = async (url) => {
	isLoading = true;
	checkLoading(isLoading);

	const response = await fetch(url);
	const data = await response.json();
	displayConfessions(data.sort((a, b) => b - a));

	isLoading = false;
	checkLoading(isLoading);

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

	if (data.length > 0) {
		data.forEach((confession) => {
			const { _id, createdAt, codeName, message } = confession;
			const confessionItemDiv = document.createElement('div');
			confessionItemDiv.classList.add('confession-item');
			const confessionHeaderDiv = document.createElement('div');
			confessionHeaderDiv.classList.add('confession-header');
			confessionItemDiv.appendChild(confessionHeaderDiv);
			const confessionHeaderTextNode = document.createTextNode(`${moment(createdAt)}`);
			confessionHeaderDiv.classList.add('confession-header');
			confessionHeaderDiv.appendChild(confessionHeaderTextNode);
			const confessionMessage = document.createElement('p');
			confessionMessage.classList.add('confession-message');
			const confessionMessageTextNode = document.createTextNode(`${message}`);
			confessionMessage.appendChild(confessionMessageTextNode);
			confessionItemDiv.appendChild(confessionMessage);
			const confessionCodeName = document.createElement('p');
			confessionCodeName.classList.add('confession-code-name');
			const codeNameTextNode = document.createTextNode(`-${codeName}-`);
			confessionCodeName.appendChild(codeNameTextNode);
			confessionItemDiv.appendChild(confessionCodeName);
			confessionsContainer.appendChild(confessionItemDiv);
		});
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

showConfessionsBtn.addEventListener('click', showConfessions);

const deletePost = async (id) => {
	const response = await axios.delete(`${BASE_URL}/${id}`);
	console.log(response);
	// swal('Your message was deleted successfully.', '', 'success');
	// displayConfessions();

	console.log(id);
};
