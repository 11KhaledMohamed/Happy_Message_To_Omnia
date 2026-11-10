document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const lightbox = document.getElementById('lightbox');
const lightboxImage = lightbox.querySelector('img');
document.querySelectorAll('.photo-open').forEach((button) => {
  button.addEventListener('click', () => {
    lightboxImage.src = button.querySelector('img').src;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});
function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.src = '';
}
lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});


// Background music: browsers require a visitor interaction before audio can play.
const music = document.getElementById('backgroundMusic');
const musicToggle = document.getElementById('musicToggle');
if (music && musicToggle) {
  musicToggle.addEventListener('click', async () => {
    if (music.paused) {
      try {
        await music.play();
        musicToggle.classList.add('is-playing');
        musicToggle.setAttribute('aria-pressed', 'true');
        musicToggle.setAttribute('aria-label', 'إيقاف الموسيقى');
        musicToggle.querySelector('.music-label').textContent = 'إيقاف الموسيقى';
      } catch (error) {
        musicToggle.querySelector('.music-label').textContent = 'حاول التشغيل مرة أخرى';
      }
    } else {
      music.pause();
      musicToggle.classList.remove('is-playing');
      musicToggle.setAttribute('aria-pressed', 'false');
      musicToggle.setAttribute('aria-label', 'تشغيل الموسيقى');
      musicToggle.querySelector('.music-label').textContent = 'تشغيل الموسيقى';
    }
  });
}


// Opening screen: the visitor's tap both enters the invitation and starts the music.
const welcomeScreen = document.getElementById('welcomeScreen');
const enterInvitation = document.getElementById('enterInvitation');
const backgroundMusic = document.getElementById('backgroundMusic');
const musicToggleButton = document.getElementById('musicToggle');

if (welcomeScreen && enterInvitation) {
  document.body.classList.add('invitation-locked');

  enterInvitation.addEventListener('click', async () => {
    if (backgroundMusic) {
      try {
        await backgroundMusic.play();
        if (musicToggleButton) {
          musicToggleButton.classList.add('is-playing');
          musicToggleButton.setAttribute('aria-pressed', 'true');
          musicToggleButton.setAttribute('aria-label', 'إيقاف الموسيقى');
          const musicLabel = musicToggleButton.querySelector('.music-label');
          if (musicLabel) musicLabel.textContent = 'إيقاف الموسيقى';
        }
      } catch (error) {
        // The invitation still opens if the browser or device blocks audio.
      }
    }

    welcomeScreen.classList.add('is-leaving');
    document.body.classList.remove('invitation-locked');
    window.setTimeout(() => welcomeScreen.remove(), 800);
  });
}
