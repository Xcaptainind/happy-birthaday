
var radius = 240; // how big of the radius
var autoRotate = true; // auto rotate or not
var rotateSpeed = -60; // unit: seconds/360 degrees
var imgWidth = 120; // width of images (unit: px)
var imgHeight = 170; // height of images (unit: px)

// Link of background music - using 29.mp4 audio
var bgMusicURL = '29.mp4';
var bgMusicControls = false; // No UI music control - music plays non-stop

// Performance optimization flags
let isAnimating = false;
let animationFrameId = null;
let audioPlayed = false;

// ===================== start =======================
// animation start after 1000 miliseconds
setTimeout(init, 1000);

var odrag = document.getElementById('drag-container');
var ospin = document.getElementById('spin-container');
var aImg = ospin.getElementsByTagName('img');
var aVid = ospin.getElementsByTagName('video');
var aEle = [...aImg, ...aVid]; // combine 2 arrays

// Size of images
ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";

// Size of ground - depend on radius
var ground = document.getElementById('ground');
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

function init(delayTime) {
  for (var i = 0; i < aEle.length; i++) {
    aEle[i].style.transform = "rotateY(" + (i * (360 / aEle.length)) + "deg) translateZ(" + radius + "px)";
    aEle[i].style.transition = "transform 1s";
    aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
  }
}

function applyTranform(obj) {
  // Constrain the angle of camera (between 0 and 180)
  if(tY > 180) tY = 180;
  if(tY < 0) tY = 0;

  // Apply the angle
  obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";
}

function playSpin(yes) {
  ospin.style.animationPlayState = (yes?'running':'paused');
}

var sX, sY, nX, nY, desX = 0,
    desY = 0,
    tX = 0,
    tY = 10;

// auto spin
if (autoRotate) {
  var animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');
  ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
}

// add background music using 29.mp4 audio
if (bgMusicURL && !audioPlayed) {
  document.getElementById('music-container').innerHTML += `
<audio id="bg-music" src="${bgMusicURL}" preload="auto" loop>    
<p>If you are reading this, it is because your browser does not support the audio element.</p>
</audio>
`;

  // Handle autoplay restrictions
  const audio = document.getElementById('bg-music');
  if (audio) {
    // Try to play on user interaction
    const playMusic = () => {
      if (!audioPlayed) {
        audio.play().catch(e => console.log('Audio play failed:', e));
        audioPlayed = true;
      }
    };
    
    // Try to play on any user interaction
    document.addEventListener('click', playMusic, { once: true });
    document.addEventListener('touchstart', playMusic, { once: true });
    document.addEventListener('keydown', playMusic, { once: true });
    
    // Also try to play immediately
    setTimeout(() => {
      if (!audioPlayed) {
        audio.play().catch(e => console.log('Audio autoplay failed:', e));
        audioPlayed = true;
      }
    }, 1000);
  }
}

// ===================== Message Functions =======================
function showMessage() {
  const message = document.getElementById('personalMessage');
  if (message) {
    message.style.display = 'block';
    // Small delay to ensure display is set before adding show class
    setTimeout(() => {
      message.classList.add('show');
      // Add confetti burst when message opens
      createConfettiBurst(window.innerWidth / 2, window.innerHeight / 2);
    }, 10);
  }
}

function closeMessage() {
  const message = document.getElementById('personalMessage');
  if (message) {
    message.classList.remove('show');
    // Add a small delay to ensure smooth transition
    setTimeout(() => {
      message.style.display = 'none';
    }, 300);
  }
}

// Close message when clicking outside
document.addEventListener('click', function(e) {
  const message = document.getElementById('personalMessage');
  const evildeadMessage = document.getElementById('evildeadMessage');
  const trigger = document.querySelector('.message-trigger');
  
  if (message && message.classList.contains('show')) {
    if (!message.contains(e.target) && !trigger.contains(e.target)) {
      closeMessage();
    }
  }
  
  if (evildeadMessage && evildeadMessage.classList.contains('show')) {
    if (!evildeadMessage.contains(e.target) && !trigger.contains(e.target)) {
      closeEvildeadMessage();
    }
  }
});

// Close message with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const message = document.getElementById('personalMessage');
    const evildeadMessage = document.getElementById('evildeadMessage');
    if (message && message.classList.contains('show')) {
      closeMessage();
    }
    if (evildeadMessage && evildeadMessage.classList.contains('show')) {
      closeEvildeadMessage();
    }
  }
});

// ===================== Evildead Message Functions =======================
function showEvildeadMessage() {
  const message = document.getElementById('evildeadMessage');
  if (message) {
    message.style.display = 'block';
    // Small delay to ensure display is set before adding show class
    setTimeout(() => {
      message.classList.add('show');
      // Add confetti burst when message opens
      createConfettiBurst(window.innerWidth / 2, window.innerHeight / 2);
    }, 10);
  }
}

function closeEvildeadMessage() {
  const message = document.getElementById('evildeadMessage');
  if (message) {
    message.classList.remove('show');
    // Add a small delay to ensure smooth transition
    setTimeout(() => {
      message.style.display = 'none';
    }, 300);
  }
}

