// Модуль c переменными и функциями для общего пользования

'use strict';

window.util = (function () {
  var bodyElement = document.querySelector('body');

  var Code = {
    ESC: 27,
    ENTER: 13
  };

  return {
    // Обработчик события по нажатию ESC
    isEscEvent: function (evt, action) {
      if (evt.keyCode === Code.ESC) {
        evt.preventDefault();
        action();
      }
    },
    // Обработчик события по нажатию Enter
    isEnterEvent: function (evt, action, arg) {
      if (evt.keyCode === Code.ENTER) {
        action(arg);
      }
    },
    // Скрывает скроллбар страницы фотографий при открытии модального окна
    hideBodyScrollbar: function () {
      bodyElement.classList.add('modal-open');
    },

    // Показывает скроллбар страницы фотографий при закрытии модального окна
    showBodyScrollbar: function () {
      bodyElement.classList.remove('modal-open');
    }
  };
})();
