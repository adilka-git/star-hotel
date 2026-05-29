const rooms = [
  {
    title: 'Стандартный',
    type: 'standard',
    desc: 'Уютный номер с двуспальной кроватью, ванной комнатой и видом на город.',
    price: 'от 5 000 ₸ / ночь',
    priceNum: 5000,
    img: 'standard.jpg',
    alt: 'Стандартный номер',
  },
  {
    title: 'Люкс',
    type: 'suite',
    desc: 'Роскошный номер с гостиной, джакузи и персональным обслуживанием.',
    price: 'от 18 000 ₸ / ночь',
    priceNum: 18000,
    img: 'suite.jpg',
    alt: 'Номер люкс',
  },
];

const amenities = [
  { icon: '📶', name: 'Бесплатный Wi-Fi' },
  { icon: '🏊', name: 'Бассейн' },
  { icon: '🍽️', name: 'Ресторан' },
  { icon: '🅿️', name: 'Парковка' },
];

const isRoot = !window.location.pathname.includes('/html/');
const imgBase = isRoot ? 'images/' : '../images/';
const roomLink = isRoot ? 'html/reservation.html' : 'reservation.html';

function renderRooms(data) {
  const grid = document.getElementById('rooms-grid');
  const empty = document.getElementById('rooms-empty');
  if (!grid) return;

  const list = data !== undefined ? data : rooms;

  grid.innerHTML = '';

  if (empty) {
    empty.style.display = list.length === 0 ? 'block' : 'none';
  }

  list.forEach(function (room) {
    const article = document.createElement('article');
    article.classList.add('card');

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('card__image');

    const img = document.createElement('img');
    img.src = imgBase + room.img;
    img.alt = room.alt;
    imageDiv.appendChild(img);

    const bodyDiv = document.createElement('div');
    bodyDiv.classList.add('card__body');

    const title = document.createElement('h3');
    title.classList.add('card__title');
    title.textContent = room.title;

    const desc = document.createElement('p');
    desc.classList.add('card__desc');
    desc.textContent = room.desc;

    const price = document.createElement('p');
    price.classList.add('card__price');
    price.textContent = room.price;

    const btn = document.createElement('a');
    btn.classList.add('card__btn');
    btn.href = roomLink;
    btn.textContent = isRoot ? 'Подробнее' : 'Забронировать';

    bodyDiv.appendChild(title);
    bodyDiv.appendChild(desc);
    bodyDiv.appendChild(price);
    bodyDiv.appendChild(btn);

    article.appendChild(imageDiv);
    article.appendChild(bodyDiv);
    grid.appendChild(article);
  });
}

function initRoomsControls() {
  const searchInput = document.getElementById('rooms-search');
  const filterSelect = document.getElementById('rooms-filter');
  const sortSelect = document.getElementById('rooms-sort');
  if (!searchInput || !filterSelect || !sortSelect) return;

  const saved = JSON.parse(localStorage.getItem('roomsFilters') || '{}');
  if (saved.search) searchInput.value = saved.search;
  if (saved.filter) filterSelect.value = saved.filter;
  if (saved.sort) sortSelect.value = saved.sort;

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    const filterVal = filterSelect.value;
    const sortVal = sortSelect.value;

    localStorage.setItem('roomsFilters', JSON.stringify({
      search: searchInput.value,
      filter: filterVal,
      sort: sortVal,
    }));

    let result = rooms.slice();

    if (query) {
      result = result.filter(function (room) {
        return room.title.toLowerCase().includes(query);
      });
    }

    if (filterVal !== 'all') {
      result = result.filter(function (room) {
        return room.type === filterVal;
      });
    }

    if (sortVal === 'price-asc') {
      result.sort(function (a, b) { return a.priceNum - b.priceNum; });
    } else if (sortVal === 'price-desc') {
      result.sort(function (a, b) { return b.priceNum - a.priceNum; });
    } else if (sortVal === 'name-asc') {
      result.sort(function (a, b) { return a.title.localeCompare(b.title, 'ru'); });
    }

    renderRooms(result);
  }

  searchInput.addEventListener('input', applyFilters);
  filterSelect.addEventListener('change', applyFilters);
  sortSelect.addEventListener('change', applyFilters);

  applyFilters();
}

