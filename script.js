// Логика игры "Светофорный Рефлекс" с мемными картинками "нос нос"
(function () {
  const gameArea = document.getElementById('gameArea');
  const startStopButton = document.getElementById('startStopButton');
  const result = document.getElementById('result');
  const reactionContainer = document.getElementById('reactionContainer');

  // состояния: READY / WAITING / CLICKABLE
  let gameState = 'READY';
  let changeTimer = null;
  let greenTimestamp = 0;

  function cssVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name);
    return (v || fallback || '').trim() || fallback;
  }

  function setGameAreaRed() {
    gameArea.style.backgroundColor = cssVar('--game-red', '#d62828');
  }
  function setGameAreaGreen() {
    gameArea.style.backgroundColor = '#2ecc71';
  }

  // Очистка изображений и скрытие контейнера
  function hideReaction() {
    reactionContainer.innerHTML = '';
    reactionContainer.style.display = 'none';
  }

  // Показ изображения(й) и сообщения в зависимости от времени реакции (ms)
  function showReaction(rt) {
    hideReaction();
    // URLs изображений (те, что ты прислал раньше)
    const imgQuick = 'https://avatars.mds.yandex.net/i?id=eed15b67527cd1ca0ba107c6c0c2e66e54d48897-6496990-images-thumbs&n=13';
    const imgMid = 'https://avatars.mds.yandex.net/i?id=3bf7ff47ce639d426e5571f382c90079f2b67132-5277757-images-thumbs&n=13';
    const imgSlow = 'https://avatars.mds.yandex.net/i?id=24d8807bd04ba051807a83c93fee1ce2-5234741-images-thumbs&n=13';
    const imgExtra = 'https://avatars.mds.yandex.net/i?id=74741af1d116e0b13395ac58980309eb4f4dc56e-5607498-images-thumbs&n=13';

    // Убираем лишние крайние значения: показываем нужный диапазон
    if (rt <= 100) {
      // очень быстро
      result.textContent = `ВРЕМЯ: ${rt} мс — Поздравляю, вы украли все деньги с кассы! 🎉`;
      const wrap = document.createElement('div');
      wrap.className = 'single';
      const img = document.createElement('img');
      img.src = imgQuick;
      img.alt = 'Супербыстрый Нос Нос';
      wrap.appendChild(img);
      reactionContainer.appendChild(wrap);
    } else if (rt >= 200 && rt <= 500) {
      // средняя скорость (200-500)
      result.textContent = `ВРЕМЯ: ${rt} мс — Поздравляю, вы украли 10кг насвая! 🥳`;
      const wrap = document.createElement('div');
      wrap.className = 'single';
      const img = document.createElement('img');
      img.src = imgMid;
      img.alt = 'Носики сбор';
      wrap.appendChild(img);
      reactionContainer.appendChild(wrap);
    } else if (rt > 500 && rt <= 10000) {
      // медленно — показываем две картинки рядом
      result.textContent = `ВРЕМЯ: ${rt} мс — К сожалению, вы не успели украсть насвай — попробуйте ещё раз! 😅`;
      const pair = document.createElement('div');
      pair.className = 'pair';
      const a = document.createElement('img');
      a.src = imgSlow;
      a.alt = 'Мем 1';
      const b = document.createElement('img');
      b.src = imgExtra;
      b.alt = 'Мем 2';
      pair.appendChild(a);
      pair.appendChild(b);
      reactionContainer.appendChild(pair);
    } else {
      // другой случай: просто показать время
      result.textContent = `ВРЕМЯ: ${rt} мс`;
      const wrap = document.createElement('div');
      wrap.className = 'single';
      const img = document.createElement('img');
      img.src = imgMid;
      img.alt = 'Носик';
      wrap.appendChild(img);
      reactionContainer.appendChild(wrap);
    }

    // Показ контейнера
    reactionContainer.style.display = 'block';
  }

  function resetToReady(message) {
    clearTimeout(changeTimer);
    changeTimer = null;
    gameState = 'READY';
    setGameAreaRed();
    startStopButton.textContent = 'Начать игру';
    if (message) result.textContent = message;
    hideReaction();
  }

  function startGame() {
    if (gameState !== 'READY') return;
    gameState = 'WAITING';
    result.textContent = 'Приготовьтесь...';
    startStopButton.textContent = 'Остановить игру';

    const delay = Math.floor(Math.random() * 3000) + 2000; // 2000..5000 ms
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

  // Обработчики
  startStopButton.addEventListener('click', () => {
    if (gameState === 'READY') startGame();
    else stopGame();
  });

  gameArea.addEventListener('click', () => {
    if (gameState === 'CLICKABLE') {
      const rt = Math.round(performance.now() - greenTimestamp);
      showReaction(rt);
      // после показа результата — немного подождём и сбросим игру
      setTimeout(() => {
        resetToReady();
      }, 2500);
    } else if (gameState === 'WAITING') {
      // слишком рано
      clearTimeout(changeTimer);
      changeTimer = null;
      result.textContent = 'Слишком рано!';
      resetToReady();
    } else {
      result.textContent = 'Нажмите "Начать игру" чтобы начать.';
    }
  });

  // Инициализация
  (function init() {
    setGameAreaRed();
    startStopButton.textContent = 'Начать игру';
    result.textContent = 'Нажмите "Начать игру" чтобы начать!';
    hideReaction();
  })();
})();