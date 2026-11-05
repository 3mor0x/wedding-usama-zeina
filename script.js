const firebaseConfig = {
    databaseURL: "https://wedding-apps-cc913-default-rtdb.firebaseio.com/"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const wishesRef = database.ref('wishes/usama_zeina');

const audio = document.getElementById('bg-music');
const disk = document.getElementById('musicDisk');
let isAudioPlaying = false;

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();

    wishesRef.on('child_added', (snapshot) => {
        const wish = snapshot.val();
        renderWish(wish);
    });
});

function openInvitation() {
    document.getElementById('gatewayScreen').classList.add('hidden');
    audio.play().then(() => {
        isAudioPlaying = true;
        disk.classList.add('disk-spinning');
        disk.innerText = "🔊";
    }).catch(err => {
        console.log("Audio autoplay restricted", err);
    });
}

function toggleAudio() {
    if (isAudioPlaying) {
        audio.pause();
        isAudioPlaying = false;
        disk.classList.remove('disk-spinning');
        disk.innerText = "🎵";
    } else {
        audio.play().then(() => {
            isAudioPlaying = true;
            disk.classList.add('disk-spinning');
            disk.innerText = "🔊";
        });
    }
}

// العداد التنازلي: 4 ديسمبر 2026 الساعة 8:00 مساءً
const weddingTimestamp = new Date('December 4, 2026 20:00:00').getTime();

setInterval(() => {
    const now = new Date().getTime();
    const distance = weddingTimestamp - now;

    if (distance > 0) {
        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = String(d).padStart(2, '0');
        document.getElementById('hours').innerText = String(h).padStart(2, '0');
        document.getElementById('minutes').innerText = String(m).padStart(2, '0');
        document.getElementById('seconds').innerText = String(s).padStart(2, '0');
    } else {
        document.getElementById('days').innerText = "00";
        document.getElementById('hours').innerText = "00";
        document.getElementById('minutes').innerText = "00";
        document.getElementById('seconds').innerText = "00";
    }
}, 1000);

function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 100;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
}

function addWish() {
    const nameInput = document.getElementById('guestName');
    const msgInput = document.getElementById('guestMessage');
    const name = nameInput.value.trim();
    const msg = msgInput.value.trim();

    if (name && msg) {
        wishesRef.push({
            name: name,
            msg: msg,
            timestamp: Date.now()
        });
        nameInput.value = '';
        msgInput.value = '';
    }
}

function renderWish(wish) {
    const feed = document.getElementById('wishesFeed');
    if (!feed) return;

    const card = document.createElement('div');
    card.className = 'wish-single-card';
    card.innerHTML = `
        <div class="wish-user-name">${wish.name}</div>
        <div class="wish-msg-text">"${wish.msg}"</div>
    `;
    feed.prepend(card);
}