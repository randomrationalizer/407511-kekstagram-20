// Модуль для работы с галереей фотографий других пользователей

'use strict';

window.gallery = (function () {

  var photosContainerElement = document.querySelector('.pictures');


  // Обработчик события клик по миниатюре изображения случайного пользователя
  var onMiniaturePhotoClick = function (img) {
    var clickedPhotoId = parseInt(img.id, 10);
    var photo = window.data.findPhoto(clickedPhotoId);
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
    // Отрисовывает сгенерированные элементы миниатюр фотографий пользователей на страницу в блок .pictures
    render: function (photosObjects) {
      var fragment = document.createDocumentFragment();

      photosObjects.forEach(function (photoObj) {
        fragment.appendChild(window.miniature.create(photoObj));
      });

      photosContainerElement.appendChild(fragment);
    }
  };
})();
