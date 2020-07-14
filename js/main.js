'use strict';

var PHOTO_DESCRIPTIONS = [
  'Мой любимый котейка.',
  'Мир должен знать, что я ем!',
  'Доброе утро',
  '<3',
  ';)',
  'Красота-то какая, лепота!',
  'Селфи',
  'Мой кактус Геннадий.',
  'Валера, пришло твоё время!',
  'Oo'
];

var COMMENTS_USERNAMES = [
  'Антон',
  'Иван',
  'Сергей',
  'Андрей',
  'Александр',
  'Максим',
  'Павел',
  'Артём',
  'Анатолий',
  'Валерий',
  'Владимир',
  'Виктор',
  'Валентин',
  'Вячеслав',
  'Пётр',
  'Алексей',
  'Марк',
  'Мартын',
  'Михаил',
  'Олег',
  'Мария',
  'Роза',
  'Клара',
  'Анастасия',
  'Валентина'
];

var COMMENTS_TEXTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var COMMENTS_AVATARS = [
  'img/avatar-1.svg',
  'img/avatar-2.svg',
  'img/avatar-3.svg',
  'img/avatar-4.svg',
  'img/avatar-5.svg',
  'img/avatar-6.svg'
];

var photosCount = 25;

var photoTemplate = document.querySelector('#picture').content.querySelector('.picture');
var photosContainerElement = document.querySelector('.pictures');
var bigPhotoElement = document.querySelector('.big-picture');
var bigPhotoCloseBtnElement = bigPhotoElement.querySelector('.big-picture__cancel');
var commentElement = bigPhotoElement.querySelector('.social__comment');
var commentsCountElement = bigPhotoElement.querySelector('.social__comment-count');
var commentsLoaderElement = bigPhotoElement.querySelector('.social__comments-loader');
var bodyElement = document.querySelector('body');

// Возвращает случайное число в диапазоне от min до max (включая max)
var getRandomNumber = function (min, max) {
  var randomNumber = min + Math.floor(Math.random() * (max + 1 - min));
  return randomNumber;
};

// Создаёт случайно сгенерированный комментарий
var createComment = function (avatars, messages, names) {
  var comment = {};
  comment.avatar = avatars[getRandomNumber(0, avatars.length - 1)];

  var texts = messages.slice();
  var commentText = [];
  var textsCount = getRandomNumber(1, 2);

  while (commentText.length < textsCount) {
    var textIndex = getRandomNumber(0, messages.length - 1);
    commentText.push(texts.splice(textIndex, 1));
  }
  comment.message = commentText.join(' ');

  comment.name = names[getRandomNumber(0, names.length - 1)];

  return comment;
};

// Создаёт массив сгенерированных объектов фотографий
var createPhotosArr = function (count, descriptions, avatars, messages, names) {
  var photosArr = [];

  for (var i = 1; i <= count; i++) {
    var photo = {};

    photo.id = i;
    photo.src = 'photos/' + i + '.jpg';
    photo.description = descriptions[getRandomNumber(0, descriptions.length - 1)];
    photo.likes = getRandomNumber(15, 200);

    photo.comments = [];
    var commentsCount = getRandomNumber(1, 15);
    while (photo.comments.length <= commentsCount) {
      photo.comments.push(createComment(avatars, messages, names));
    }

    photosArr.push(photo);
  }

  return photosArr;
};

// Создаёт элемент фотографии на основе шаблона #picture и сгенерированного объекта фотографии
var createPhotoElement = function (photoObj) {
  var element = photoTemplate.cloneNode(true);

  element.querySelector('.picture__img').setAttribute('id', photoObj.id + '-user-photo');
  element.querySelector('.picture__img').src = photoObj.src;
  element.querySelector('.picture__likes').textContent = photoObj.likes;
  element.querySelector('.picture__comments').textContent = photoObj.comments.length;

  return element;
};

