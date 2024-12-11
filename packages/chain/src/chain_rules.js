import Conditions                  from '@rees46/segmentator-library/conditions';
import helper                      from '@rees46/segmentator-library/helper';
import { CHANNELS }                from './constants/index.js';
import { CONDITION_LABELS }        from './constants/index.js';
import { DATE_LABELS }             from './constants/index.js';
import { LABEL_PROPERTIES_EN }     from './constants/index.js';
import { LABEL_PROPERTIES_RU }     from './constants/index.js';
import { LABELS }                  from './constants/index.js';
import { MESSAGE_NOTATION_LEVELS } from './constants/index.js'
import { ORDER_STATUSES }          from './constants/index.js';
import { STATISTIC_LABELS }        from './constants/index.js';

/**
 * Блок условий цепочки
 * @param {Number} id
 * @param {string} selector
 * @param {string} modal_selector
 * @param {boolean} [readonly]
 * @param {Function} [on_load]
 * @param {Number} [shop_id]
 * @param {String} [period] Должна быть строка даты: YYYY-MM-DD - YYYY-MM-DD
 * @property {HTMLDivElement} container
 * @constructor
 * events for selector:
 *   chains:modal:show - событие когда нужно показать окно настроек
 *   chains:modal:hide - событие когда нужно показать скрыть настроек
 */
function ChainRules(id, selector, modal_selector, readonly, on_load, shop_id, period) {
  this.id = id;
  this.shop_id = shop_id || null;
  this.period = period || null;
  this.readonly = readonly || false;
  this.doc = document.querySelector(selector);
  this.container = helper.createElementFromHTML('<div class="module"></div>');
  this.withMessageNotation = false
  this.doc.appendChild(this.container);

  if (!this.readonly) {
    this.modal = new ChainModal(modal_selector, this);
  }

  this.changed = false;

  this.container.addEventListener('rules:change', () => {
    this.changed = true;
    this.isValid();
  });

  window.addEventListener('beforeunload', e => {
    if (this.changed) {
      e.returnValue = 'You are about to leave the editor without saving your changes. All your changes will be lost. Are you sure?';
    }

    return null;
  });

  /** Проверяем определен ли метод для ссылки на шаблон */
  if (!ChainRules.template_url) {
    throw 'Please, define `ChainRules.template_url` for redirect to edit chain template.\nUse `{{shop_id}}`, `{{chain_id}}` and `{{template_id}}` in the path.';
  }
  if (!ChainRules.template_preview) {
    throw 'Please, define `ChainRules.template_preview` for preview chain template.\nUse `{{shop_id}}`, `{{template_id}}` in the path.';
  }

  /** Запрашиваем цепочку */
  ChainRules.Conditions.shop_id = this.shop_id;
  ChainRules.Conditions.fetchSegmentatorData().then(() => this.fetchChain()).then(on_load);
}

ChainRules.Conditions = Conditions;

/**
 * Ссылка на редактирование шаблона
 * @type {string, null, function}
 */
ChainRules.template_url = null;

/**
 * Ссылка на просмотр шаблона
 * @type {string, null}
 */
ChainRules.template_preview = null;

ChainRules.Conditions.label_properties.en = Object.assign(ChainRules.Conditions.label_properties.en, LABEL_PROPERTIES_EN);
ChainRules.Conditions.label_properties.ru = Object.assign(ChainRules.Conditions.label_properties.ru, LABEL_PROPERTIES_RU);

/**
 * Каналы отправки сообщений
 * @type {{}}
 */
ChainRules.channels = CHANNELS;

ChainRules.digests = {};

ChainRules.chains = {};

//Расширяем настройки
ChainRules.Conditions.extend_properties = Object.assign(ChainRules.Conditions.extend_properties, {
  cart_count: {
    group: 'actions',
    type: 'input',
    operators: 'allNumber',
    properties: { type: 'number', min: 0, step: 1 },
  },
  cart_sum: {
    group: 'actions',
    type: 'input',
    operators: 'allNumber',
    properties: { type: 'number', min: 0, step: 1 },
  },
  received_chain_from_channel: {
    group: 'marketing',
    type: 'select',
    multiple: true,
    values: ChainRules.Conditions.channels[ChainRules.Conditions.locale],
    periods: ChainRules.Conditions.small_periods[ChainRules.Conditions.locale].concat([[{
      en: '3 months',
      ru: '3 месяца'
    }[ChainRules.Conditions.locale], 90]]),
  },
  add_product_to_cart: {
    group: 'actions',
    type: 'boolean',
    periods: ChainRules.Conditions.small_periods[ChainRules.Conditions.locale].concat([[{
      en: 'All time',
      ru: 'За все время'
    }[ChainRules.Conditions.locale], 'all']]),
  },
  channel_subscribe: {
    group: 'communications',
    type: 'select',
    values: ChainRules.channels[ChainRules.Conditions.locale]
  },
  digest_received: {
    group: 'marketing',
    type: 'select',
    switch: true,
    operators: 'yesNo',
    values: () => ChainRules.digests
  },
  digest_opened: {
    group: 'marketing',
    type: 'select',
    switch: true,
    operators: 'yesNo',
    values: () => ChainRules.digests
  },
  digest_clicked: {
    group: 'marketing',
    type: 'select',
    switch: true,
    operators: 'yesNo',
    values: () => ChainRules.digests
  },
  digest_purchased: {
    group: 'marketing',
    type: 'select',
    switch: true,
    operators: 'yesNo',
    values: () => ChainRules.digests
  },
  chain_received: {
    group: 'marketing',
    type: 'select',
    switch: true,
    operators: 'yesNo',
    periods: ChainRules.Conditions.small_periods[ChainRules.Conditions.locale].concat([[{
      en: 'All time',
      ru: 'За все время'
    }[ChainRules.Conditions.locale], 'all']]),
    values: () => ChainRules.chains
  },
  chain_opened: {
    group: 'marketing',
    type: 'select',
    switch: true,
    operators: 'yesNo',
    values: () => ChainRules.chains
  },
  chain_clicked: {
    group: 'marketing',
    type: 'select',
    switch: true,
    operators: 'yesNo',
    values: () => ChainRules.chains
  },
  chain_purchased: {
    group: 'marketing',
    type: 'select',
    switch: true,
    operators: 'yesNo',
    values: () => ChainRules.chains
  },
  current_chain_received: {
    group: 'marketing',
    type: 'boolean',
    periods: ChainRules.Conditions.small_periods[ChainRules.Conditions.locale].concat([[{
      en: 'All time',
      ru: 'За все время'
    }[ChainRules.Conditions.locale], 'all']]),
  },
  current_chain_opened: {
    group: 'marketing',
    type: 'boolean'
  },
  current_chain_clicked: {
    group: 'marketing',
    type: 'boolean'
  },
  current_chain_purchased: {
    group: 'marketing',
    type: 'boolean'
  },
  user_received_promocode: {
    group: 'promo_code_lists',
    type: 'with_property',
    operators: {
      between: ChainRules.Conditions.operator_values[ChainRules.Conditions.locale].between,
      equal: ChainRules.Conditions.operator_values[ChainRules.Conditions.locale].equal,
      not_equal: ChainRules.Conditions.operator_values[ChainRules.Conditions.locale].not_equal,
      less_or_equal: ChainRules.Conditions.operator_values[ChainRules.Conditions.locale].less_or_equal,
      more_or_equal: ChainRules.Conditions.operator_values[ChainRules.Conditions.locale].more_or_equal,
      less_than: ChainRules.Conditions.operator_values[ChainRules.Conditions.locale].less_than,
      more_than: ChainRules.Conditions.operator_values[ChainRules.Conditions.locale].more_than,
    },
    values: () => ChainRules.Conditions.promo_code_lists,
    properties: { type: 'date' }
  },
  user_used_promocode: {
    group: 'promo_code_lists',
    type: 'with_property',
    operators: {
      between: ChainRules.Conditions.operator_values[ChainRules.Conditions.locale].between,
      equal: ChainRules.Conditions.operator_values[ChainRules.Conditions.locale].equal,
      not_equal: ChainRules.Conditions.operator_values[ChainRules.Conditions.locale].not_equal,
      less_or_equal: ChainRules.Conditions.operator_values[ChainRules.Conditions.locale].less_or_equal,
      more_or_equal: ChainRules.Conditions.operator_values[ChainRules.Conditions.locale].more_or_equal,
      less_than: ChainRules.Conditions.operator_values[ChainRules.Conditions.locale].less_than,
      more_than: ChainRules.Conditions.operator_values[ChainRules.Conditions.locale].more_than,
    },
    values: () => ChainRules.Conditions.promo_code_lists,
    properties: { type: 'date' }
  }
});

/**
 * Шаблоны для каналов [{id: ID, name: NAME, url: URL, default: Boolean}]
 * @type {{email, web_push}}
 */
ChainRules.templates = {};

/**
 * Список шаблонов c ошибками[{id: ID, shop_id: SHOP_ID,...}]
 */
