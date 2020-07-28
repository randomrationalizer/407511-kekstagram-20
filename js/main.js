// Модуль отрисовывает миниатюры фотографий пользователей, добавляет обработчик на поле загрузки изображения
'use strict';

window.main = (function () {

  var imgUploadElement = document.querySelector('#upload-file');

  // Добавляет на поле загрузки изображения обработчик события выбора файла, открывающий окно редактирования изображения
  imgUploadElement.addEventListener('change', function () {
    window.form.onFileInputChange();
  });

  // Отрисовка загруженных с сервера фотографий пользователей
  window.backend.load(window.gallery.create, window.util.showErrorMessage);
})();