// setup events
document.onpointerdown = function (e) {
  clearInterval(odrag.timer);
  e = e || window.event;
  var sX = e.clientX,
      sY = e.clientY;

  this.onpointermove = function (e) {
    e = e || window.event;
    var nX = e.clientX,
        nY = e.clientY;
    desX = nX - sX;
    desY = nY - sY;
    tX += desX * 0.1;
    tY += desY * 0.1;
    applyTranform(odrag);
    sX = nX;
    sY = nY;
  };

  this.onpointerup = function (e) {
    odrag.timer = setInterval(function () {
      desX *= 0.95;
      desY *= 0.95;
      tX += desX * 0.1;
      tY += desY * 0.1;
      applyTranform(odrag);
      playSpin(false);
      if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
        clearInterval(odrag.timer);
        playSpin(true);
      }
    }, 17);
    this.onpointermove = this.onpointerup = null;
  };

  return false;
};

document.onmousewheel = function(e) {
  e = e || window.event;
  var d = e.wheelDelta / 20 || -e.detail;
  radius += d;
  init(1);
};

// ===================== Optimized Confetti Animation =======================
class Confetti {
    constructor() {
        this.canvas = document.getElementById('confetti');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.colors = ['#ff6b6b', '#ffd93d', '#6bcf7f', '#4d9de0', '#ff8e8e', '#ffb366'];
        this.isActive = false;
        
        this.init();
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.createParticles();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        // Reduced particle count for better performance
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height - this.canvas.height,
                vx: (Math.random() - 0.5) * 1,
                vy: Math.random() * 1 + 0.3,
                size: Math.random() * 2 + 0.5,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 0.5
            });
        }
    }
    
    start() {
        if (!this.isActive) {
            this.isActive = true;
            this.animate();
        }
    }
    
    stop() {
        this.isActive = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    }
    
    animate() {
        if (!this.isActive) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.rotation += particle.rotationSpeed;
            
            if (particle.y > this.canvas.height) {
                particle.y = -particle.size;
                particle.x = Math.random() * this.canvas.width;
            }
            
            if (particle.x > this.canvas.width) {
                particle.x = -particle.size;
            }
            
            if (particle.x < -particle.size) {
                particle.x = this.canvas.width;
            }
            
            this.ctx.save();
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation * Math.PI / 180);
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
            this.ctx.restore();
        });
        
        animationFrameId = requestAnimationFrame(() => this.animate());
    }
}

// ===================== Optimized Fireworks Animation =======================
class Fireworks {
    constructor() {
        this.canvas = document.getElementById('fireworks');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.colors = ['#ff6b6b', '#ffd93d', '#6bcf7f', '#4d9de0', '#a855f7', '#f97316'];
        this.isActive = false;
        
        this.init();
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createFirework(x, y) {
        if (this.particles.length > 200) return; // Limit total particles
        
        const particleCount = 40; // Reduced from 80
        const colors = this.colors;
        
        // Create single firework burst
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 2 + Math.random() * 1.5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            this.particles.push({
                x: x || Math.random() * this.canvas.width,
                y: y || Math.random() * this.canvas.height,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                size: Math.random() * 2 + 0.5,
                color: color,
                life: 60,
                maxLife: 60
            });
        }
        
        // Start animation if not already running
        if (!this.isActive) {
            this.start();
        }
    }
    
    start() {
        if (!this.isActive) {
            this.isActive = true;
            this.animate();
        }
    }
    
    stop() {
        this.isActive = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    }
    
    animate() {
        if (!this.isActive) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.08; // Reduced gravity
            particle.life--;
            
            if (particle.life > 0) {
                const alpha = particle.life / particle.maxLife;
                this.ctx.save();
                this.ctx.globalAlpha = alpha;
                this.ctx.fillStyle = particle.color;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            }
        });
        
        // Remove dead particles
        this.particles = this.particles.filter(particle => particle.life > 0);
        
        // Stop animation if no particles
        if (this.particles.length === 0) {
            this.stop();
        } else {
            animationFrameId = requestAnimationFrame(() => this.animate());
        }
    }
}

// ===================== Utility Functions =======================
function createFirework(x, y) {
    if (window.fireworks) {
        window.fireworks.createFirework(x, y);
    }
}

function createConfettiBurst(x, y) {
    // Create single burst container for better performance
    const burstContainer = document.createElement('div');
    const burstX = x || Math.random() * window.innerWidth;
    const burstY = y || Math.random() * window.innerHeight;
    
    burstContainer.style.cssText = `
        position: fixed;
        left: ${burstX}px;
        top: ${burstY}px;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 1000;
    `;
    
    // Reduced particle count
    for (let i = 0; i < 8; i++) {
        const confetti = document.createElement('div');
        confetti.innerHTML = ['🎈', '🎁', '🎊', '🎉', '✨', '🍰', '🎂', '🎆'][Math.floor(Math.random() * 8)];
        confetti.style.cssText = `
            position: absolute;
            font-size: 16px;
            animation: burstOut 1.5s ease-out forwards;
            animation-delay: ${Math.random() * 0.3}s;
        `;
        burstContainer.appendChild(confetti);
    }
    
    document.body.appendChild(burstContainer);
    
    // Cleanup after animation
    setTimeout(() => {
        if (document.body.contains(burstContainer)) {
            document.body.removeChild(burstContainer);
        }
    }, 1500);
}