ChainRules.invalid_email_templates = [];
/**
 * Доступные события
 * @type {{}}
 */
ChainRules.events = {};
ChainRules.default_events = [];
ChainRules.order_statuses = ORDER_STATUSES;

/**
 * Статистика по блокам
 * @type {{}}
 */
ChainRules.statistics = {};

/**
 * Заголовки статистики
 * @type {{}}
 */
ChainRules.statistic_labels = STATISTIC_LABELS;

/**
 * Обработка данных
 * @param {Array} data
 */
ChainRules.prototype.render = function (data) {
  this.container.textContent = '';
  this.changed = false;

  this.module = new ChainModule(this, this.container, data);
  this.module.render();
  this.container.dispatchEvent(new Event('rules:render'));
};

ChainRules.prototype.onUpdate = function () {
  this.render(this.module.getData());
  this.container.dispatchEvent(new Event('rules:change', {bubbles: true}));
};

/**
 * Проверяет валидность всех правил
 * @return {Boolean}
 */
ChainRules.prototype.isValid = function () {
  return this.module.isValid();
};

/**
 * Возвращает объект для сохранения
 */
ChainRules.prototype.toJSON = function () {
  return JSON.stringify(this.module.getData());
};

/**
 * Добавляет мерчантов в настройки
 */
ChainRules.prototype.addMerchants = function() {
  ChainRules.Conditions.extend_properties.item_merchant = {
    group: 'product',
    type: 'select',
    operators: 'yesNo',
    multiple: true,
    values: ChainRules.Conditions.merchants
  };
};

/**
 * Получает данные цепочки
 */
ChainRules.prototype.fetchChain = function () {
  const params = new URLSearchParams();
  params.append('locale', ChainRules.Conditions.locale);

  if (this.shop_id) {
    params.append('shop_id', this.shop_id);
  }

  if (this.period) {
    params.append('period', this.period);
  }

  return fetch(API_HOST + '/api/v2/chains/' + this.id + '?' + params.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
  }).then(r => {
    if (r.ok) {
      return r.json();
    } else {
      throw r.status + ': ' + r.statusText;
    }
  }).then(r => {
    //Сохраняем данные в переменные
    for (let v of ['statistics', 'templates', 'events', 'default_events', 'digests', 'chains', 'invalid_email_templates']) {
      ChainRules[v] = r.data.chain[v];
    }
    this.render(r.data.chain.rules);
    this.addMerchants();

    return true;
  });
};

/**
 * @param {{}} data
 * @return {Promise}
 */
ChainRules.prototype.saveDraft = function (data) {
  return fetch(API_HOST + '/api/v2/chains/' + this.id, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({shop_id: this.shop_id, draft_rules: data})
  }).then(r => {
    if (r.ok) {
      this.changed = false;
      return r.json();
    } else {
      throw r.status + ': ' + r.statusText;
    }
  });
};

/**
 * Вызывается для создания нового шаблона.
 * @param {string} template_id
 * @param {string} channel
 * @return {Promise}
 */
ChainRules.prototype.createNewTemplate = function (template_id, channel) {
  return fetch(API_HOST + '/api/v2/chain_templates/copy', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      shop_id: this.shop_id,
      chain_id: this.id,
      template_id: template_id,
      channel: channel
    })
  }).then(r => {
    if (r.ok) {
      return r.json();
    } else {
      throw r.status + ': ' + r.statusText;
    }
  });
};

// ------------------------- ChainModule ------------------------->
/**
 * @param {ChainRules} root
 * @param {Element} container
 * @param {Array} data
 * @param {String} [tree]
 * @constructor
 */
function ChainModule(root, container, data, tree) {
  this.root = root;
  this.container = container;
  this.tree = tree;
  /**
   * @type {ChainBlock[]}
   */
  this.blocks = [];
  this.parse(data);
}

/**
 * Обработка данных
 * @param data
 */
ChainModule.prototype.parse = function (data) {
  data.map(this.append.bind(this));
};

/**
 * Вставление блока в дерево
 * @param {{}} data
 * @param {Number} [position]
 */
ChainModule.prototype.append = function (data, position) {
  let module = new ChainBlock(this.root, this, data);

  if (typeof position !== 'number') {
    position = this.blocks.length;
  }

  this.blocks.splice(position, 0, module);
};

/**
 * @param {ChainBlock} block
 */
ChainModule.prototype.delete = function (block) {
  //Для условия берем все блоки из секции yes и склеиваем с текущими
  if (['condition', 'ab_test', 'http'].indexOf(block.data.type) !== -1 && block.left_module) {
    this.blocks = this.blocks.concat(block.left_module.blocks);
  }
  this.blocks.splice(this.blocks.indexOf(block), 1);
  this.root.onUpdate();
};

/**
 * Вставляет данные сразу в корень
 */
ChainModule.prototype.render = function () {

  /**
   * Создаем модули
   * @param {ChainBlock} module
   */
  this.blocks.forEach(function (block) {
    this.container.appendChild(block.html());
    block.onUpdate();
  }.bind(this));

  //Проверяем, есть ли заполненный алгоритм
  let is_algorithm = true;
  for (let i in this.blocks) {
    //Если в массиве присутствует условие или a/b тест, то добавлять в конец пустой блок не нужно.
    //Убрали алгоритм, чтобы можно было добавлять заполняющие алгоритмы
    if (['condition', /*'algorithm', */'ab_test', 'http'].indexOf(this.blocks[i].data.type) !== -1) {
      is_algorithm = false;
    }
  }

  //Добавляем в конец пустой блок для вставки алгоритма
  if (is_algorithm && !this.root.readonly) {
    let empty_algorithm = new ChainBlock(this.root, this, {type: 'empty_action'});
    this.container.appendChild(empty_algorithm.html());
  }
};

/**
 * Обновляет позиции элементов
 */
ChainModule.prototype.updateCenterPositions = function () {

  //Проверяем, есть ли условие
  let is_condition = false;
  for (let i in this.blocks) {
    //Если в массиве присутствует условие или a/b тест, то добавлять в конец пустой блок не нужно.
    //Убрали алгоритм, чтобы можно было добавлять заполняющие алгоритмы
    if (['condition', /*'algorithm', */'ab_test', 'http'].indexOf(this.blocks[i].data.type) !== -1) {
      is_condition = true;
      break;
    }
  }
  let condition = this.container.querySelector(':scope > .module__item > .module__item > .module__item > .module__block.condition, :scope > .module__item > .module__item > .module__item > .module__block.ab_test, :scope > .module__item > .module__item > .module__item > .module__block.http');
  if (is_condition && condition) {
    let left = condition.getBoundingClientRect().left + condition.offsetWidth / 2;
    [].forEach.call(this.container.querySelectorAll(':scope > .module__item > .module__block:not(.condition), :scope > .module__item > .module__block:not(.http), :scope > .module__item > .add-condition > .arrow'), item => {
      let pos = item.getBoundingClientRect().left + item.offsetWidth / 2;
      let module__item = item.closest('.module__item');
      if (left < pos - 2) {
        module__item.style.marginRight = ((pos - left) * 2) + 'px';
      }
      if (left > pos + 2) {
        module__item.style.marginLeft = ((left - pos) * 2) + 'px';
      }
    });
  }
};

/**
 * Добавление блока действия
 * @param {ChainBlock} block
 * @param {'static' | 'dynamic'} delayType
 */
ChainModule.prototype.addDelay = function (block, delayType = 'static') {
  let index = this.blocks.indexOf(block);
  if (index === -1) {
    index = this.blocks.length;
  }
  this.root.modal.editDelay('86400', function (value) {
    this.append({type: 'delay', delay: value, delay_type: delayType, id: this.guid()}, index);
    this.root.onUpdate();
  }.bind(this), LABELS[ChainRules.Conditions.locale][delayType === 'dynamic' ? 'dynamic_delay_title' : 'delay_title']);
};


/**
 * Добавление блока условия
 * @param {ChainBlock} block
 */
ChainModule.prototype.addCondition = function (block) {
  let index = this.blocks.indexOf(block);
  if (index === -1) {
    index = this.blocks.length;
  }
  let cutting = this.getData().slice(index).filter(function (v) {
    return v.type !== 'event';
  });
  this.root.modal.editCondition(null, function (value) {
    this.blocks.splice(index);
    this.append({
      id: this.guid(),
      type: 'condition',
      case: [{when: value, rules: []}],
      else: cutting
    });
    this.root.onUpdate();
  }.bind(this));
};

/**
 * Добавление блока А/В теста
 * @param block
 */
ChainModule.prototype.addABTest = function (block) {
  let index = this.blocks.indexOf(block);

  if (index === -1) {
    index = this.blocks.length;
  }
  let cutting = this.getData().slice(index).filter(function (v) {
    return v.type !== 'event';
  });

  const createdAt = new Date().toISOString();

  this.blocks.splice(index);
  this.append({type: 'ab_test', created_at: createdAt, a: cutting, b: []});
  this.root.onUpdate();
  this.root.modal.hide();
};

