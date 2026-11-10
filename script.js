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

// Music and invitation entry: the entry-button tap is the user's gesture
// that allows browsers to start audio playback.
const invitationAudio = document.getElementById('backgroundMusic');
const musicButton = document.getElementById('musicToggle');
const musicButtonLabel = musicButton ? musicButton.querySelector('.music-label') : null;
const openingScreen = document.getElementById('welcomeScreen');
const openingButton = document.getElementById('enterInvitation');

function syncMusicButton(isPlaying) {
  if (!musicButton) return;
  musicButton.classList.toggle('is-playing', isPlaying);
  musicButton.setAttribute('aria-pressed', String(isPlaying));
  musicButton.setAttribute('aria-label', isPlaying ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى');
  if (musicButtonLabel) {
    musicButtonLabel.textContent = isPlaying ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى';
  }
}

if (invitationAudio) {
  invitationAudio.volume = 0.72;
  invitationAudio.load();
  invitationAudio.addEventListener('error', () => {
    if (musicButtonLabel) musicButtonLabel.textContent = 'ملف الموسيقى مش متاح';
    console.error('Audio file failed to load:', invitationAudio.currentSrc, invitationAudio.error);
  });
  invitationAudio.addEventListener('play', () => syncMusicButton(true));
  invitationAudio.addEventListener('pause', () => syncMusicButton(false));
  invitationAudio.addEventListener('ended', () => syncMusicButton(false));
}

if (openingScreen && openingButton) {
  document.body.classList.add('invitation-locked');

  openingButton.addEventListener('click', () => {
    // Call play immediately within the real click gesture (no preceding await).
    if (invitationAudio) {
      invitationAudio.currentTime = 0;
      const playback = invitationAudio.play();
      if (playback && typeof playback.then === 'function') {
        playback.then(() => syncMusicButton(true)).catch(() => {
          if (musicButtonLabel) musicButtonLabel.textContent = 'اضغطي لتشغيل الموسيقى';
        });
      }
    }

    openingScreen.classList.add('is-leaving');
    document.body.classList.remove('invitation-locked');
    window.setTimeout(() => openingScreen.remove(), 800);
  });
}

if (musicButton && invitationAudio) {
  musicButton.addEventListener('click', () => {
    if (invitationAudio.paused) {
      const playback = invitationAudio.play();
      if (playback && typeof playback.catch === 'function') {
        playback.catch(() => {
          if (musicButtonLabel) musicButtonLabel.textContent = 'حاولي مرة أخرى';
        });
      }
    } else {
      invitationAudio.pause();
    }
  });
}
