// Модуль, создающий DOM-элемент миниатюры фото других пользователей

'use strict';

window.miniature = (function () {

  var photoTemplate = document.querySelector('#picture').content.querySelector('.picture');

  return {

    // Создаёт элемент миниатюры фотографии случайного пользователя на основе шаблона #picture и сгенерированного объекта фотографии
    create: function (photoObj) {
      var element = photoTemplate.cloneNode(true);

      element.querySelector('.picture__img').setAttribute('id', photoObj.id + '-user-photo');
      element.querySelector('.picture__img').src = photoObj.src;
      element.querySelector('.picture__likes').textContent = photoObj.likes;
      element.querySelector('.picture__comments').textContent = photoObj.comments.length;

      return element;
    }
  };
})();