/**
 * Добавление блока HTTP запроса
 * @param block
 */
ChainModule.prototype.addHttp = function (block) {
  let index = this.blocks.indexOf(block);
  if (index === -1) {
    index = this.blocks.length;
  }
  let cutting = this.getData().slice(index).filter(v => v.type !== 'event');
  this.root.modal.editHttp({id: this.guid(), channel: 'http'}, function (data) {
    this.blocks.splice(index);
    //Поддерживаем формат как в блоке message и в condition
    this.append({
      id: this.guid(),
      type: 'http',
      case: [{when: data, rules: []}],
      else: cutting
    }, index);
    this.root.onUpdate();
  }.bind(this));
};

/**
 * Добавление блока действия
 * @param {ChainBlock} block
 */
ChainModule.prototype.addMessage = function (block) {
  let index = this.blocks.indexOf(block);
  if (index === -1) {
    index = this.blocks.length;
  }
  this.root.modal.editMessage('email', null, (channel, template_id) => {
    this.append({
      type: 'message',
      channel: channel,
      template_id: template_id,
      id: this.guid()
    }, index);
    this.root.onUpdate();
  });
  this.root.doc.dispatchEvent(new Event('chains:modal:show'));
};

/**
 * Добавление уникальных обозначений для сообщений
 */
ChainModule.prototype.addMessageNotations = function () {
  if (this.root.readonly && this.root.withMessageNotation) {
    this.changeMessageNotations(this.root.module.blocks, '');
  }
};

/**
 * @param {ChainBlock[]} chainBlocks
 * @param {string} notationText
 * @param {string} nextNotationLevel
 */
ChainModule.prototype.changeMessageNotations = function (chainBlocks, notationText, nextNotationLevel) {
  let notation = notationText;
  let nextLevel = nextNotationLevel || MESSAGE_NOTATION_LEVELS[0];

  for (const chain of chainBlocks) {
    if (chain.data.type === 'message') {
      notation = `${notation}${nextLevel}`;
      nextLevel = MESSAGE_NOTATION_LEVELS[0];

      const notationBlock = chain.block.querySelector('.block__notation');

      if (notationBlock) {
        notationBlock.textContent = notation;
      }
    }

    if (chain.left_module) {
      this.changeMessageNotations(chain.left_module.blocks, notation, MESSAGE_NOTATION_LEVELS[0]);
    }

    if (chain.right_module) {
      this.changeMessageNotations(chain.right_module.blocks, notation, MESSAGE_NOTATION_LEVELS[1]);
    }

    if (chain.right_modules) {
      chain.right_modules.forEach((module, index) => {
        if (module?.blocks?.length) {
          this.changeMessageNotations(module.blocks, notation, MESSAGE_NOTATION_LEVELS[1 + index]);
        }
      });
    }
  }
}

/**
 * @return {Array}
 */
ChainModule.prototype.getData = function () {
  return this.blocks.map(function (block) {
    switch (block.data.type) {

      case 'condition':
      case 'http':
        if (block.left_module) {
          block.data.else = block.left_module.getData();
        }
        if (block.right_modules) {
          for (let i = 0; i < block.data.case.length; i++) {
            if (block.right_modules[i]) {
              block.data.case[i].rules = block.right_modules[i].getData();
            }
          }
        }
        return block.data;

      case 'ab_test':
        if (block.left_module) {
          block.data.a = block.left_module.getData();
        }
        if (block.right_module) {
          block.data.b = block.right_module.getData();
        }
        return block.data;

      default:
        return block.data;
    }
  }).filter(v => v !== null);
};

/**
 * Generate unique id
 * @returns {string}
 */
