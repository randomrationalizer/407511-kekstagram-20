// Модуль отрисовывает миниатюры фотографий пользователей, добавляет обработчик на поле загрузки изображения
'use strict';

window.main = (function () {

  var imgUploadElement = document.querySelector('#upload-file');

  // Добавляет на поле загрузки изображения обработчик события выбора файла, открывающий окно редактирования изображения
  imgUploadElement.addEventListener('change', function () {
    window.form.show();
  });

  // Отрисовка фотографий случайных пользователей
  window.gallery.render(window.data.randomPhotos);
})();