// Отрисовывает сгенерированные элементы фотографий пользователей на страницу в блок .pictures
var renderPhotos = function (arr) {
  var fragment = document.createDocumentFragment();

  arr.forEach(function (photo) {
    fragment.appendChild(createPhotoElement(photo));
  });

  photosContainerElement.appendChild(fragment);
};

// Скрывает скроллбар страницы фотографий при открытии модального окна
var hideBodyScrollbar = function () {
  bodyElement.classList.add('modal-open');
};

// Показывает скроллбар страницы фотографий при закрытии модального окна
var showBodyScrollbar = function () {
  bodyElement.classList.remove('modal-open');
};

// Показывает окно полноэкранного просмотра фото из массива объектов, добавляет обработчик закрытия окна по esc
var openBigPhoto = function (photo) {
  bigPhotoElement.classList.remove('hidden');

  var bigPhotoImgElement = bigPhotoElement.querySelector('.big-picture__img').querySelector('img');
  bigPhotoImgElement.src = photo.src;
  bigPhotoImgElement.alt = photo.description;
  bigPhotoElement.querySelector('.likes-count').textContent = photo.likes;
  bigPhotoElement.querySelector('.comments-count').textContent = photo.comments.length;

  var fragment = document.createDocumentFragment();
  photo.comments.forEach(function (comment) {
    fragment.appendChild(createCommentElement(comment));
  });
  bigPhotoElement.querySelector('.social__comments').appendChild(fragment);

  bigPhotoElement.querySelector('.social__caption').textContent = photo.description;

  commentsCountElement.classList.add('hidden');
  commentsLoaderElement.classList.add('hidden');
  hideBodyScrollbar();
  document.addEventListener('keydown', onBigPhotoEscPress);
};

// Закрывает окно полноэкранного просмотра фото по нажатию ESC
var onBigPhotoEscPress = function (evt) {
  if (evt.keyCode === Code.ESC) {
    evt.preventDefault();
    closeBigPhoto();
  }
};

// Закрывет окно полноэкранного просмотра фото, удаляет обработчик закрытия фото по esc
var closeBigPhoto = function () {
  bigPhotoElement.classList.add('hidden');
  document.removeEventListener('keydown', onBigPhotoEscPress);
  showBodyScrollbar();
};

// Создает DOM-элемент комментария
var createCommentElement = function (comment) {
  var element = commentElement.cloneNode(true);

  element.querySelector('.social__picture').src = comment.avatar;
  element.querySelector('.social__picture').alt = comment.name;
  element.querySelector('.social__text').textContent = comment.message;

  return element;
};

// Находит нужный объект в массиве объектов фотографий пользователей по id миниатюры
var findPhoto = function (photoId) {
  var imgObj = photosArr.find(function (elem) {
    return elem.id === photoId;
  });

  return imgObj;
};

// Обработчик события клик по миниатюре изображения случайного пользователя
var onMiniaturePhotoClick = function (img) {
  var clickedPhotoId = parseInt(img.id, 10);
  var photo = findPhoto(clickedPhotoId);
  openBigPhoto(photo);
};

// Генерация и отрисовка массива случайных фотографий пользователей
var photosArr = createPhotosArr(photosCount, PHOTO_DESCRIPTIONS, COMMENTS_AVATARS, COMMENTS_TEXTS, COMMENTS_USERNAMES);
renderPhotos(photosArr);

// Добавляет на контейнер с фотографиями пользователей обработчик события клик, открывающий попап с фото в полноэкранном режиме
photosContainerElement.addEventListener('click', function (evt) {
  if (evt.target.matches('img[class="picture__img"]')) {
    onMiniaturePhotoClick(evt.target);
  }
});

// Добавляет на контейнер с фотографиями пользователей обработчик события нажатия Enter, открывающий попап с фото в полноэкранном режиме
photosContainerElement.addEventListener('keydown', function (evt) {
  if (evt.keyCode === Code.ENTER && evt.target.matches('a[class="picture"]')) {
    var img = evt.target.querySelector('img');
    onMiniaturePhotoClick(img);
  }
});

