// Модуль для работы с галереей фотографий других пользователей

'use strict';

window.gallery = (function () {

  var photosContainerElement = document.querySelector('.pictures');

  // Находит нужный объект в массиве объектов фотографий пользователей по id миниатюры
  var findPhoto = function (id) {
    var imgObj = window.gallery.userPhotos.find(function (elem) {
      return elem.id === id;
    });
    return imgObj;
  };

  // Обработчик события клик по миниатюре изображения случайного пользователя
  var onMiniaturePhotoClick = function (img) {
    var clickedPhotoId = parseInt(img.id, 10);
    var photo = findPhoto(clickedPhotoId);
    window.bigPhoto.open(photo);
  };

  // Добавляет на контейнер с фотографиями пользователей обработчик события нажатия Enter, открывающий попап с фото в полноэкранном режиме
  photosContainerElement.addEventListener('keydown', function (evt) {
    if (evt.target.matches('a[class="picture"]')) {
      var img = evt.target.querySelector('img');

      window.util.isEnterEvent(evt, onMiniaturePhotoClick, img);
    }
  });

  // Добавляет на контейнер с фотографиями пользователей обработчик события клик, открывающий попап с фото в полноэкранном режиме
  photosContainerElement.addEventListener('click', function (evt) {
    if (evt.target.matches('img[class="picture__img"]')) {
      onMiniaturePhotoClick(evt.target);
    }
  });

  return {

    // Массив загруженных с сервера фотографий пользователей
    userPhotos: [],

    // Сохраняет загруженный с сервера массив фотографий в переменную userPhotos, отрисовывает миниатюры
    create: function (loadedData) {
      window.gallery.userPhotos = loadedData.map(function (photo, index) {
        photo.id = index + 1;
        return photo;
      });
      window.gallery.renderPhotos(window.gallery.userPhotos);
      window.sort.show();
    },

    // Отрисовывает сгенерированные элементы миниатюр фотографий пользователей на страницу в блок .pictures
    renderPhotos: function (photosObjects) {
      var fragment = document.createDocumentFragment();
      photosObjects.forEach(function (photoObj) {
        fragment.appendChild(window.miniature.create(photoObj));
      });
      photosContainerElement.appendChild(fragment);
    },

    clear: function () {
      var miniatureElements = Array.from(photosContainerElement.querySelectorAll('.picture'));
      miniatureElements.forEach(function (elem) {
        elem.parentNode.removeChild(elem);
      });
    }
  };
})();