function renderAmenities() {
  const list = document.getElementById('amenities-list');
  if (!list) return;

  amenities.forEach(function (item) {
    const li = document.createElement('li');
    li.classList.add('amenity');

    const icon = document.createElement('span');
    icon.classList.add('amenity__icon');
    icon.textContent = item.icon;
    icon.setAttribute('aria-hidden', 'true');

    const name = document.createElement('p');
    name.classList.add('amenity__name');
    name.textContent = item.name;

    li.appendChild(icon);
    li.appendChild(name);
    list.appendChild(li);
  });
}

function setActiveNav() {
  const navLinks = document.querySelectorAll('.nav__link');
  const currentPage =
    window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(function (link) {
    const linkPage = link.getAttribute('href').split('/').pop();

    if (linkPage === currentPage) {
      link.classList.add('nav__link--active');
    }
  });
}

function initMobileMenu() {
  const burger = document.getElementById('nav-burger');
  const navList = document.querySelector('.nav__list');

  if (!burger || !navList) return;

  burger.addEventListener('click', function () {
    navList.classList.toggle('nav__list--open');

    const isOpen = navList.classList.contains('nav__list--open');

    burger.setAttribute('aria-expanded', isOpen);
    burger.innerHTML = isOpen ? '&#10005;' : '&#9776;';
  });

  navList.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', function () {
      navList.classList.remove('nav__list--open');
      burger.innerHTML = '&#9776;';
      burger.setAttribute('aria-expanded', false);
    });
  });
}

function initTheme() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
    btn.textContent = '☀';
  }

  btn.addEventListener('click', function () {
    document.body.classList.toggle('dark-theme');

    const isDark = document.body.classList.contains('dark-theme');

    btn.textContent = isDark ? '☀' : '☽';

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

function initModal() {
  const modal = document.getElementById('modal');
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  const callBtn = document.getElementById('footer-call-btn');

  if (!modal) return;

  function openModal() {
    modal.classList.add('modal--open');
    document.body.classList.add('body--locked');
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('modal--open');
    document.body.classList.remove('body--locked');
  }

  if (callBtn) {
    callBtn.addEventListener('click', openModal);
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('modal--open')) {
      closeModal();
    }
  });
}

function initAuth() {
  const userBlock = document.getElementById('header-user');
  const usernameEl = document.getElementById('header-username');
  const logoutBtn = document.getElementById('header-logout');
  const signinLink = document.querySelector('.header__actions');

  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');

  if (user && userBlock && usernameEl && signinLink) {
    userBlock.style.display = 'flex';
    usernameEl.textContent = user.name;
    signinLink.style.display = 'none';
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      localStorage.removeItem('currentUser');
      location.reload();
    });
  }
}

function initSignin() {
  const signinForm = document.querySelector('.signin__form');
  if (!signinForm) return;

  const showRegister = document.getElementById('show-register');
  const showLogin = document.getElementById('show-login');
  const registerForm = document.getElementById('register-form');
  const registerBtn = document.getElementById('register-btn');

  if (showRegister) {
    showRegister.addEventListener('click', function (e) {
      e.preventDefault();
      signinForm.style.display = 'none';
      registerForm.style.display = 'flex';
    });
  }

  if (showLogin) {
    showLogin.addEventListener('click', function (e) {
      e.preventDefault();
      registerForm.style.display = 'none';
      signinForm.style.display = 'flex';
    });
  }

  if (registerBtn) {
    registerBtn.addEventListener('click', function () {
      clearErrors(registerForm);

      const name = document.getElementById('reg-name');
      const email = document.getElementById('reg-email');
      const password = document.getElementById('reg-password');
      let valid = true;

      if (!name.value.trim()) { showError(name, 'Введите имя'); valid = false; }
      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        showError(email, 'Email введён неверно'); valid = false;
      }
      if (password.value.length < 6) { showError(password, 'Минимум 6 символов'); valid = false; }

      if (valid) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const exists = users.find(function (u) { return u.email === email.value.trim(); });

        if (exists) {
          showError(email, 'Пользователь уже зарегистрирован');
          return;
        }

        users.push({ name: name.value.trim(), email: email.value.trim(), password: password.value });
        localStorage.setItem('users', JSON.stringify(users));
        showSuccess(registerForm, 'Регистрация прошла успешно! Войдите в аккаунт.');

        setTimeout(function () {
          registerForm.style.display = 'none';
          signinForm.style.display = 'flex';
        }, 1500);
      }
    });
  }

  signinForm.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors(signinForm);

    const email = document.getElementById('email');
    const password = document.getElementById('password');
    let valid = true;

    if (!email.value.trim()) { showError(email, 'Введите email'); valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      showError(email, 'Email введён неверно'); valid = false;
    }

    if (!password.value.trim()) { showError(password, 'Введите пароль'); valid = false; }
    else if (password.value.length < 6) { showError(password, 'Пароль слишком короткий (минимум 6 символов)'); valid = false; }
    else if (password.value.length > 32) { showError(password, 'Пароль слишком длинный (максимум 32 символа)'); valid = false; }

    if (valid) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(function (u) {
        return u.email === email.value.trim() && u.password === password.value;
      });

      if (!user) {
        showError(email, 'Неверный email или пароль');
        return;
      }

      localStorage.setItem('currentUser', JSON.stringify(user));
      showSuccess(signinForm, 'Вход выполнен успешно!');
      setTimeout(function () { location.href = isRoot ? 'index.html' : '../index.html'; }, 1000);
    }
  });
}