function createSparkles(x, y) {
    // Reduced sparkle count
    const sparkleCount = 12;
    
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = ['✨', '💫', '⭐', '🌟', '💎'][Math.floor(Math.random() * 5)];
        
        const sparkleX = x || Math.random() * window.innerWidth;
        const sparkleY = y || Math.random() * window.innerHeight;
        
        sparkle.style.cssText = `
            position: fixed;
            left: ${sparkleX}px;
            top: ${sparkleY}px;
            font-size: 20px;
            pointer-events: none;
            z-index: 1000;
            animation: sparkleFade 1.2s ease-out forwards;
            animation-delay: ${Math.random() * 0.3}s;
        `;
        
        document.body.appendChild(sparkle);
        
        // Cleanup after animation
        setTimeout(() => {
            if (document.body.contains(sparkle)) {
                document.body.removeChild(sparkle);
            }
        }, 1200);
    }
}

// Add burst animation CSS
const burstStyle = document.createElement('style');
burstStyle.textContent = `
    @keyframes burstOut {
        0% {
            transform: translate(0, 0) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(1);
            opacity: 0;
        }
    }
    
    @keyframes sparkleFade {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        50% {
            transform: scale(1.5) rotate(180deg);
            opacity: 1;
        }
        100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(burstStyle);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Hide all content initially
    const allContent = document.querySelectorAll('body > *:not(#loadingScreen)');
    allContent.forEach(element => {
        element.style.opacity = '0';
        element.style.transition = 'opacity 1s ease';
    });
    
    // Loading progress simulation
    let loadingProgress = 0;
    const progressBar = document.querySelector('.progress-bar');
    const loadingText = document.querySelector('.loading-text');
    
    const updateProgress = () => {
        loadingProgress += Math.random() * 15 + 5;
        if (loadingProgress > 100) loadingProgress = 100;
        
        if (progressBar) {
            progressBar.style.width = loadingProgress + '%';
        }
        
        if (loadingProgress < 100) {
            setTimeout(updateProgress, 200);
        } else {
            // Everything loaded, show the page
            setTimeout(() => {
                showPage();
            }, 500);
        }
    };
    
    const showPage = () => {
        // Fade out loading screen
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
        }
        
        // Show all content with fade in effect
        allContent.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
            }, index * 100);
        });
        
        // Start all animations after content is visible
        setTimeout(() => {
            initializeAnimations();
        }, 1000);
    };
    
    const initializeAnimations = () => {
        // Start confetti animation
        window.confetti = new Confetti();
        
        // Start fireworks animation
        window.fireworks = new Fireworks();
        
        // Handle video autoplay - ensure it's muted
        const video = document.querySelector('video');
        if (video) {
            // Ensure video is muted
            video.muted = true;
            
            video.addEventListener('loadedmetadata', () => {
                video.play().catch(e => console.log('Video autoplay failed:', e));
            });
            
            // Try to play on user interaction
            const playVideo = () => {
                video.muted = true; // Ensure it stays muted
                video.play().catch(e => console.log('Video play failed:', e));
            };
            
            document.addEventListener('click', playVideo, { once: true });
            document.addEventListener('touchstart', playVideo, { once: true });
        }
        
        // Start automatic animations with different time intervals
        startAutomaticAnimations();
        
        // Remove loading screen after everything is ready
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.remove();
            }
        }, 2000);
    };
    
    const startAutomaticAnimations = () => {
        // Animation intervals (in milliseconds) - increased for better performance
        const intervals = {
            fireworks: 12000,    // Every 12 seconds
            confetti: 18000,     // Every 18 seconds
            sparkles: 10000      // Every 10 seconds
        };
        
        // Fireworks animation
        setInterval(() => {
            // Create single firework at random position
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            createFirework(x, y);
        }, intervals.fireworks);
        
        // Confetti animation
        setInterval(() => {
            createConfettiBurst(0, 0);
        }, intervals.confetti);
        
        // Sparkles animation
        setInterval(() => {
            createSparkles(0, 0);
        }, intervals.sparkles);
        
        // Initial burst of animations after page loads
        setTimeout(() => {
            // Initial fireworks
            setTimeout(() => createFirework(window.innerWidth * 0.3, window.innerHeight * 0.4), 1000);
            setTimeout(() => createFirework(window.innerWidth * 0.7, window.innerHeight * 0.6), 2000);
            
            // Initial confetti
            setTimeout(() => createConfettiBurst(0, 0), 3000);
            
            // Initial sparkles
            setTimeout(() => createSparkles(0, 0), 4000);
        }, 2000);
    };
    
    // Start loading progress
    setTimeout(updateProgress, 500);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.confetti) {
        window.confetti.stop();
    }
    if (window.fireworks) {
        window.fireworks.stop();
    }
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
});