// Добавляет на кнопку закрытия окна полноэкранного просмотра фото обработчик события клик, закрывающий окно
bigPhotoCloseBtnElement.addEventListener('click', function () {
  closeBigPhoto();
});

// ---------------- попап окна редактирования изображения ------------------------------------------

var imgUploadElement = photosContainerElement.querySelector('#upload-file');
var formPopupElement = photosContainerElement.querySelector('.img-upload__overlay');
var formElement = photosContainerElement.querySelector('.img-upload__form');
var formCloseElement = formElement.querySelector('#upload-cancel');

var Code = {
  ESC: 27,
  ENTER: 13
};

// Сбрасывает значение поля загрузки файла
var resetImgUploadInput = function () {
  imgUploadElement.value = '';
};

// Обработчик закрытия формы по нажатию Esc
var onPopupEscPress = function (evt) {
  if (evt.keyCode === Code.ESC && !evt.target.matches('input[name="hashtags"]') && !evt.target.matches('textarea[name="description"]')) {
    evt.preventDefault();
    hideForm();
  }
};

// Показывает форму редактирования изображения
var showForm = function () {
  formPopupElement.classList.remove('hidden');
  document.addEventListener('keydown', onPopupEscPress);
  hideBodyScrollbar();
  hideFilterSlider();
};

// Скрывает форму редактирования изображения
var hideForm = function () {
  formPopupElement.classList.add('hidden');
  document.removeEventListener('keydown', onPopupEscPress);
  resetForm();
  resetImgScale();
  removeFilter();
  showBodyScrollbar();
};

// Сбрасывает значения полей формы
var resetForm = function () {
  resetImgUploadInput();
  resetImgSizeInput();
  resetHashtagInput();
  resetDescriptionInput();
};

// Добавляет на поле загрузки изображения обработчик события выбора файла
imgUploadElement.addEventListener('change', function () {
  showForm();
});

// Добавляет на кнопку закрытия формы редактирования изображения обработчик клика
formCloseElement.addEventListener('click', function () {
  hideForm();
});

// Добавляет на кнопку закрытия формы редактирования изображения обработчик нажатия Enter
formCloseElement.addEventListener('keydown', function (evt) {
  if (evt.keyCode === Code.ENTER) {
    hideForm();
  }
});

// ---------------- применение эффекта для изображения ------------------------------------------

var MAX_EFFCT_LEVEL = 100;

var previewImgElement = formElement.querySelector('.img-upload__preview').querySelector('img');
var pinElement = formElement.querySelector('.effect-level__pin');
var effectValueElement = formElement.querySelector('.effect-level__value');
var filtersFieldsetElement = formElement.querySelector('.img-upload__effects');
var sliderElement = formElement.querySelector('.effect-level');
var sliderLineElement = sliderElement.querySelector('.effect-level__line');

var effectBtnIdToClassName = {
  'effect-chrome': 'effects__preview--chrome',
  'effect-sepia': 'effects__preview--sepia',
  'effect-marvin': 'effects__preview--marvin',
  'effect-phobos': 'effects__preview--phobos',
  'effect-heat': 'effects__preview--heat'
};

var effectBtnIdToCssFilterName = {
  'effect-chrome': 'grayscale',
  'effect-sepia': 'sepia',
  'effect-marvin': 'invert',
  'effect-phobos': 'blur',
  'effect-heat': 'brightness'
};

var cssFiltersValues = [
  {
    name: 'grayscale',
    minValue: 0,
    maxValue: 1,
    currentValue: '',
    units: ''
  },
  {
    name: 'sepia',
    minValue: 0,
    maxValue: 1,
    currentValue: '',
    units: ''
  },
  {
    name: 'invert',
    minValue: 0,
    maxValue: 100,
    currentValue: '',
    units: '%'
  },
  {
    name: 'blur',
    minValue: 0,
    maxValue: 3,
    currentValue: '',
    units: 'px'
  },
  {
    name: 'brightness',
    minValue: 1,
    maxValue: 3,
    currentValue: '',
    units: ''
  }
];