function initReservation() {
  const reservationBtn = document.querySelector('.reservation__btn');

  if (!reservationBtn) return;

  reservationBtn.addEventListener('click', function () {
    const form = document.querySelector('.reservation__form');

    clearErrors(form);

    const name = document.getElementById('name');
    const phone = document.getElementById('phone');
    const checkin = document.getElementById('checkin');
    const checkout = document.getElementById('checkout');
    const roomType = document.getElementById('room-type');

    let valid = true;

    if (!name.value.trim()) {
      showError(name, 'Введите имя');
      valid = false;
    } else if (name.value.trim().length < 2) {
      showError(name, 'Имя слишком короткое (минимум 2 символа)');
      valid = false;
    } else if (name.value.trim().length > 50) {
      showError(name, 'Имя слишком длинное (максимум 50 символов)');
      valid = false;
    }

    if (!phone.value.trim()) {
      showError(phone, 'Введите номер телефона');
      valid = false;
    } else if (!/^[\d\s\+\(\)\-]{7,15}$/.test(phone.value.trim())) {
      showError(phone, 'Номер телефона введён неверно');
      valid = false;
    }

    if (!checkin.value) {
      showError(checkin, 'Выберите дату заезда');
      valid = false;
    }

    if (!checkout.value) {
      showError(checkout, 'Выберите дату выезда');
      valid = false;
    }

    if (checkin.value && checkout.value <= checkin.value) {
      showError(checkout, 'Дата выезда должна быть позже даты заезда');
      valid = false;
    }

    if (!roomType.value) {
      showError(roomType, 'Выберите тип номера');
      valid = false;
    }

    if (valid) {
      showSuccess(
        form,
        'Бронирование успешно оформлено! Мы свяжемся с вами.'
      );

      console.log('Бронирование:', {
        name: name.value.trim(),
        phone: phone.value.trim(),
        checkin: checkin.value,
        checkout: checkout.value,
        roomType: roomType.value,
      });
    }
  });
}

function showError(input, message) {
  input.classList.add('input--error');

  const err = document.createElement('span');

  err.classList.add('form__error');
  err.textContent = message;

  input.parentElement.appendChild(err);
}

function clearErrors(container) {
  container
    .querySelectorAll('.form__error')
    .forEach(function (el) {
      el.remove();
    });

  container
    .querySelectorAll('.input--error')
    .forEach(function (el) {
      el.classList.remove('input--error');
    });

  const success = container.querySelector('.form__success');

  if (success) success.remove();
}

function showSuccess(container, message) {
  const el = document.createElement('p');

  el.classList.add('form__success');
  el.textContent = message;

  container.appendChild(el);
}

document.addEventListener('DOMContentLoaded', function () {
  renderRooms();
  renderAmenities();
  setActiveNav();
  initAuth();
  initRoomsControls();
  initMobileMenu();
  initTheme();
  initModal();
  initSignin();
  initReservation();
});