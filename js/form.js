// Модуль, работающий с формой публикации фотографии

'use strict';

window.form = (function () {

  // Регулярное выражение для проверки хеш-тега
  var HASHTAG_REGEXP = /^#[a-zа-яA-ZА-Я0-9]*$/;

  var HASHTAG_MIN_LENGTH = 2;
  var HASHTAG_MAX_LENGTH = 20;
  var HASHTAG_MAX_COUNT = 5;

  var formElement = document.querySelector('.img-upload__form');
  var imgUploadElement = formElement.querySelector('#upload-file');
  var formPopupElement = formElement.querySelector('.img-upload__overlay');
  var formCloseElement = formElement.querySelector('#upload-cancel');

  var hashTagInputElement = formElement.querySelector('.text__hashtags');
  var descriptionInputElement = formElement.querySelector('.text__description');

  var pinElement = formElement.querySelector('.effect-level__pin');
  var filtersFieldsetElement = formElement.querySelector('.img-upload__effects');
  var sliderLineElement = formElement.querySelector('.effect-level__line');
  var imgScaleFieldsetElement = formElement.querySelector('.img-upload__scale');


  // Проверяет валидность хеш-тега, возвращает текст сообщения об ошибке
  var checkHashtag = function (hastag, hashtagsArr) {
    var message = '';

    var hashtagOccurrences = hashtagsArr.filter(function (item) {
      return item.toLowerCase() === hastag.toLowerCase();
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

  // Сбрасывает значение поля загрузки файла
  var resetImgUploadInput = function () {
    imgUploadElement.value = '';
  };

  // Обработчик закрытия формы по нажатию Esc
  var onFormEscPress = function (evt) {
    if (!evt.target.matches('input[name="hashtags"]') && !evt.target.matches('textarea[name="description"]')) {
      window.util.isEscEvent(evt, hideForm);
    }
  };

  // Добавляет на кнопку закрытия формы редактирования изображения обработчик клика
  formCloseElement.addEventListener('click', function () {
    hideForm();
  });

  // Добавляет на кнопку закрытия формы редактирования изображения обработчик нажатия Enter
  formCloseElement.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, hideForm);
  });


  // Добавляет на филдесет с радиобаттонами фильтров обработчик события переключения кнопок
  filtersFieldsetElement.addEventListener('change', function (evt) {
    window.filter.onBtnChange(evt);
  });


  // Добавляет на пин слайдера обработчик события отпускания кнопки мыши
  pinElement.addEventListener('mouseup', function () {
    var pinPositionX = pinElement.offsetLeft;
    var maxCoordX = sliderLineElement.offsetWidth;
    var percentageValue = Math.floor((pinPositionX / maxCoordX) * 100);

    window.filter.setInputValue(percentageValue);
    window.filter.add(percentageValue, window.filter.currentFilter);
  });

  // Добавляет на филдсет с контролами масштабирования фото обработчик события клик
  imgScaleFieldsetElement.addEventListener('click', function (evt) {
    window.scale.onBtnClick(evt);
  });

  // Сбрасывает значения полей формы на значения по умолчанию
  var resetForm = function () {
    resetImgUploadInput();
    window.scale.resetInputValue();
    window.filter.resetInputValue();
    resetHashtagInput();
    resetDescriptionInput();
  };

  // Скрывает форму редактирования изображения
  var hideForm = function () {
    formPopupElement.classList.add('hidden');
    resetForm();
    window.scale.reset();
    window.filter.remove();
    window.util.showBodyScrollbar();
    document.removeEventListener('keydown', onFormEscPress);
  };

  return {
    // Показывает форму редактирования изображения
    show: function () {
      formPopupElement.classList.remove('hidden');
      window.util.hideBodyScrollbar();
      window.filter.hideSlider();
      document.addEventListener('keydown', onFormEscPress);
    }
  };
})();
