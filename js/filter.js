// Модуль, отвечающий за применение эффекта фильтра к загруженному пользователем изображению

'use strict';

window.filter = (function () {

  var Level = {
    MAX: 100,
    DEFAULT: 20
  };

  var formElement = document.querySelector('.img-upload__form');
  var previewImgElement = formElement.querySelector('.img-upload__preview').querySelector('img');
  var effectValueElement = formElement.querySelector('.effect-level__value');
  var sliderElement = formElement.querySelector('.effect-level');

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
  var createFlterStyle = function (filter) {
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

  return {

    // Значение текущего выбранного фильтра
    currentFilter: {},

    // Задаёт изображению значение фильтра соответствующей насыщенности
    add: function (percentageValue, filter) {
      var intensity = calculateIntensity(percentageValue, filter);
      filter.currentValue = intensity;
      previewImgElement.style.filter = createFlterStyle(filter);
    },

    // Сбрасывает стили фильтра у большого изображения
    remove: function () {
      previewImgElement.classList.forEach(function (elem) {
        if (elem.includes('effects__preview')) {
          previewImgElement.classList.remove(elem);
        }
      });
      previewImgElement.style.filter = '';
      window.filter.currentFilter = {};
    },

    // Записывает в поле уровня фильтра значение насыщенности фильтра в процентах
    setInputValue: function (levelValue) {
      effectValueElement.value = levelValue;
    },

    // Сбрасывает значение в поле насыщенности фильтра на значение по умолчанию
    resetInputValue: function () {
      window.filter.setInputValue(Level.DEFAULT);
    },

    // Обработчик события переключения радиобаттонов фильтров, вызывающий смену фильтра изображения
    onBtnChange: function (evt) {
      window.filter.remove();

      if (evt.target.id === 'effect-none') {
        window.filter.hideSlider();
      } else {
        window.filter.showSlider();

        var filterClass = effectBtnIdToClassName[evt.target.id];
        previewImgElement.classList.add(filterClass);

        // Записывает текущее значение фильтра в переменную currentFilter
        window.filter.currentFilter = findFilter(evt.target.id);
        window.filter.setInputValue(Level.MAX);
      }
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
