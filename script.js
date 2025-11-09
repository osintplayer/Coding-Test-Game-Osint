// "Светофорный Рефлекс" — логика игры
(function () {
	const gameArea = document.getElementById('gameArea');
	const startStopButton = document.getElementById('startStopButton');
	const result = document.getElementById('result');

	// Состояния игры: READY - готова к запуску (красный),
	// WAITING - таймер до зелёного (ещё красный),
	// CLICKABLE - зелёный, можно кликать и измерять время реакции
	let gameState = 'READY';

	let changeTimer = null;       // таймер, который переключит цвет на зелёный
	let greenTimestamp = 0;       // момент времени (performance.now()) когда появился зелёный

	function cssVar(name, fallback) {
		const v = getComputedStyle(document.documentElement).getPropertyValue(name);
		return (v || fallback || '').trim() || fallback;
	}

	function setGameAreaRed() {
		// попробуем взять переменную из CSS, иначе используем запасной цвет
		gameArea.style.backgroundColor = cssVar('--game-red', '#d62828');
	}

	function setGameAreaGreen() {
		gameArea.style.backgroundColor = '#2ecc71';
	}

	function resetToReady(message) {
		clearTimeout(changeTimer);
		changeTimer = null;
		gameState = 'READY';
		setGameAreaRed();
		startStopButton.textContent = 'Начать игру';
		if (message) result.textContent = message;
	}

	function startGame() {
		if (gameState !== 'READY') return;
		gameState = 'WAITING';
		result.textContent = 'Приготовьтесь...';
		startStopButton.textContent = 'Остановить игру';

		// случайная задержка 2000..5000 ms
		const delay = Math.floor(Math.random() * 3000) + 2000;
		changeTimer = setTimeout(() => {
			gameState = 'CLICKABLE';
			setGameAreaGreen();
			greenTimestamp = performance.now();
			result.textContent = 'Жмите!';
			changeTimer = null;
		}, delay);
	}

	function stopGame() {
		resetToReady('Игра остановлена. Нажмите "Начать игру" чтобы начать снова.');
	}

	// Обработчик для кнопки запуска/остановки
	startStopButton.addEventListener('click', () => {
		if (gameState === 'READY') startGame();
		else stopGame();
	});

	// Обработчик клика по игровому полю
	gameArea.addEventListener('click', () => {
		if (gameState === 'CLICKABLE') {
			const rt = performance.now() - greenTimestamp;
			const rounded = Math.round(rt);
			result.textContent = `Время реакции: ${rounded} мс`;
			// после успешного замера сбрасываем игру
			resetToReady();
		} else if (gameState === 'WAITING') {
			// игрок нажал слишком рано
			clearTimeout(changeTimer);
			changeTimer = null;
			result.textContent = 'Слишком рано!';
			// возвращаем в начальное состояние
			resetToReady();
		} else {
			// READY — ничего не происходит, подсказка
			result.textContent = 'Нажмите "Начать игру" чтобы начать.';
		}
	});

	// Инициализация — убедимся, что интерфейс в корректном стартовом состоянии
	(function init() {
		setGameAreaRed();
		startStopButton.textContent = 'Начать игру';
		result.textContent = 'Нажмите "Начать игру" чтобы начать!';
	})();

})();