// Значение текущего выбранного фильтра
var currentFilter = {};

// Скрывает слайдер интенсивности фильтра
var hideFilterSlider = function () {
  sliderElement.classList.add('hidden');
};

// Показывает слайдер интенсивности фильтра
var showFilterSlider = function () {
  if (sliderElement.classList.contains('hidden')) {
    sliderElement.classList.remove('hidden');
  }
};

// Находит нужный фильтр по id радиобаттона в массиве объектов фильтров
var findFilter = function (filterId) {
  var filterName = effectBtnIdToCssFilterName[filterId];
  var foundFilter = cssFiltersValues.find(function (elem) {
    return elem.name === filterName;
  });
  return foundFilter;
};

// Сбрасывает стили фильтра у большого изображения
var removeFilter = function () {
  previewImgElement.className = '';
  previewImgElement.style.filter = '';
  currentFilter = {};
};

// Записывает текущее значение фильтра в переменную currentFilter
var setCurrentFilter = function (filterId) {
  currentFilter = findFilter(filterId);
};

// Добавляет бработчик события смены фильтра при переключении кнопок на филдесет с радиобаттонами фильтров
filtersFieldsetElement.addEventListener('change', function (evt) {
  removeFilter();

  if (evt.target.id === 'effect-none') {
    hideFilterSlider();
  } else {
    showFilterSlider();

    var filterClass = effectBtnIdToClassName[evt.target.id];
    previewImgElement.classList.add(filterClass);

    setCurrentFilter(evt.target.id);
    setFilterInputValue(MAX_EFFCT_LEVEL);
  }
});

// Записывает в поле уровня фильтра значение насыщенности фильтра в процентах
var setFilterInputValue = function (levelValue) {
  effectValueElement.value = levelValue;
};

// Добавляет на пин слайдера обработчик события отпускания кнопки мыши
pinElement.addEventListener('mouseup', function () {
  var pinPositionX = pinElement.offsetLeft;
  var maxCoordX = sliderLineElement.offsetWidth;
  var percentageValue = Math.floor((pinPositionX / maxCoordX) * 100);

  setFilterInputValue(percentageValue);
  setFilterStyle(percentageValue, currentFilter);
});

// Вычисляет значение насыщенности фильтра для CSS
var calculateIntensity = function (percentageValue, filter) {
  var intensity = ((filter.maxValue - filter.minValue) * (percentageValue / 100)) + filter.minValue;
  return intensity;
};

// Возвращает CSS стиль для фильтра
var createFlterStyle = function (filter) {
  var style = filter.name + '(' + filter.currentValue + filter.units + ')';
  return style;
};

// Задаёт изображению значение фильтра соответствующей насыщенности
var setFilterStyle = function (percentageValue, filter) {
  var intensity = calculateIntensity(percentageValue, filter);
  filter.currentValue = intensity;
  previewImgElement.style.filter = createFlterStyle(filter);
};


// --------------------------------- изменение размера изображения -----------------------------

var Scale = {
  MAX: 100,
  MIN: 25,
  STEP: 25,
  DEFAULT: 100
};

var imgScaleFieldsetElement = formElement.querySelector('.img-upload__scale');
var imgSizeValueElement = formElement.querySelector('.scale__control--value');

// Добавляет на филдсет с контролами масштабирования фото обработчик события клик, который увеличивает масштаб изображения на 25% и записывает значение в поле input
imgScaleFieldsetElement.addEventListener('click', function (evt) {
  if (evt.target.matches('button')) {
    var step = Scale.STEP;

    if (evt.target.classList.contains('scale__control--smaller')) {
      step = -Scale.STEP;
    }

    var size = parseInt(imgSizeValueElement.value, 10);
    size += step;

    if (size <= Scale.MAX && size >= Scale.MIN) {
      setImgSizeInputValue(size);
      setImgScale(size);
    }
  }
});

