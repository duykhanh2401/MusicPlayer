const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STOREAGE_KEY = 'DUYKHANH_PLAYER'

const heading = $('.header > h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const player = $('.player');
const playBtn = $('.btn-toggle-play')
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isTimeUpdate: true,
    config: JSON.parse(localStorage.getItem(PLAYER_STOREAGE_KEY)) || {},
    setConfig: function (key,value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STOREAGE_KEY,JSON.stringify(this.config));
    },
    songs: [
        {
            name: 'Trốn Tìm',
            singer: 'Đen, MTV',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'Lối nhỏ',
            singer: 'Đen, Phương Anh Đào',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'Đi Về Nhà',
            singer: 'Đen, JustaTee',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'Trời hôm nay nhiều mây cực!',
            singer: 'Đen',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            name: 'một triệu like',
            singer: 'Đen, Thành Đồng',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.jpg'
        },
        {
            name: 'Hai Triệu Năm',
            singer: 'Đen, Biên',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.jpg'
        },
        {
            name: 'Anh Đếch Cần Gì Nhiều Ngoài Em',
            singer: 'Đen, Thành Đồng, Vũ',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.jpg'
        },
        {
            name: 'Mười Năm (Lộn Xộn 3)',
            singer: 'Đen, Ngọc Linh',
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.jpg'
        },
        {
            name: 'Cảm ơn',
            singer: 'Đen, Biên',
            path: './assets/music/song9.mp3',
            image: './assets/img/song9.jpg'
        },
        {
            name: 'Đừng Gọi Anh Là Idol',
            singer: 'Đen, Lynk Lee',
            path: './assets/music/song10.mp3',
            image: './assets/img/song10.jpg'
        },
        {
            name: 'Ngày Khác Lạ',
            singer: 'Đen, Giang Phạm, Trile D',
            path: './assets/music/song11.mp3',
            image: './assets/img/song11.jpg'
        },
        {
            name: 'Đố em biết anh đang nghĩ gì',
            singer: 'Đen, JustaTee, Biên, Madihu',
            path: './assets/music/song12.mp3',
            image: './assets/img/song12.jpg'
        },
        {
            name: 'Bài Này Chill Phết',
            singer: 'Đen, Min',
            path: './assets/music/song13.mp3',
            image: './assets/img/song13.jpg'
        }
    ],
    
    definePropertises: function () {
        Object.defineProperty(this,'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div data-index = "${index}"class="song ${index === this.currentIndex ? 'active' : ''}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
             </div>
             </div>
        `
        })
        playlist.innerHTML = htmls.join('');
    },

    handleEvents: function () {
        const _this = this; // Lưu lại this của app
        // Xử lý scroll

        // Xử lý CD quay / dừng
        const cdThumbanimate = cdThumb.animate([
            {transform: 'rotate(360deg'}
        ],{
            duration: 10000,
            iterations: Infinity
        })

        cdThumbanimate.pause();
        const cdWith = cd.offsetWidth;
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCDWidth = cdWith - scrollTop;

            cd.style.width = newCDWidth > 0 ? newCDWidth + 'px' : 0;
            cd.style.opacity = newCDWidth/cdWith;
        }


        // Khi song được play
        audio.onplay = function() {
            player.classList.add('playing');
            _this.isPlaying = true;
        }

        audio.onpause = function() {
            player.classList.remove('playing');
            _this.isPlaying = false;
        }

        // Khi tiến độ bài hát thay đổi

        let checkOnmouseAndTouch = true;
        progress.onmousedown = function() {
            checkOnmouseAndTouch = false;
        }

        progress.ontouchstart = function() {
            checkOnmouseAndTouch = false;
        }

        // Khi bài hát được tua
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;

            checkOnmouseAndTouch = true;
        }
        
        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration && checkOnmouseAndTouch) {
                const progressPercent = audio.currentTime / audio.duration*100;
                progress.value = progressPercent;
            }
        }

        // Xử lý khi click play
        playBtn.onclick = function () {
            if(_this.isPlaying) {
                audio.pause();
                cdThumbanimate.pause();
            }else{
                audio.play();
                cdThumbanimate.play();
            }

        }

        // Khi next bài hát hát
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
                audio.play()
                cdThumbanimate.play();

            }else{
                _this.nextSong()
                audio.play()
                cdThumbanimate.play();
            }
        }

        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            }else {
                _this.prevSong()
                audio.play()
                cdThumbanimate.play();
            }
        }


        // Xử lý random bật tắt
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // Xử lý khi audio hết bài
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            }else {
                nextBtn.click();
            }
        }

        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);

        }

        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');

            if(songNode || e.target.closest('.option')) {
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong()
            
                    audio.play();
                }
            }
        }
    },
    
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;

        if ($('.song.active')) {
            $('.song.active').classList.remove('active');
        }
        const list = $$('.song');
        list.forEach((song) => {
            if (song.getAttribute('data-index') == this.currentIndex) {
              song.classList.add('active');
            }
        });
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
        this.scrollToActiveSong();
    },

    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
        this.scrollToActiveSong();
    },

    playRandomSong: function () {
        let oldIndex = this.currentIndex;
        do{
            this.currentIndex = Math.floor(Math.random() * this.songs.length)
        }while(this.currentIndex === oldIndex);
        this.loadCurrentSong();
        this.scrollToActiveSong();
    },

    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: `${this.currentIndex <= 3 ? 'end' : 'center'}`
            })
        },300)
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    start: function() {
        this.loadConfig();

        // Định nghĩa các thuộc tính cho Object
        this.definePropertises();

        // Lắng nghe và xử lý các sự kiện
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        // Render playlist
        this.render()

        repeatBtn.classList.toggle('active', this.isRepeat);
        randomBtn.classList.toggle('active', this.isRandom);
    }
}

app.start();