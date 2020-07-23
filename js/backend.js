// Модуль для работы с сервером

'use strict';

window.backend = (function () {

  var LOAD_URL = 'https://javascript.pages.academy/kekstagram/data2';
  var Code = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404
  };
  var TIMEOUT = 3000;

  return {
    // Загружает данные с сервера
    load: function (onSuccess, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      var error = '';

      xhr.addEventListener('load', function () {

        switch (xhr.status) {
          case Code.OK:
            onSuccess(xhr.response);
            break;
          case Code.BAD_REQUEST:
            error = 'Неверный запрос';
            break;
          case Code.UNAUTHORIZED:
            error = 'Пользователь не авторизован';
            break;
          case Code.NOT_FOUND:
            error = 'Ничего не найдено';
            break;
          default:
            error = 'Произошла ошибка. Статус ответа: ' + xhr.status + ': ' + xhr.statusText;
        }

        if (error) {
          onError(error);
        }
      });

      xhr.addEventListener('error', function () {
        onError('Ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError('Превышено время ожидания ' + TIMEOUT + ' мс ответа от сервера');
      });
      xhr.timeout = TIMEOUT;

      xhr.open('GET', LOAD_URL);
      xhr.send();
    }
  };
})();
