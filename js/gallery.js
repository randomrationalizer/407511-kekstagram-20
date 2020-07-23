// Модуль для работы с галереей фотографий других пользователей

'use strict';

window.gallery = (function () {

  var photosContainerElement = document.querySelector('.pictures');

  // Массив загруженных с сервера фотографий пользователей
  var userPhotos = [];


  // Находит нужный объект в массиве объектов фотографий пользователей по id миниатюры
  var findPhoto = function (id) {
    var imgObj = userPhotos.find(function (elem) {
      return elem.id === id;
    });
    return imgObj;
  };

  // Отрисовывает сгенерированные элементы миниатюр фотографий пользователей на страницу в блок .pictures
  var renderPhotos = function (photosObjects) {
    var fragment = document.createDocumentFragment();
    photosObjects.forEach(function (photoObj) {
      fragment.appendChild(window.miniature.create(photoObj));
    });
    photosContainerElement.appendChild(fragment);
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

    // Сохраняет загруженный с сервера массив фотографий, отрисовывает миниатюры
    create: function (loadedData) {
      userPhotos = loadedData;
      userPhotos.forEach(function (photo, index) {
        photo.id = index + 1;
      });
      renderPhotos(userPhotos);
    }
  };
})();