ChainModule.prototype.guid = function () {
  let s4 = function () {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

/**
 * Проверяет валидный ли модуль.
 * @return {Boolean}
 */
ChainModule.prototype.isValid = function () {
  //Если в ветке ничего нет
  // if( this.blocks.length === 0 ) {
  // 	return false
  // }

  //Все блоки должны быть валидны
  if (this.blocks.map(v => v.isValid()).filter(v => !v).length > 0) {
    return false;
  }

  //Проверяем последний блок. Должен быть или условие или сообщение
  // return ['condition', 'message', 'ab_test'].indexOf(this.blocks[this.blocks.length - 1].data.type) !== -1 && this.blocks[this.blocks.length - 1].isValid()
  return true;
};

// ------------------------ ChainBlock ------------------------>
/**
 * @param {ChainRules} root
 * @param {ChainModule} module
 * @param {{id,type,event,filters}} data
 * @constructor
 */
function ChainBlock(root, module, data) {
  this.root = root;
  this.module = module;
  this.data = data;
}

/**
 * Возвращает структуру для стрелки с кнопкой добавления
 * @return {HTMLDivElement}
 */
ChainBlock.prototype.htmlAddActionOrCondition = function () {
  let item = helper.createElementFromHTML('<div class="module__item"></div>'),
    inner = helper.createElementFromHTML('<div class="add-condition add-condition__inner center"></div>');
  item.appendChild(inner);

  if (!this.root.readonly) {
    let button = helper.createElementFromHTML('<div class="plus"></div>');
    inner.appendChild(button);
    inner.appendChild(helper.createElementFromHTML('<div class="tooltip tooltip-add"><span>' + CONDITION_LABELS[ChainRules.Conditions.locale].add_condition + '</span></div>'));

    button.addEventListener('click', this.choiceAddAction.bind(this));
  }

  //Стрелка вниз
  inner.appendChild(helper.createElementFromHTML('<div class="arrow down"></div>'));

  return item;
};

let notationController = new AbortController()

/**
 * Отрисовывает html самого модуля по типу
 * @return {Element}
 */
ChainBlock.prototype.buildBlock = function () {

  switch (this.data.type) {

    //Блок для события
    case 'event':
      this.block = this.buildEvent();
      break;

    case 'condition':
      this.block = this.buildCondition();

      //Указываем верхний отступ для корректного отображения
      this.root.container.addEventListener('rules:change', () => this.module.updateCenterPositions());
      this.root.container.addEventListener('rules:render', () => this.module.updateCenterPositions());
      break;

    case 'delay':
      this.block = this.buildDelay();
      break;

    case 'message':
      this.block = this.buildMessage();

      // Добавляем уникальные обозначения для сообщений
      notationController.abort()
      notationController = new AbortController()
      this.root.container.addEventListener('rules:change', () => this.module.addMessageNotations(), { signal: notationController.signal });
      this.root.container.addEventListener('rules:render', () => this.module.addMessageNotations(), { signal: notationController.signal });
      break;

    case 'http':
      this.block = this.buildHttp();

      //Указываем верхний отступ для корректного отображения
      this.root.container.addEventListener('rules:change', () => this.module.updateCenterPositions());
      this.root.container.addEventListener('rules:render', () => this.module.updateCenterPositions());
      break;

    case 'ab_test':
      this.block = this.buildABTest();

      //Указываем верхний отступ для корректного отображения
      this.root.container.addEventListener('rules:change', () => this.module.updateCenterPositions());
      this.root.container.addEventListener('rules:render', () => this.module.updateCenterPositions());
      break;

    case 'empty_action':
      this.block = this.buildEmptyAlgorithm();
      break;
  }

  //Проверяем валидность блока
  this.isValid();

  return this.block;
};

/**
 * Выбирает, какой блок вставлять
 */
ChainBlock.prototype.choiceAddAction = function () {

  //Строим контент
  const delay = helper.createElementFromHTML('<a class="btn btn-square btn-delay"></a>');
  const dynamicDelay = helper.createElementFromHTML('<a class="btn btn-square btn-dynamic-delay"></a>');
  const condition = helper.createElementFromHTML('<a class="btn btn-square btn-condition"></a>');
  const message = helper.createElementFromHTML('<a class="btn btn-square"></a>');
  const ab_test = helper.createElementFromHTML('<a class="btn btn-square btn-ab-test"></a>');
  const http = helper.createElementFromHTML('<a class="btn btn-square btn-http"></a>');

  delay.innerHTML = '<i class="r46-icon r-size-32 mb-2 mt-2">pause_32</i><div>' + LABELS[ChainRules.Conditions.locale].delay + '</div>';
  delay.addEventListener('click', this.module.addDelay.bind(this.module, this, 'static'));
  dynamicDelay.innerHTML = '<i class="r46-icon r-size-32 mb-2 mt-2">dynamic_pause_32</i><div>' + LABELS[ChainRules.Conditions.locale].dynamic_delay + '</div>';
  dynamicDelay.addEventListener('click', this.module.addDelay.bind(this.module, this, 'dynamic'));
  condition.innerHTML = '<i class="r46-icon r-size-32 mb-2 mt-2">condition_32</i><div>' + LABELS[ChainRules.Conditions.locale].condition + '</div>';
  condition.addEventListener('click', this.module.addCondition.bind(this.module, this));
  message.innerHTML = '<i class="r46-icon r-size-32 mb-2 mt-2">email_32</i><div>' + LABELS[ChainRules.Conditions.locale].message + '</div>';
  message.addEventListener('click', this.module.addMessage.bind(this.module, this));
  ab_test.innerHTML = '<i class="r46-icon r-size-32 mb-2 mt-2">ab_test_32</i><div>' + LABELS[ChainRules.Conditions.locale].ab_test + '</div>';
  ab_test.addEventListener('click', this.module.addABTest.bind(this.module, this));
  http.innerHTML = '<i class="r46-icon r-size-32 mb-2 mt-2">http</i><div>' + LABELS[ChainRules.Conditions.locale].http + '</div>';
  http.addEventListener('click', this.module.addHttp.bind(this.module, this));

  let block = helper.createElementFromHTML('<div class="modal_choice_block"></div>');
  block.appendChild(delay);
  const currentEvent = this.module.root.module.blocks.find(block => block.data.type === 'event');

  if (currentEvent && currentEvent.data.event === 'purchase') {
    block.appendChild(dynamicDelay);
  }

  block.appendChild(condition);
  block.appendChild(message);
  block.appendChild(ab_test);
  block.appendChild(http);

  this.setTargetBlock('plus');
  //Показываем окно
  this.root.modal.show(LABELS[ChainRules.Conditions.locale].add_block_title, block);
};

/**
 * Обновляет данные в блоке
 */
ChainBlock.prototype.onUpdate = function () {
  switch (this.data.type) {
    case 'delay':
      this.block.querySelector('.block__text span').textContent = this.secondsToStr(this.data.delay * 1);
      this.isValid();
      break;
    case 'message':
      this.block.querySelector('.block__text span').textContent = ChainRules.channels[ChainRules.Conditions.locale][this.data.channel];
      this.isValid();
      break;
  }
};

/**
 * Строит заголовок блока
 * @param icon
 * @param title
 * @return {HTMLElement}
 */
ChainBlock.prototype.buildBlockTitle = function (icon, title) {
  return helper.createElementFromHTML('<div class="block__type" data-icon="' + icon + '">' + title + '</div>');
};

/**
 * Стандартный блок - обертка
 * @return {HTMLElement}
 */
ChainBlock.prototype.buildBlockTemplate = function (type, icon, title, text) {
  let block = helper.createElementFromHTML('<div class="module__item"></div>'),
    box = helper.createElementFromHTML('<div class="module__block ' + type + '"></div>'),
    txt = helper.createElementFromHTML('<div class="block__text"></div>'),
    inner = helper.createElementFromHTML('<div class="' + type + '__inner"></div>');
  block.appendChild(box);
  box.appendChild(inner);
  inner.appendChild(this.buildBlockTitle(icon, title));
  if (text) {
    inner.appendChild(txt);
  }

  txt.appendChild(helper.createElementFromHTML('<span>' + text + '</span>'));

  if (!this.root.readonly) {
    let actions = helper.createElementFromHTML('<div class="module__actions"></div>');
    actions.appendChild(this.buildTemplateAction('settings', this.edit.bind(this)));
    actions.appendChild(this.buildTemplateAction('delete', this.module.delete.bind(this.module, this)));
    txt.appendChild(actions);
  }

  return block;
};

/**
 * Стандартная кнопка
 * @param type
 * @param callback
 * @return {HTMLElement}
 */
ChainBlock.prototype.buildTemplateAction = function (type, callback) {
  let link = helper.createElementFromHTML('<a class="' + type + ' r46-icon">' + type + '_solid</a>');
  link.addEventListener('click', callback);
  let item = helper.createElementFromHTML('<div class="module__action"></div>');
  item.appendChild(link);
  return item;
};

/**
 * Строит блок задержки
 */
ChainBlock.prototype.buildDelay = function () {
  const delay = this.data?.delay_type  === 'dynamic' ? 'dynamic_delay' : 'delay';
  const icon = delay === 'dynamic_delay' ? 'dynamic_pause' : 'pause';
  const title = LABELS[ChainRules.Conditions.locale][delay];
  return this.buildBlockTemplate(delay, icon, title, this.secondsToStr(this.data.delay * 1));
};

/**
 * Конвертирует секунды в строку
 * @param {number} seconds
 * @param {Boolean} [return_array]
 * @return {string|{}}
 */
ChainBlock.prototype.secondsToStr = function (seconds, return_array) {
  let years = Math.floor(seconds / 31536000),
    days = Math.floor((seconds %= 31536000) / 86400),
    hours = Math.floor((seconds %= 86400) / 3600),
    minutes = Math.floor((seconds %= 3600) / 60);
  seconds = seconds % 60;

  if (return_array) {
    return {y: years, d: days, h: hours, m: minutes, s: seconds};
  }

  if (days || hours || seconds || minutes) {
    return (years ? years + ' ' + DATE_LABELS[ChainRules.Conditions.locale].year + ' ' : '') +
      (days ? days + ' ' + DATE_LABELS[ChainRules.Conditions.locale].day + ' ' : '') +
      (hours ? hours + ' ' + DATE_LABELS[ChainRules.Conditions.locale].hour + ' ' : '') +
      (minutes ? minutes + ' ' + DATE_LABELS[ChainRules.Conditions.locale].minute + ' ' : '') +
      (seconds ? seconds + ' ' + DATE_LABELS[ChainRules.Conditions.locale].second : '');
  }

  return '< 1' + DATE_LABELS[ChainRules.Conditions.locale].second;
};

/**
 * Строит блок для отправки сообщения
 */
ChainBlock.prototype.buildMessage = function () {
  let block = this.buildBlockTemplate(this.data.type, 'email', LABELS[ChainRules.Conditions.locale].message, this.data.channel);

  //Добавляем CTR
  if (ChainRules.statistics && ChainRules.statistics[this.data.id] && ChainRules.statistics[this.data.id].sent > 0) {
    block.querySelector('.block__type').setAttribute('data-ctr', 'CTR: ' + (Math.round(ChainRules.statistics[this.data.id].clicked / ChainRules.statistics[this.data.id].sent * 1000) / 10) + '%');
  }

  //Добавляем Template ID
  if (this.data.template_id) {
    let template_id = helper.createElementFromHTML(
      `<div class="block__template-id">ID: ${this.data.template_id}</div>`
    );
    block.querySelector('.message__inner').appendChild(template_id);
  }

  //Если в режиме чтения, добавляем тултип со статистикой
  if (this.root.readonly && ChainRules.statistics[this.data.id] && typeof $ !== 'undefined') {
    $(block).data('title', function () {
      let tooltip = $('<div class="d-flex flex-column" style="min-width: 160px"></div>');
      for (var v in ChainRules.statistics[this.data.id]) {
        tooltip.append('<div class="d-flex"><div class="text-left">' + ChainRules.statistic_labels[ChainRules.Conditions.locale][v] + '</div><div class="flex-fill text-right ml-2 r-weight-600">' + ChainRules.statistics[this.data.id][v] + '</div></div>');
      }
      return tooltip.html();
    }.bind(this)).tooltip({container: 'body', toggle: 'tooltip', html: true, placement: 'bottom'});
  }
  if (ChainRules.templates[this.data.channel]) {
    let message_template = helper.createElementFromHTML('<div class="message_template">' + ChainRules.templates[this.data.channel].find(v => v.id == this.data.template_id)?.name + '</div>');
    block.querySelector('.block__text').appendChild(message_template);
  }

  if (this.root.readonly && this.root.withMessageNotation) {
    let message_notation = helper.createElementFromHTML('<div class="block__notation"></div>');
    block.querySelector('.message__inner').appendChild(message_notation);
  }

  //Добавляем кнопку предпросмотра
  let preview = this.buildTemplateAction('preview', function () {
    if (ChainRules.templates[this.data.channel]) {
      let template = ChainRules.templates[this.data.channel].find(v => v.id == this.data.template_id);
      if (template) {
        window.open(ChainRules.template_preview.replace('{{template_id}}', template.id).replace('{{shop_id}}', this.root.shop_id));
      }
    }
  }.bind(this));
  if (this.root.readonly) {
    let actions = helper.createElementFromHTML('<div class="module__actions"></div>');
    actions.appendChild(preview);
    block.querySelector('.block__text').appendChild(actions);
  } else {
    let action = block.querySelector('.module__actions .module__action:first-child');
    //Insert after
    action.parentNode.insertBefore(preview, action.nextSibling);
  }

  return block;
};

/**
 * Строит блок для отправки HTTP запроса
 */
ChainBlock.prototype.buildHttp = function () {
  //todo временно для подержания перехода со старой версии
  this.data.case ||= [{
    when: Object.assign({
      code: '200',
      id: this.module.guid(),
      channel: 'http'
    }, this.data.http_data), rules: []
  }];

  let block = this.buildConditionTemplate(
    conditions => conditions.url,
    'editHttp',
    () => CONDITION_LABELS[ChainRules.Conditions.locale].else,
    i => this.data.case[i].when.code,
  );

  //Если в режиме чтения, добавляем тултип со статистикой
  if (this.root.readonly && typeof $ !== 'undefined') {
    [].forEach.call(block.querySelectorAll('.module__block.http .block__text[id]'), item => {
      let id = item.getAttribute('id');
      $(item).data('title', () => {
        let tooltip = $('<div class="d-flex flex-column" style="min-width: 160px"></div>');
        tooltip.append('<div class="d-flex"><div class="text-left">' + ChainRules.statistic_labels[ChainRules.Conditions.locale].sent + '</div><div class="flex-fill text-right ml-2 r-weight-600">' + ChainRules.statistics[id].sent + '</div></div>');
        return tooltip.html();
      }).tooltip({container: 'body', toggle: 'tooltip', html: true, placement: 'bottom'});
    });
  }

  return block;
};

/**
 * Строит блок для события
 */
ChainBlock.prototype.buildEvent = function () {
  let block = helper.createElementFromHTML('<div class="module__item"></div>'),
    box = helper.createElementFromHTML('<div class="module__block ' + this.data.type + '"></div>'),
    text = helper.createElementFromHTML('<div class="block__text">' + (ChainRules.events[this.data.event] || this.data.event) + '</div>'),
    inner = helper.createElementFromHTML('<div class="' + this.data.type + '__inner"></div>');
  block.appendChild(box);
  box.appendChild(inner);
  inner.appendChild(this.buildBlockTitle('play', LABELS[ChainRules.Conditions.locale].event));
  inner.appendChild(text);

  if (!this.root.readonly) {
    let action = helper.createElementFromHTML('<div class="module__actions"></div>');
    action.appendChild(this.buildTemplateAction('settings', this.edit.bind(this)));
    text.appendChild(action);
  }

  return block;
};

/**
 * Строит блок условия
 */
ChainBlock.prototype.buildCondition = function () {
  const multipleValue = CONDITION_LABELS[ChainRules.Conditions.locale].multiple;
  const multiple = typeof multipleValue === 'function' ? multipleValue : multipleValue;

  return this.buildConditionTemplate(
    conditions => conditions.length === 1 ? ChainRules.Conditions.label_properties[ChainRules.Conditions.locale][conditions[0]] : multiple,
    'editCondition',
    () => this.data.case.length > 1 ? CONDITION_LABELS[ChainRules.Conditions.locale].else : CONDITION_LABELS[ChainRules.Conditions.locale].no,
    i => this.data.case.length > 1 ? (CONDITION_LABELS[ChainRules.Conditions.locale].option + ' ' + (i + 1)) : CONDITION_LABELS[ChainRules.Conditions.locale].yes,
  );
};

/**
 * Строит шаблон блока условия
 * @param {Function} block_text
 * @param {string} modal_editor_name
 * @param {Function} variant_left
 * @param {Function} variant_right
 */
ChainBlock.prototype.buildConditionTemplate = function (block_text, modal_editor_name, variant_left, variant_right) {
  let block = helper.createElementFromHTML('<div class="module__item"></div>');
  let html = helper.createElementFromHTML('<div class="module__item"></div>');

  //Left
  let left = helper.createElementFromHTML('<div class="condition-variant left" data-variant="' + variant_left() + '"></div>');
  this.left_module = new ChainModule(this.root, left, this.data.else || [], 'no');
  this.left_module.render();

  //Center - вставляем дефолтный блок без блоков с текстом
  let center = helper.createElementFromHTML('<div class="module__item"></div>'),
    box = helper.createElementFromHTML('<div class="module__block ' + this.data.type + '"></div>'),
    inner = helper.createElementFromHTML('<div class="' + this.data.type + '__inner"></div>');
  center.appendChild(box);
  box.appendChild(inner);
  inner.appendChild(this.buildBlockTitle(this.data.type, LABELS[ChainRules.Conditions.locale][this.data.type]));

  //Добавляем блоки текста условий
  this.data.case.forEach(function (c, i) {
    let conditions = Array.isArray(c.when) ? c.when.reduce((a, b) => a.concat(b.map(v => v.type)), []) : c.when;

    //Текстовый блок условия
    let text = helper.createElementFromHTML('<div class="block__text">' + block_text(conditions) + '</div>');
    if (typeof c.when.id != 'undefined') {
      text.setAttribute('id', c.when.id);
    }

    if (!this.root.readonly) {
      //Кнопки управления в текстовом блоке
      let actions = helper.createElementFromHTML('<div class="module__actions"></div>');
      actions.appendChild(this.buildTemplateAction('settings', () => {
        this.setTargetBlock();
        this.root.modal[modal_editor_name](c.when, value => {
          c.when = value;
          this.root.onUpdate();
        });
      }));

      //Максимум 6 штук
      if (this.data.case.length < 6) {
        actions.appendChild(this.buildTemplateAction('plus_circle', () => {
          this.root.modal[modal_editor_name](null, value => {
            this.data.case.splice(i + 1, 0, {when: value, rules: []});
            this.right_modules.splice(i + 1, 0, null);
            this.root.onUpdate();
          });
        }));
      }

      actions.appendChild(this.buildTemplateAction('delete', () => {
        //Если условий больше 1, то удаляем их, или удаляем сам блок
        if (this.data.case.length > 1) {
          this.data.case.splice(i, 1);
          this.right_modules.splice(i, 1);
          this.root.onUpdate();
        } else {
          this.module.delete(this);
        }
      }));

      text.appendChild(actions);
    }

    //Добавляем текстовый блок
    center.querySelector('.' + this.data.type + '__inner').appendChild(text);
  }.bind(this));

  //Right
  let right = helper.createElementFromHTML('<div class="condition-variants"></div>');
  this.right_modules = [];
  this.data.case.forEach(function (c, i) {
    let variant = helper.createElementFromHTML('<div class="condition-variant right" data-variant="' + variant_right(i) + '"></div>');
    right.appendChild(variant);
    let module = new ChainModule(this.root, variant, c.rules, 'yes');
    module.render();
    this.right_modules.push(module);
  }.bind(this));

  block.appendChild(html);
  let variants_left = helper.createElementFromHTML('<div class="condition-variants"></div>');
  variants_left.classList.add('condition-variants-' + this.data.case.length);
  variants_left.appendChild(left);
  html.appendChild(variants_left);
  html.appendChild(center);
  let variants_right = helper.createElementFromHTML('<div class="condition-variants"></div>');
  variants_right.classList.add('condition-variants-' + this.data.case.length);
  variants_right.appendChild(right);
  html.appendChild(variants_right);

  return block;
};

/**
 * Строит блок A/B теста
 */
ChainBlock.prototype.buildABTest = function () {
  let block = helper.createElementFromHTML('<div class="module__item"></div>');
  let html = helper.createElementFromHTML('<div class="module__item"></div>');

  const createdAt = this.data.created_at
    ? new Date(this.data.created_at).toLocaleDateString('ru-RU')
    : '';

  //Left
  let left = helper.createElementFromHTML('<div class="condition-variant left" data-variant="A"></div>');
  this.left_module = new ChainModule(this.root, left, this.data.a, 'a');
  this.left_module.render();

  //Center
  const center = helper.createElementFromHTML('<div class="module__item"></div>');
  const box = helper.createElementFromHTML(
    '<div class="module__block ' + this.data.type + '"></div>'
  );
  const text = helper.createElementFromHTML(
    '<div class="block__text">' +
      LABELS[ChainRules.Conditions.locale].ab_test +
      ' ' +
      createdAt +
      '</div>'
  );
  const inner = helper.createElementFromHTML('<div class="' + this.data.type + '__inner"></div>');

  center.appendChild(box);
  box.appendChild(inner);
  inner.appendChild(this.buildBlockTitle('condition', LABELS[ChainRules.Conditions.locale].ab_test_title));
  inner.appendChild(text);

  if (!this.root.readonly) {
    let actions = helper.createElementFromHTML('<div class="module__actions"></div>');
    actions.appendChild(this.buildTemplateAction('delete', this.module.delete.bind(this.module, this)));
    text.appendChild(actions);
  }

  //Right
  let right = helper.createElementFromHTML('<div class="condition-variant right" data-variant="B"></div>');
  this.right_module = new ChainModule(this.root, right, this.data.b, 'b');
  this.right_module.render();

  block.appendChild(html);
  let variants_left = helper.createElementFromHTML('<div class="condition-variants"></div>');
  variants_left.appendChild(left);
  html.appendChild(variants_left);
  html.appendChild(center);
  let variants_right = helper.createElementFromHTML('<div class="condition-variants"></div>');
  variants_right.appendChild(right);
  html.appendChild(variants_right);

  return block;
};

/**
 * Строит блок действия
 */
ChainBlock.prototype.buildEmptyAlgorithm = function () {
  let block = helper.createElementFromHTML('<div class="module__item add-algorithm"></div>'),
    button = helper.createElementFromHTML('<button class="button"><i class="r46-icon">plus_circle</i></button>');
  block.addEventListener('click', () => this.setTargetBlock('add-algorithm'));
  button.addEventListener('click', this.module.addMessage.bind(this.module));
  block.appendChild(button);
  return block;
};

/**
 * Открывает попам с редактированием блока в зависимости от его компонента
 */
ChainBlock.prototype.edit = function () {
  this.setTargetBlock();
  switch (this.data.type) {
    case 'delay':
      const delayType = this.data?.delay_type || 'static';
      this.root.modal.editDelay(this.data.delay, (value) => {
        this.data.delay = value;
        this.onUpdate();
        this.root.container.dispatchEvent(new Event('rules:change', { bubbles: true }));
      }, LABELS[ChainRules.Conditions.locale][delayType === 'dynamic' ? 'dynamic_delay_title' : 'delay_title']);
      break;
    case 'message':
      this.root.modal.editMessage(this.data.channel, this.data.template_id, (channel, template_id) => {
        this.data.template_id = template_id;
        this.data.channel = channel;
        this.onUpdate();
      });
      break;
    case 'event':
      this.root.modal.editEvent(this.data.event, this.data.cancel_events, this.data.filters, this.data.labels || null, this.data.ignore_silent_mode || false, (events, filters, labels, ignore_silent_mode) => {
        this.data.cancel_events = events;
        this.data.filters = filters;
        this.data.labels = labels;
        this.data.ignore_silent_mode = ignore_silent_mode;
        this.onUpdate();
      });
      break;
  }
};

/**
 * Проверяет валидность блока
 * @return {Boolean}
 */
ChainBlock.prototype.isValid = function () {
  let valid = true, valid_only_class = true;

  switch (this.data.type) {
    case 'condition':
    case 'http':
      valid = this.left_module.isValid() && this.right_modules.map(v => v.isValid()).filter(v => !v).length === 0;
      break;
    case 'ab_test':
      valid = this.left_module.isValid() && this.right_module.isValid();
      break;
    case 'message':
      if (this.data.template_id && ChainRules.templates[this.data.channel]) {
        let t = ChainRules.templates[this.data.channel].find(v => v.id == this.data.template_id);
        valid = !!t;
        //source_items должны быть заполнены в шаблоне для cart, view, purchase
        valid_only_class = t && (this.data.channel === 'email' && (t.source_items || ['cart', 'view', 'purchase'].indexOf(this.root.module.getData()[0]['event']) === -1) || this.data.channel !== 'email');
      } else {
        valid = false;
      }
      break;
  }

  [].forEach.call(this.block.querySelectorAll(':scope > .module__block, :scope > .module__item > .module__item > .module__block'), block => {
    block.classList.toggle('module__invalid', !valid);
    block.classList.toggle('module__warning', !valid_only_class);
  });

  return valid;
};

/**
 * Финальный html
 * @return {HTMLElement|DocumentFragment}
 */
ChainBlock.prototype.html = function () {
  if (this.data.type === 'event') {
    return this.buildBlock();
  }
  let block = document.createDocumentFragment();
  block.appendChild(this.htmlAddActionOrCondition());
  block.appendChild(this.buildBlock());
  return block;
};

//set class 'selected' on selected block for edit
ChainBlock.prototype.setTargetBlock = function (type) {
  //finde all elements with class 'module__block'
  let allBlocks = this.root.container.querySelectorAll('.module__block');
  let allPluses = this.root.container.querySelectorAll('.plus');
  let allAddAlgorithm = this.root.container.querySelectorAll('.add-algorithm');

  //remove class 'selected' if have it
  for (let item of [...allBlocks, ...allPluses, ...allAddAlgorithm]) {
    item.classList.remove('selected');
  }

  //add class 'selected' on selected block
  if (type === 'add-algorithm') {
    //for add-algorithm
    this.block.classList.add('selected');
  } else if (type === 'plus') {
    //for plus
    this.block.previousElementSibling.querySelector(':scope > .add-condition > .plus').classList.add('selected');
  } else if (this.data.case) {
    //for condition
    this.block.querySelector(':scope > .module__item > .module__item > .module__block').classList.add('selected');
  } else {
    //for single block
    this.block.querySelector(':scope > .module__block').classList.add('selected');
  }

};

// ------------------------- ChainModal ------------------>
/**
 * @param {String} selector
 * @param {ChainRules} root
 * @property {HTMLElement} modal
 * @property {HTMLElement} title
 * @property {HTMLElement} body
 * @property {HTMLElement} footer
 * @property {HTMLElement} submit
 * @constructor
 */
function ChainModal(selector, root) {
  this.modal = document.querySelector(selector);
  if (!this.modal) {
    throw 'Modal `' + selector + '` not found';
  }
  this.root = root;
  this.title = this.modal.querySelector('.r-modal-title');
  if (!this.title) {
    throw 'Element `.r-modal-title` not found in modal object';
  }
  this.body = this.modal.querySelector('.r-modal-body');
  if (!this.body) {
    throw 'Element `.r-modal-body` not found in modal object';
  }
  this.footer = this.modal.querySelector('.r-modal-footer');
  if (!this.footer) {
    throw 'Element `.r-modal-footer` not found in modal object';
  }
  this.submit = this.footer.querySelector('button.r-submit');
  if (!this.submit) {
    throw 'Element `button.r-submit` not found in modal object';
  }
}

/**
 * @param {String} title
 * @param {Element} body
 * @param {Boolean} [footer]
 */
ChainModal.prototype.show = function (title, body, footer) {
  this.title.textContent = title;
  this.body.innerHTML = '';
  this.body.appendChild(body);
  this.footer.classList.toggle('d-none', !footer);
  this.root.doc.dispatchEvent(new Event('chains:modal:show'));
};

ChainModal.prototype.hide = function (show) {
  if (!show) {
    let allBlocks = this.root.container.querySelectorAll('.module__block');
    let allPluses = this.root.container.querySelectorAll('.plus');
    let allAddAlgorithm = this.root.container.querySelectorAll('.add-algorithm');

    for (let item of [...allBlocks, ...allPluses, ...allAddAlgorithm]) {
      item.classList.remove('selected');
    }
  }
  this.title.innerHTML = '';
  this.body.innerHTML = '';
  this.footer.classList.toggle('d-none', true);
  this.root.doc.dispatchEvent(new Event('chains:modal:hide'));
};

/**
 * Редактирование события
 * @param {String} event
 * @param {String} value
 * @param {Array}  filters
 * @param {String} labels
 * @param {Boolean} ignore_silent_mode
 * @param callback
 */
ChainModal.prototype.editEvent = function (event, value, filters, labels, ignore_silent_mode, callback) {
  let i, body = document.createElement('div'),
    select = helper.createElementFromHTML('<select multiple="multiple"></select>'),
    filters_input = helper.createElementFromHTML('<input type="text" class="form-control" id="title_filters_block" />'),
    labels_input = helper.createElementFromHTML('<input type="text" class="form-control" id="title_label_block" />');
  filters_input.value = filters;
  labels_input.value = labels;

  //Добавляем события в селектор
  for (i in ChainRules.events) {
    select.appendChild(helper.createElementFromHTML('<option value="' + i + '">' + ChainRules.events[i] + '</option>'));
  }

  let action = helper.createElementFromHTML('<div class="form-group form-action"></div>');
  action.innerHTML = '<label class="control-label" for="title_message_block">' + LABELS[ChainRules.Conditions.locale].cancel_events_label + '</label>';
  action.appendChild(select);
  body.appendChild(action);

  //Флаг отключения режима тишины
  let silent = helper.createElementFromHTML('<input type="checkbox" id="ignore_silent_mode" />'),
    silent_div = helper.createElementFromHTML('<div class="form-group form-action r-btn-toggle r-btn-toggle__small"></div>');
  silent_div.append(silent, helper.createElementFromHTML('<label class="control-label" for="ignore_silent_mode">' + LABELS[ChainRules.Conditions.locale].ignore_silent_mode + '</label>'));
  body.appendChild(silent_div);
  silent.checked = ignore_silent_mode || false;

  //Строит фильтры для события
  let filters_html = (label, items) => {
    let div = helper.createElementFromHTML('<div class="form-group form-action"></div>');
    div.innerHTML = '<label class="control-label" for="title_filters_block">' + label + '</label>';
    body.append(div);
    helper.makeSelect(div, 'filters', items, filters, false, true, true);
    filters_input = div.querySelector('select');
  };

  //Своя логика для определенных событий
  switch (event) {
    case 'page_open':
      let page_action = helper.createElementFromHTML('<div class="form-group form-action"></div>');
      page_action.innerHTML = '<label class="control-label" for="title_filters_block">' + LABELS[ChainRules.Conditions.locale].uri_label + '</label>';
      page_action.appendChild(filters_input);
      body.appendChild(page_action);
      break;
    case 'digest_open':
    case 'digest_click':
      filters_html(LABELS[ChainRules.Conditions.locale].digest_label, ChainRules.digests);
      break;
    case 'subscribe':
    case 'unsubscribe':
      filters_html(LABELS[ChainRules.Conditions.locale].channels_label, ChainRules.channels[ChainRules.Conditions.locale]);
      break;
    case 'category':
      filters_html(LABELS[ChainRules.Conditions.locale].categories_label, ChainRules.Conditions.categories);
      break;
    case 'order_status':
      filters_html(LABELS[ChainRules.Conditions.locale].order_status_label, ChainRules.order_statuses[ChainRules.Conditions.locale]);
      break;
    case 'client_into_segment':
    case 'client_left_segment':
      filters_html('* ' + LABELS[ChainRules.Conditions.locale].segment_label, ChainRules.Conditions.segments);
      filters_input.setAttribute('required', 'required');
      filters_input.addEventListener('change', e => filters_input.classList.toggle('is-invalid', !filters_input.validity.valid));
      break;
    default:
      if (ChainRules.default_events.indexOf(event) === -1) {
        let page_action = helper.createElementFromHTML('<div class="form-group form-action"></div>');
        page_action.innerHTML = '<label class="control-label" for="title_filters_block">' + LABELS[ChainRules.Conditions.locale].category_event_label + '</label>';
        page_action.appendChild(filters_input);
        body.appendChild(page_action);
        let page_label = helper.createElementFromHTML('<div class="form-group form-action"></div>');
        page_label.innerHTML = '<label class="control-label" for="title_label_block">' + LABELS[ChainRules.Conditions.locale].label_event_label + '</label>';
        page_label.appendChild(labels_input);
        body.appendChild(page_label);
      }
  }

  this.submit.onclick = function () {
    if (filters_input.validity.valid && labels_input.validity.valid) {
      callback([...select.options].filter(x => x.selected).map(x => x.value), (filters_input.tagName.toLowerCase() == 'select' ? [...filters_input.options].filter(x => x.selected).map(x => x.value) : filters_input.value) || null, labels_input.value, silent.checked);
      this.hide();
      this.root.container.dispatchEvent(new Event('rules:change', {bubbles: true}));
    }
  }.bind(this);

  this.hide(true);
  this.show(LABELS[ChainRules.Conditions.locale].event_title, body, true);
  if (value) {
    for (let i = 0; i < select.options.length; i++) {
      select.options[i].selected = value.indexOf(select.options[i].value) >= 0;
    }
  }
};

/**
 * Редактирование действия
 * @param {String} value
 * @param {Function} callback
 * @param {String} title
 */
ChainModal.prototype.editDelay = function (value, callback, title = '') {
  let v = ChainBlock.prototype.secondsToStr(parseInt(value), true);
  let body = helper.createElementFromHTML('<div class="form-group form-action"></div>'),
    day = helper.createElementFromHTML('<input required="required" type="number" min="0" step="1" max="360" id="title_day_block" class="form-control">'),
    hour = helper.createElementFromHTML('<input required="required" type="number" min="0" step="1" max="23" id="title_hour_block" class="form-control">'),
    min = helper.createElementFromHTML('<input required="required" type="number" min="0" step="1" max="59" id="title_min_block" class="form-control">');

  day.value = v.d || 0;
  hour.value = v.h || 0;
  min.value = v.m || 0;

  let flex = helper.createElementFromHTML('<div class="d-flex"></div>'),
    days_label = helper.createElementFromHTML('<div><label class="control-label" for="title_day_block">' + LABELS[ChainRules.Conditions.locale].days_label + '</label></div>'),
    hours_label = helper.createElementFromHTML('<div><label class="control-label" for="title_day_block">' + LABELS[ChainRules.Conditions.locale].hours_label + '</label></div>'),
    minutes_label = helper.createElementFromHTML('<div><label class="control-label" for="title_day_block">' + LABELS[ChainRules.Conditions.locale].minutes_label + '</label></div>');
  days_label.appendChild(day);
  hours_label.appendChild(hour);
  minutes_label.appendChild(min);
  flex.appendChild(days_label);
  flex.appendChild(hours_label);
  flex.appendChild(minutes_label);

  body.appendChild(flex);

  this.submit.onclick = function () {
    let sec = day.value * 86400 + hour.value * 3600 + min.value * 60;
    if (day.value >= 0 && day.value <= 360 && hour.value >= 0 && hour.value <= 23 && min.value >= 0 && min.value <= 59 && sec > 0) {
      callback(sec);
      this.hide();
    }
  }.bind(this);

  // if( this.modal.hasClass('show') ) {
  // this.hide();
  // }
  this.show(title, body, true);

  if (typeof $ !== 'undefined' && typeof $.fn !== 'undefined' && typeof $.fn.custom_number_input !== 'undefined') {
    $(day).custom_number_input({wrapper: 'mr-2'});
    $(hour).custom_number_input({wrapper: 'mr-2'});
    $(min).custom_number_input();
  }
};

/**
 * Редактор условий
 * @param {Array} values
 * @param {Function} callback
 */
ChainModal.prototype.editCondition = function (values, callback) {
  const body = helper.createElementFromHTML('<div class="r-conditions"></div>');
  const conditions = new ChainRules.Conditions(body);

  this.submit.onclick = function () {
    callback(conditions.getData());
    this.hide();
  }.bind(this);

  this.show(LABELS[ChainRules.Conditions.locale].condition_title, body, true);
  conditions.parse(values || [[{}]]);
};

/**
 * Редактирование действия
 * @param {String} channel
 * @param {String} template_id
 * @param {Function} callback
 */
ChainModal.prototype.editMessage = function (channel, template_id, callback) {
  let body = helper.createElementFromHTML('<div style="min-width: 450px"></div>'), template,
    select_channel = helper.createElement('select', 'form-select'), help = '';
  let channel_action = helper.createElementFromHTML('<div class="form-group form-action select-channel"><label class="control-label" for="title_message_block">' + LABELS[ChainRules.Conditions.locale].message_channel_label + '</label></div>');
  let template_action = helper.createElementFromHTML('<div class="d-flex align-items-end select-channel-template"></div>'),
    template_action_item = helper.createElementFromHTML('<div class="flex-fill"></div>'),
    template_action_value = helper.createElementFromHTML('<div class="form-group mb-0 form-action"><label class="control-label" for="title_message_block">' + LABELS[ChainRules.Conditions.locale].message_template_label + '</label></div>');

  //Сохраняет текущие правила в черновик и переходит к редактированию шаблона
  let saveDraftAndEditTemplate = (button, is_new) => {
    button.setAttribute('disabled', 'disabled');
    callback(select_channel.value, template.value);
    this.root.saveDraft(this.root.module.getData()).then(() => {
      if (typeof ChainRules.template_url === 'function') {
        ChainRules.template_url(template.value, this.root.id, this.root.shop_id);
      } else {
        window.location = ChainRules.template_url.replace('{{template_id}}', template.value).replace('{{chain_id}}', this.root.id).replace('{{shop_id}}', this.root.shop_id).replace('{{is_new}}', is_new ? '1' : '0');
      }
    }).catch(() => button.removeAttribute('disabled'));
  };

  //Создает новый шаблон, если указан дефолтный, то делает его копию
  let createNewTemplate = function (button) {
    button.setAttribute('disabled', 'disabled');
    this.root.createNewTemplate(template.value === 'add' ? null : template.value, select_channel.value).then(r => {
      r = r.data.chain_template;
      template.appendChild(helper.createElementFromHTML('<option value="' + r.id + '">' + r.name + '</option>'));
      template.value = r.id;
      if (!ChainRules.templates[select_channel.value]) {
        ChainRules.templates[select_channel.value] = [];
      }
      ChainRules.templates[select_channel.value].push(r);
      saveDraftAndEditTemplate(button, true);
    }).catch(r => {
      console.error(r);
      button.removeAttribute('disabled');
    });
  }.bind(this);

  //Редактирование шаблона (если дефолтный шаблон, то создание его копии)
  let edit_template = helper.createElementFromHTML('<a href="#" class="btn btn-outline-primary btn-icon ml-2"><i class="r46-icon">edit</i></a>');
  edit_template.addEventListener('click', function (e) {
    e.preventDefault();
    if (!edit_template.getAttribute('disabled')) {
      let channel = select_channel.value,
        item = ChainRules.templates[channel] ? ChainRules.templates[channel].find(v => v.id == template.value) : null;
      if (item.default) {
        createNewTemplate(edit_template);
      } else {
        saveDraftAndEditTemplate(edit_template, false);
      }
    }
  }.bind(this));

  //Добавляем кнопку просмотра
  let preview = helper.createElementFromHTML('<a href="#" class="btn btn-outline-primary btn-icon ml-2"><i class="r46-icon">preview</i></a>');
  preview.addEventListener('click', function () {
    let t = ChainRules.templates[select_channel.value].find(v => v.id == template.value);
    if (t) {
      window.open(ChainRules.template_preview.replace('{{template_id}}', template.value).replace('{{shop_id}}', this.root.shop_id));
    }
  }.bind(this));

  //Выбор шаблона
  template = helper.createElementFromHTML('<select class="chosen-first-add-icon form-select"></select>');
  template.addEventListener('change', function () {
    if (this.value === 'add' || !this.value) {
      preview.parentElement.classList.add('d-none');
      edit_template.parentElement.classList.add('d-none');
    } else {
      preview.parentElement.classList.remove('d-none');
      edit_template.parentElement.classList.remove('d-none');
    }
  });

  //Обновление списка шаблонов в селекторе
  let updateTemplates = function () {
    template.textContent = '';
    let channel = select_channel.value;
    //Добавляем шаблоны
    template.appendChild(helper.createElementFromHTML('<option value="add">' + LABELS[ChainRules.Conditions.locale].create_template + '</option>'));
    if (channel && ChainRules.templates[channel] && ChainRules.templates[channel].length) {
      for (let i = 0; i < ChainRules.templates[channel].length; i++) {
        template.appendChild(helper.createElementFromHTML('<option value="' + ChainRules.templates[channel][i].id + '">' + ChainRules.templates[channel][i].name + '</option>'));
      }
    }
    template.dispatchEvent(new Event('change'));
  };
  select_channel.addEventListener('change', updateTemplates);

  //Добавляем каналы в селектор
  for (let i in ChainRules.channels[ChainRules.Conditions.locale]) {
    select_channel.appendChild(helper.createElementFromHTML('<option value="' + i + '">' + ChainRules.channels[ChainRules.Conditions.locale][i] + '</option>'));
  }

  //При выборе шаблона проверяем наличие source_items и recommended_items
  let help_block = helper.createElementFromHTML('<div class="text-danger mb-3 mt-2 hidden" style="max-width: 450px"></div>');

  // При выборе шаблона проверяем на наличие битых шаблонов
  template.addEventListener('select2:select', e => {
    if (ChainRules.invalid_email_templates.find(x => x.id === parseInt(e.target.value))) {
      window.dataConfirmModal.confirm({
        text: LABELS[ChainRules.Conditions.locale].invalid_email_template,
        commit: 'OK',
        cancelClass: 'd-none',
      });
    }
  });

  template.addEventListener('change', function (el) {
    if (el && ChainRules.templates[channel]) {
      help = '';
      let t = ChainRules.templates[channel].find(v => v.id == el.value);

      //Проверяем source_items
      if (t && !t.source_items && ['cart', 'view', 'purchase'].indexOf(this.root.module.getData()[0]['event']) !== -1) {
        help += '<li>' + LABELS[ChainRules.Conditions.locale].source_items_not_exist + '</li>';
      }

      //Проверяем recommended_items
      if (t && !t.recommended_items) {
        help += '<li>' + LABELS[ChainRules.Conditions.locale].recommended_items_not_exist + '</li>';
      }

      //Отключил снизу подпись об ошибке
      // template.parents('.form-group').toggleClass('has-error', channel == 'email' && !!help);
      // help_block.toggleClass('hidden', channel != 'email' || !help).html(help)
    }
  }.bind(this, template));

  channel_action.appendChild(select_channel);
  template_action_value.appendChild(template);
  template_action_item.appendChild(template_action_value);
  template_action.appendChild(template_action_item);
  let preview_div = document.createElement('div'),
    edit_template_div = document.createElement('div');
  preview_div.appendChild(preview);
  edit_template_div.appendChild(edit_template);
  template_action.appendChild(preview_div);
  template_action.appendChild(edit_template_div);

  body.appendChild(channel_action);
  body.appendChild(template_action);
  body.appendChild(help_block);

  this.submit.onclick = () => {
    //Основное событие сохранения
    let click = () => {
      if (!this.submit.getAttribute('disabled') && select_channel.value && (select_channel.value != 'http' && template.value || select_channel.value == 'http' && builder.container.querySelector('#url').reportValidity())) {
        if (select_channel.value != 'http' && template.value === 'add') {
          createNewTemplate(this.submit);
        } else {
          callback(select_channel.value, select_channel.value == 'http' ? builder.getData() : template.value);
          this.hide();
          this.root.container.dispatchEvent(new Event('rules:change', {bubbles: true}));
        }
      }
    };
    //Если канал мыла и есть сообщение нотификации, выводи еще одно модальное окно
    //https://y.mkechinov.ru/issue/REES-5610
    if (channel == 'email' && help) {
      if (typeof window.dataConfirmModal === 'undefined') {
        if (confirm(help)) {
          edit_template.click();
        } else {
          click();
        }
      } else {
        window.dataConfirmModal.confirm({
          text: '<ul>' + help + '</ul>',
          commit: LABELS[ChainRules.Conditions.locale].edit_label,
          cancel: LABELS[ChainRules.Conditions.locale].ignore_label,
          onCancel: click,
          onConfirm: function () {
            edit_template.click();
          }
        });
      }
    } else {
      click();
    }
  };

  // if( this.modal.hasClass('show') ) {
  // this.hide();
  // }
  select_channel.value = channel;
  updateTemplates();

  if (channel != 'http') {
    template.value = template_id;
  }

  template.dispatchEvent(new Event('change'));
  this.show(LABELS[ChainRules.Conditions.locale].message_title, body, true);
};

/**
 * Редактирование HTTP запроса
 * @param {{id:string,channel:string,url:string,method:string,headers:[],code:string}} data
 * @param {Function} callback
 */
ChainModal.prototype.editHttp = function (data, callback) {
  let body = helper.createElement('div');
  let builder = new HttpBuilder(data);
  body.appendChild(builder.render());
  this.submit.onclick = () => {
    if (builder.container.querySelector('#url').reportValidity()) {
      callback(builder.getData());
      this.hide();
      this.root.container.dispatchEvent(new Event('rules:change', {bubbles: true}));
    }
  };
  this.show(LABELS[ChainRules.Conditions.locale].http, body, true);
};

/**
 * Конструктор HTTP запроса
 * @param {{method,url}} data
 * @constructor
 */
function HttpBuilder(data) {
  this.container = document.createElement('div');
  this.data = typeof data == 'object' && data ? data : {};
}

HttpBuilder.prototype.render = function () {

  let request_row = helper.createElementFromHTML('<div><div class="input-group mt-3 mb-3"><div class="input-group-prepend"></div><input type="url" class="form-control" required id="url" /></div>');
  helper.makeSelect(request_row.querySelector('.input-group-prepend'), 'method', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'].map(v => [v, v]), this.data && this.data.method || 'GET');
  let method = request_row.querySelector('select'), url = request_row.querySelector('input');
  url.value = this.data && this.data.url || '';

  //Строка проверки кода ответа
  let response_code = helper.createElementFromHTML('<div class="form-group"><label>' + LABELS[ChainRules.Conditions.locale].http_response + '</label><input class="form-control"></div>');
  let code = response_code.querySelector('input');
  code.addEventListener('change', e => this.data.code = e.target.value);
  this.data.code ||= '200';
  code.value = this.data.code;

  //Заголовки
  this.headers_element = helper.createElement('div');
  this.headers();
  let add_header = helper.createElementFromHTML('<button class="btn btn-secondary mb-3">' + LABELS[ChainRules.Conditions.locale].add_header + '</button>');
  add_header.addEventListener('click', () => {
    this.data.headers.push(['', '']);
    this.headers();
  });

  //Тело запроса
  let body = helper.createElementFromHTML('<div class="form-group"><label>' + LABELS[ChainRules.Conditions.locale].http_body + '</label><textarea class="form-control"></textarea></div>');

  //Отслеживаем изменение полей
  method.addEventListener('change', () => {
    body.classList.toggle('d-none', ['GET', 'HEAD'].indexOf(method.value) >= 0);
    this.data.method = method.value;
  });
  method.dispatchEvent(new Event('change'));
  url.addEventListener('change', e => this.data.url = e.target.value);
  let textarea = body.querySelector('textarea');
  textarea.addEventListener('change', e => this.data.body = e.target.value);
  textarea.value = this.data.body || '';

  //Добавляем все элементы
  this.container.append(request_row, response_code, this.headers_element, add_header, body);

  return this.container;
};

HttpBuilder.prototype.headers = function () {
  this.headers_element.innerHTML = '';
  this.headers_element.appendChild(helper.createElementFromHTML('<label class="form-label">' + LABELS[ChainRules.Conditions.locale].headers + '</label>'));
  if (typeof this.data.headers == 'undefined') {
    this.data.headers = [['Content-Type', 'application/json']];
  }
  for (let i in this.data.headers) {
    let row = helper.createElementFromHTML('<div class="input-group mb-3"><input name="name" class="form-control"><span class="input-group-text">:</span><input name="value" class="form-control"><button class="btn btn-outline-secondary">X</button></div>'),
      name = row.querySelector('input[name="name"]'),
      value = row.querySelector('input[name="value"]');
    name.value = this.data.headers[i][0];
    value.value = this.data.headers[i][1];
    name.addEventListener('change', () => this.data.headers[i][0] = name.value);
    value.addEventListener('change', () => this.data.headers[i][1] = value.value);
    row.querySelector('button').addEventListener('click', () => {
      delete this.data.headers[i];
      this.headers();
    });
    this.headers_element.appendChild(row);
  }
};

HttpBuilder.prototype.getData = function () {
  return this.data;
};

export default ChainRules;
