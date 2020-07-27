// Модуль, выполняющий сортировку публикаций пользователей

'use strict';

window.sort = (function () {

  var RANDOM_PHOTOS_COUNT = 10;

  var sortingContainerElement = document.querySelector('.img-filters');
  var sortingFormElement = sortingContainerElement.querySelector('.img-filters__form');


  // Возвращает случайное число в диапазоне от min до max (включая max)
  var getRandomNumber = function (min, max) {
    var randomNumber = min + Math.floor(Math.random() * (max + 1 - min));
    return randomNumber;
  };

  // Создаёт массив из 10 случайных фотографий пользователей
  var getRandomPhotos = function () {
    var photos = window.gallery.userPhotos.slice();
    var sortedPhotos = [];
    while (sortedPhotos.length < RANDOM_PHOTOS_COUNT) {
      var photoIndex = getRandomNumber(0, photos.length - 1);
      sortedPhotos.push(photos[photoIndex]);
      photos.splice(photoIndex, 1);
    }
    return sortedPhotos;
  };

  // Сортирует фотографии в порядке убывания количества комментариев
  var sortPhotosByCommentsCount = function () {
    var photos = window.gallery.userPhotos.slice();
    var sortedPhotos = photos.sort(function (first, second) {
      if (first.comments.length < second.comments.length) {
        return 1;
      } else if (first.comments.length > second.comments.length) {
        return -1;
      } else {
        return 0;
      }
    });

    return sortedPhotos;
  };

  // Обработчик клика по кнопке сортировки, отрисовывающий фотографии пользователей в порядке, предусмотренном сортировкой
  var onSortBtnClick = window.util.debounce(function (evt) {
    var btn = evt.target;
    if (!btn.classList.contains('img-filters__button--active') && btn.classList.contains('img-filters__button')) {
      var checkedBtnElement = sortingFormElement.querySelector('.img-filters__button--active');
      checkedBtnElement.classList.remove('img-filters__button--active');
      btn.classList.add('img-filters__button--active');

      updatePhotos(btn.id);
    }
  });

  // Обновляет галлерею фотографий в зависимости от id нажатой кнопки сортировки
  var updatePhotos = function (buttonId) {
    window.gallery.clear();
    var photos = [];

    switch (buttonId) {
      case 'filter-random':
        photos = getRandomPhotos();
        break;
      case 'filter-discussed':
        photos = sortPhotosByCommentsCount();
        break;
      case 'filter-default':
        photos = photos = window.gallery.userPhotos;
        break;
      default:
        photos = window.gallery.userPhotos;
    }

    window.gallery.renderPhotos(photos);
  };

  // Добавляет на форму с кнопками сортровки обработчик события клик, меняющий порядок отрисовки фотографий в галерее
  sortingFormElement.addEventListener('click', onSortBtnClick);

  return {

    // Отображает блок сортировки
    show: function () {
      sortingContainerElement.classList.remove('img-filters--inactive');
    },

    // Скрывает блок сортировки
    hide: function () {
      sortingContainerElement.classList.add('img-filters--inactive');
    }
  };
})();
