
var button = document.querySelector('#stop');
var shouldKeepAnimating = true;
var addClassTimeouts = [];
var containers = document.querySelectorAll('.container');
containers = Array.prototype.slice.call(containers, 0);

setTimeout(setActiveClasses, 500)

button.addEventListener('click', function () {
	shouldKeepAnimating = ! shouldKeepAnimating;
	
	if (shouldKeepAnimating) {
		this.textContent = 'Stop';
		setActiveClasses();
	} else {
		this.textContent = 'Start';
		addClassTimeouts.forEach(function (timeout) {
			clearTimeout(timeout);
		});
		clearActiveClasses();
	}
});

function setActiveClasses() {
	var time = 0;

	if ( ! shouldKeepAnimating) {
		return;
	}
	
	addClassTimeouts = [];
	
	containers
		.forEach(function (container) {
			
			time += 1000;
			var timeoutId= setTimeout(function () {
								
				container.classList.add('active')
			}, time);
			addClassTimeouts.push(timeoutId)
		});

	setTimeout(function () {
		clearActiveClasses();
		setTimeout(setActiveClasses, 2000);
	}, time + 2000)
}

function clearActiveClasses() {
	containers.forEach(function (container) {
		container.classList.remove('active');
	});
}