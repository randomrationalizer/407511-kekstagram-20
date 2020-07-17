// Модуль, осуществляющий масштабирование загруженного пользователем изображения

'use strict';

window.scale = (function () {

  var Scale = {
    MAX: 100,
    MIN: 25,
    STEP: 25,
    DEFAULT: 100
  };

  var formElement = document.querySelector('.img-upload__form');
  var imgSizeValueElement = formElement.querySelector('.scale__control--value');
  var previewImgElement = formElement.querySelector('.img-upload__preview').querySelector('img');


  // Записывает в поле размера изображения значение масштаба в процентах
  var setImgSizeInputValue = function (sizeValue) {
    imgSizeValueElement.value = sizeValue + '%';
  };

  // Задаёт изображению CSS стиль трансформации, задающий соответствующий масштаб
  var setImgScale = function (value) {
    previewImgElement.style.transform = 'scale(' + value / 100 + ')';
  };

  return {

    // Сбрасывает CSS стиль масштабирования у изображения
    reset: function () {
      previewImgElement.style.transform = '';
    },

    // Обработчик события клик, который увеличивает масштаб изображения на 25% и записывает значение в поле input
    onBtnClick: function (evt) {
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
    },

    // Сбрасывает значение масштаба в поле размера изображения на значение по умолчанию
    resetInputValue: function () {
      imgSizeValueElement.value = Scale.DEFAULT + '%';
    }
  };
})();
