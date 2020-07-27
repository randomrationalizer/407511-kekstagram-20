// Модуль, отвечающий за применение эффекта фильтра к загруженному пользователем изображению

'use strict';

window.filter = (function () {

  var Intensity = {
    MIN: 0,
    MAX: 100,
    DEFAULT: 100
  };

  var formElement = document.querySelector('.img-upload__form');
  var previewImgElement = formElement.querySelector('.img-upload__preview').querySelector('img');
  var sliderElement = formElement.querySelector('.effect-level');
  var effectValueElement = sliderElement.querySelector('.effect-level__value');
  var sliderLineElement = sliderElement.querySelector('.effect-level__line');
  var pinElement = sliderLineElement.querySelector('.effect-level__pin');
  var depthLineElement = sliderLineElement.querySelector('.effect-level__depth');
  var filtersFieldsetElement = formElement.querySelector('.img-upload__effects');

  // Значение текущего выбранного фильтра
  var currentFilter = {};

  var effectBtnIdToClassName = {
    'effect-none': 'effects__preview--none',
    'effect-chrome': 'effects__preview--chrome',
    'effect-sepia': 'effects__preview--sepia',
    'effect-marvin': 'effects__preview--marvin',
    'effect-phobos': 'effects__preview--phobos',
    'effect-heat': 'effects__preview--heat'
  };

  var effectBtnIdToCssFilterName = {
    'effect-none': 'none',
    'effect-chrome': 'grayscale',
    'effect-sepia': 'sepia',
    'effect-marvin': 'invert',
    'effect-phobos': 'blur',
    'effect-heat': 'brightness'
  };

  var cssFiltersValues = [
    {
      name: 'grayscale',
      minValue: 0,
      maxValue: 1,
      currentValue: '',
      units: ''
    },
    {
      name: 'sepia',
      minValue: 0,
      maxValue: 1,
      currentValue: '',
      units: ''
    },
    {
      name: 'invert',
      minValue: 0,
      maxValue: 100,
      currentValue: '',
      units: '%'
    },
    {
      name: 'blur',
      minValue: 0,
      maxValue: 3,
      currentValue: '',
      units: 'px'
    },
    {
      name: 'brightness',
      minValue: 1,
      maxValue: 3,
      currentValue: '',
      units: ''
    }
  ];

  // Вычисляет значение насыщенности фильтра для CSS
  var calculateIntensity = function (percentageValue, filter) {
    var intensity = ((filter.maxValue - filter.minValue) * (percentageValue / 100)) + filter.minValue;
    return intensity;
  };

  // Возвращает CSS стиль для фильтра
  var createFilterStyle = function (filter) {
    var style = filter.name + '(' + filter.currentValue + filter.units + ')';
    return style;
  };

  // Находит нужный фильтр по id радиобаттона в массиве объектов фильтров
  var findFilter = function (filterId) {
    var filterName = effectBtnIdToCssFilterName[filterId];
    var foundFilter = cssFiltersValues.find(function (elem) {
      return elem.name === filterName;
    });
    return foundFilter;
  };

  // Задает размер полосы заливки между левым концом слайдера и пином фильтра
  var changeEffectDepthBarFill = function () {
    depthLineElement.style.width = pinElement.style.left;
  };

  // Сбрасывает положение пина слайдера на положение по умолчанию
  var resetPin = function () {
    pinElement.style.left = Intensity.DEFAULT + '%';
    changeEffectDepthBarFill();
  };

  // Органичивает область перемещения пина слайдера
  var limitPinMovement = function () {
    var sliderLength = sliderLineElement.offsetWidth;

    if (pinElement.offsetLeft < Intensity.MIN) {
      pinElement.style.left = Intensity.MIN;
    } else if (pinElement.offsetLeft > sliderLength) {
      pinElement.style.left = sliderLength + 'px';
    }
  };

  // Добавляет на пин слайдера обработчик события перетаскивания, изменяющий насыщенность фильтра
  pinElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var sliderLength = sliderLineElement.offsetWidth;
    var startCoordX = evt.clientX;

    // Обработчик перемещения мыши
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shiftX = startCoordX - moveEvt.clientX;
      startCoordX = moveEvt.clientX;

      evt.target.style.left = evt.target.offsetLeft - shiftX + 'px';
      limitPinMovement();
      changeEffectDepthBarFill();

      // Вычисляет процентное значение насыщенности
      var percentageValue = Math.floor((evt.target.offsetLeft / sliderLength) * 100);

      // Записывает значение насыщенности фильтра в поле input
      effectValueElement.value = percentageValue;

      // Применяет настройки фильтра к изображению
      applyFilterIntensity(percentageValue);
    };

    // Обработчик отпускания кнопки мыши - удаляет обработчики перемещения и отпускания
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // Задаёт изображению значение фильтра с соответствующим уровнем насыщенности
  var applyFilterIntensity = function (percentageValue) {
    var intensity = calculateIntensity(percentageValue, currentFilter);
    currentFilter.currentValue = intensity;
    previewImgElement.style.filter = createFilterStyle(currentFilter);
  };

  // Добавляет на филдесет с радиобаттонами фильтров обработчик события переключения кнопок, вызывающий смену фильтра изображения
  filtersFieldsetElement.addEventListener('change', function (evt) {
    window.filter.remove();

    if (evt.target.id === 'effect-none') {
      window.filter.hideSlider();
    } else {
      window.filter.showSlider();
      var filterClass = effectBtnIdToClassName[evt.target.id];
      previewImgElement.classList.add(filterClass);
      currentFilter = findFilter(evt.target.id);
      applyFilterIntensity(Intensity.DEFAULT);
      window.filter.resetInputValue();
      resetPin();
    }
  });

  return {

    // Сбрасывает стили фильтра у большого изображения
    remove: function () {
      previewImgElement.classList.forEach(function (elem) {
        if (elem.includes('effects__preview')) {
          previewImgElement.classList.remove(elem);
        }
      });
      previewImgElement.style.filter = '';
      currentFilter = {};
    },

    // Сбрасывает значение в поле насыщенности фильтра на значение по умолчанию
    resetInputValue: function () {
      effectValueElement.value = Intensity.DEFAULT;
    },

    // Скрывает слайдер интенсивности фильтра
    hideSlider: function () {
      sliderElement.classList.add('hidden');
    },

    // Показывает слайдер интенсивности фильтра
    showSlider: function () {
      if (sliderElement.classList.contains('hidden')) {
        sliderElement.classList.remove('hidden');
      }
    }
  };
})();
