(function() {
  // ===== Card open/close logic =====
  function $(id) { return document.getElementById(id); }

  var card   = $('card'),
      openB  = $('open'),
      closeB = $('close'),
      timer  = null;

  // ===== Background Audio =====
  var bgAudio = new Audio('audio.mp3');
  bgAudio.loop = true;
  var isAudioPlaying = false;

  openB.addEventListener('click', function () {
    // Start audio on first open (bypasses browser autoplay restrictions)
    if (!isAudioPlaying) {
      bgAudio.play().catch(function(e) { console.log('Audio play failed:', e); });
      isAudioPlaying = true;
    }

    card.setAttribute('class', 'open-half');
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      card.setAttribute('class', 'open-fully');
      timer = null;
    }, 1000);
  });

  closeB.addEventListener('click', function () {
    card.setAttribute('class', 'close-half');
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      card.setAttribute('class', '');
      timer = null;
    }, 1000);
  });

  // ===== Floating Hearts Canvas =====
  var canvas = $('hearts-canvas');
  var ctx    = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  var hearts = [];
  var HEART_COUNT = 28;

  var colors = [
    'rgba(255, 100, 180, ',
    'rgba(255, 50,  150, ',
    'rgba(220,  0,  100, ',
    'rgba(255, 180, 220, ',
    'rgba(200,  50, 180, ',
    'rgba(255, 215,   0, ',
  ];

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  function createHeart() {
    return {
      x:     randomBetween(0, canvas.width),
      y:     canvas.height + randomBetween(20, 80),
      size:  randomBetween(10, 28),
      speed: randomBetween(0.4, 1.4),
      drift: randomBetween(-0.5, 0.5),
      opacity: randomBetween(0.4, 0.9),
      color: colors[Math.floor(Math.random() * colors.length)],
      wobble: randomBetween(0, Math.PI * 2),
      wobbleSpeed: randomBetween(0.02, 0.06)
    };
  }

  for (var i = 0; i < HEART_COUNT; i++) {
    var h = createHeart();
    h.y = randomBetween(0, canvas.height); // scatter initially
    hearts.push(h);
  }

  function drawHeart(ctx, x, y, size, color, opacity) {
    ctx.save();
    ctx.fillStyle = color + opacity + ')';
    ctx.shadowColor = color + '0.6)';
    ctx.shadowBlur  = 12;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x, y - size * 0.3, x - size, y - size * 0.3, x - size, y - size * 0.7);
    ctx.bezierCurveTo(x - size, y - size * 1.2, x, y - size * 1.1, x, y - size * 0.7);
    ctx.bezierCurveTo(x, y - size * 1.1, x + size, y - size * 1.2, x + size, y - size * 0.7);
    ctx.bezierCurveTo(x + size, y - size * 0.3, x, y - size * 0.3, x, y);
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < hearts.length; i++) {
      var h = hearts[i];
      h.wobble += h.wobbleSpeed;
      h.x += h.drift + Math.sin(h.wobble) * 0.5;
      h.y -= h.speed;

      drawHeart(ctx, h.x, h.y, h.size, h.color, h.opacity);

      if (h.y < -50) {
        hearts[i] = createHeart();
      }
    }

    requestAnimationFrame(animate);
  }

  animate();

  // ===== Twinkling stars =====
  var STAR_COUNT = 60;
  for (var s = 0; s < STAR_COUNT; s++) {
    var star = document.createElement('div');
    star.className = 'star';
    star.style.left   = Math.random() * 100 + 'vw';
    star.style.top    = Math.random() * 100 + 'vh';
    star.style.animationDelay    = (Math.random() * 4) + 's';
    star.style.animationDuration = (2 + Math.random() * 3) + 's';
    star.style.width  = (1 + Math.random() * 2) + 'px';
    star.style.height = star.style.width;
    document.body.appendChild(star);
  }

}());
