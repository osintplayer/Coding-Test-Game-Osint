// "Светофорный Рефлекс" — логика игры
(function () {
    const gameArea = document.getElementById('gameArea');
    const startStopButton = document.getElementById('startStopButton');
    const result = document.getElementById('result');
    const reactionImage = document.getElementById('reactionImage');	// Состояния игры: READY - готова к запуску (красный),
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
// "Светофорный Рефлекс" — логика игры
(function () {
    const gameArea = document.getElementById('gameArea');
    const startStopButton = document.getElementById('startStopButton');
    const result = document.getElementById('result');
    const reactionImage = document.getElementById('reactionImage');

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

    function showReactionImage(reactionTime) {
        reactionImage.innerHTML = ''; // очищаем предыдущую картинку
        const img = document.createElement('img');
        
        if (reactionTime <= 400) {
            img.src = 'https://avatars.mds.yandex.net/i?id=94fb857c1f195071cb88f7a1b34aa0834c7d7b7e-4884508-images-thumbs&n=13';
            result.textContent = `ВРЕМЯ: ${reactionTime} мс — ПО СКОРОСТИ ТЫ ДАННЫЙ ПЁС! 🚀`;
        } else {
            img.src = 'https://avatars.mds.yandex.net/i?id=bfb1ccea95d220098a247c522c9c57fec5cf7cf8-12488046-images-thumbs&n=13';
            result.textContent = `ВРЕМЯ: ${reactionTime} мс — ТЫ ПЕС ХОХОД 🐌`;
        }
        
        reactionImage.appendChild(img);
        reactionImage.style.display = 'block';
    }

    function resetToReady(message) {
        clearTimeout(changeTimer);
        changeTimer = null;
        gameState = 'READY';
        setGameAreaRed();
        startStopButton.textContent = 'Начать игру';
        if (message) result.textContent = message;
        reactionImage.style.display = 'none'; // скрываем картинку
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
            showReactionImage(rounded);
            // после успешного замера сбрасываем игру через небольшую паузу
            setTimeout(() => resetToReady(), 2000);
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
    function showReactionImage(reactionTime) {
        reactionImage.innerHTML = ''; // очищаем предыдущую картинку
        const img = document.createElement('img');
        
        if (reactionTime <= 400) {
            img.src = 'https://avatars.mds.yandex.net/i?id=94fb857c1f195071cb88f7a1b34aa0834c7d7b7e-4884508-images-thumbs&n=13';
            result.textContent = `ВРЕМЯ: ${reactionTime} мс — ПО СКОРОСТИ ТЫ ДАННЫЙ ПЁС! 🚀`;
        } else {
            img.src = 'https://avatars.mds.yandex.net/i?id=bfb1ccea95d220098a247c522c9c57fec5cf7cf8-12488046-images-thumbs&n=13';
            result.textContent = `ВРЕМЯ: ${reactionTime} мс — ТЫ ПЕС ХОХОД 🐌`;
        }
        
        reactionImage.appendChild(img);
        reactionImage.style.display = 'block';
    }

    function resetToReady(message) {
        clearTimeout(changeTimer);
        changeTimer = null;
        gameState = 'READY';
        setGameAreaRed();
        startStopButton.textContent = 'Начать игру';
        if (message) result.textContent = message;
        reactionImage.style.display = 'none'; // скрываем картинку
    }	function startGame() {
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
			showReactionImage(rounded);
			// после успешного замера сбрасываем игру через небольшую паузу
			setTimeout(() => resetToReady(), 2000);
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