// Записывает в поле размера изображения значение масштаба в процентах
var setImgSizeInputValue = function (sizeValue) {
  imgSizeValueElement.value = sizeValue + '%';
};

// Сбрасывает значение масштаба в поле размера изображения на значение по умолчанию
var resetImgSizeInput = function () {
  imgSizeValueElement.value = Scale.DEFAULT + '%';
};

// Сбрасывает CSS стиль масштабирования у изображения
var resetImgScale = function () {
  previewImgElement.style.transform = '';
};

// Задаёт изображению CSS стиль трансформации, задающий соответствующий масштаб
var setImgScale = function (value) {
  previewImgElement.style.transform = 'scale(' + value / 100 + ')';
};


// --------------------------------- валидация хeш-тегов -----------------------------

var hashTagInputElement = formElement.querySelector('.text__hashtags');
var descriptionInputElement = formElement.querySelector('.text__description');

// Регулярное выражение для проверки хеш-тега
var HASHTAG_REGEXP = /^#[a-zа-яA-ZА-Я0-9]*$/;

var HASHTAG_MIN_LENGTH = 2;
var HASHTAG_MAX_LENGTH = 20;
var HASHTAG_MAX_COUNT = 5;
var DESCRIPTION_MAX_LENGTH = 140;

// Проверяет валидность хеш-тега, возвращает текст сообщения об ошибке
var checkHashtag = function (hastag, hashtagsArr) {
  var message = '';

  var hashtagOccurrences = hashtagsArr.filter(function (item) {
    return item === hastag;
  });

  if (hashtagOccurrences.length > 1) {
    message = 'Один и тот же хештег не должен повторяться дважды.';
  } else if (hastag.length > HASHTAG_MAX_LENGTH) {
    message = 'Максимальная длина хештега - 19 символов. Хештег: ' + hastag + ' слишком длинный.';
  } else if (!HASHTAG_REGEXP.test(hastag)) {
    message = 'Хеш-тег должен начинаться с символа # и состоять только из букв или цифрф без спецсимволов и пробелов. Хеш-теги между собой должны разделяться пробелом.';
  } else if (hastag.length < HASHTAG_MIN_LENGTH) {
    message = 'Минимальная длина хештега - 1 символ.';
  }

  return message;
};

// Создаёт массив хештегов из введенного пользователем значения поля input
var createHashtagsArr = function (string) {
  var hashTags = string.split(' ');

  // Исключает из массива пустые значения и лишние пробелы
  var hashTagsOnly = hashTags.filter(function (elem) {
    return elem !== ' ' && elem;
  });

  return hashTagsOnly;
};

// Добавляет на поле input ввода хеш-тега обработчик события ввода значения, проверяющий валидность хеш-тегов
hashTagInputElement.addEventListener('input', function (evt) {
  var userInput = evt.target.value;
  var hashTags = createHashtagsArr(userInput);

  if (hashTags.length > HASHTAG_MAX_COUNT) {
    evt.target.setCustomValidity('Можно указать не больше 5 хеш-тегов');
    evt.target.reportValidity();
  } else {
    hashTags.forEach(function (hashtag) {
      if (hashtag) {
        var errorMessage = checkHashtag(hashtag, hashTags);
        evt.target.setCustomValidity(errorMessage);
        evt.target.reportValidity();
      }
    });
  }
});

// Добавляет на поле input хеш-тега обработчик события изменения значения поля, который удаляет лишние пробелы между хеш-тегами
hashTagInputElement.addEventListener('change', function (evt) {
  var userInput = evt.target.value;
  var hashTags = createHashtagsArr(userInput);

  evt.target.value = hashTags.join(' ');
});

// Сбрасывает значение поля хеш-тега
var resetHashtagInput = function () {
  hashTagInputElement.value = '';
};

// Сбрасывает значение поля описание изображения
var resetDescriptionInput = function () {
  descriptionInputElement.value = '';
};
