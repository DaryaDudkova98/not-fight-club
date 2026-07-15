(function () {
        const avatarFiles = ['avatar1.png', 'avatar2.jpg', 'avatar3.jpg', 'default.jpg'];
        const AVATAR_PATH = 'img/avatars/';

        const avatarWrapper = document.getElementById('avatarWrapper');
        const avatarImg = avatarWrapper.querySelector('.img-charachter');
        const modalOverlay = document.getElementById('avatarModal');
        const avatarGrid = document.getElementById('avatarGrid');
        const modalCloseBtn = document.getElementById('modalCloseBtn');

        function getCurrentAvatar() {
          return localStorage.getItem('selectedAvatar') || AVATAR_PATH + 'default.jpg';
        }

        function setAvatar(src) {
          localStorage.setItem('selectedAvatar', src);
          avatarImg.src = src;
          closeModal();
        }

        function closeModal() {
          modalOverlay.classList.remove('active');
          document.body.style.overflow = '';
        }

        function openModal() {
          modalOverlay.classList.add('active');
          document.body.style.overflow = 'hidden';
          renderAvatarGrid();
        }

        function renderAvatarGrid() {
          const currentSrc = getCurrentAvatar();
          avatarGrid.innerHTML = '';
          avatarFiles.forEach((file) => {
            const src = AVATAR_PATH + file;
            const option = document.createElement('div');
            option.className = 'avatar-option';
            if (src === currentSrc) {
              option.classList.add('selected');
            }
            option.dataset.src = src;

            const img = document.createElement('img');
            img.src = src;
            img.alt = file;
            img.onerror = function() {
              this.src = AVATAR_PATH + 'default.jpg';
            };

            const checkOverlay = document.createElement('div');
            checkOverlay.className = 'check-overlay';
            checkOverlay.innerHTML = '<i class="fas fa-check-circle"></i>';

            option.appendChild(img);
            option.appendChild(checkOverlay);

            option.addEventListener('click', function (e) {
              e.stopPropagation();
              const selectedSrc = this.dataset.src;
              setAvatar(selectedSrc);
              document.querySelectorAll('.avatar-option').forEach((el) => {
                el.classList.remove('selected');
              });
              this.classList.add('selected');
            });

            avatarGrid.appendChild(option);
          });
        }

        avatarWrapper.addEventListener('click', openModal);
        modalCloseBtn.addEventListener('click', closeModal);

        modalOverlay.addEventListener('click', function (e) {
          if (e.target === this) {
            closeModal();
          }
        });

        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
          }
        });

        function initAvatar() {
          const saved = getCurrentAvatar();
          avatarImg.src = saved;
        }

        initAvatar();
      })();