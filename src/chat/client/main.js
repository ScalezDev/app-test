const config = {
  appAddress: 'https://nimrod-chatbot.localtunnel.me',
  shopId: '@SHOP_ID',
};

const DOMHandler = (() => {
  const chatDOM = {};
  const STATUS = {
    OK: 'ok.svg',
    LOADING: 'loading.svg',
    ERROR: 'error.svg',
  };
  const ASSETS_DIRECTORY = `${config.appAddress}/chat/client/assets`;

  const isOpen = true;

  const isItMobile = () =>
    Math.min($(window).width(), $(window).height()) < 400;

  const createChatDOM = () => {
    const container = $('<div/>');
    container.css({
      bottom: '0px',
      position: 'sticky',
      'padding-bottom': '30px',
      'padding-left': '20px',
      'z-index': '999',
    });

    if (isItMobile()) {
      container.css({
        'padding-left': '0px',
        'padding-bottom': '0px',
      });
    }

    container.appendTo('body');

    const chatApp = $('<div/>');
    chatApp.css({
      width: 'calc(100% - 20px);',
      'max-width': '400px',
      'border-radius': '10px',
      'box-shadow': 'rgba(0, 0, 0, 0.15) 0px 5px 10px 15px',
      'background-color': '#f8f8f8',
      overflow: 'hidden',
    });
    chatApp.appendTo(container);

    const topBar = $('<div/>');
    topBar.css({
      'background-color': ' #fff',
      width: ' 100%',
      height: ' 40px',
      display: ' flex',
      'align-items': ' center',
      padding: ' 0px 10px',
    });
    topBar.appendTo(chatApp);

    chatDOM.toggleButton = $('<div/>');
    chatDOM.toggleButton.html('-');
    chatDOM.toggleButton.css({
      width: ' 30px',
      height: ' 30px',
      'border-radius': ' 50%',
      'line-height': ' 26px',
      'text-align': ' center',
      color: ' white',
      'font-weight': ' 600',
      'background-color': '#75C964',
      'font-size': '32px',
      'user-select': 'none',
      cursor: 'pointer',
    });
    chatDOM.toggleButton.on('click', ChatApp.toggleWindow);
    chatDOM.toggleButton.appendTo(topBar);

    chatDOM.chat_content = $('<div/>');
    chatDOM.chat_content.appendTo(chatApp);

    chatDOM.messages = $('<ul/>');
    chatDOM.messages.css({
      position: 'relative',
      'list-style': 'none',
      padding: '20px 10px 0 10px',
      margin: '0px',
      height: '347px',
      'overflow-y': 'scroll',
    });
    chatDOM.messages.appendTo(chatDOM.chat_content);

    const bottom = $('<div/>');
    bottom.css({
      width: '100%',
      'background-color': '#fff',
      padding: '20px 20px',
    });
    bottom.appendTo(chatDOM.chat_content);

    const inputWrapper = $('<div/>');
    inputWrapper.css({
      display: 'inline-block',
      height: '50px',
      'border-radius': '25px',
      border: '1px solid #bcbdc0',
      width: 'calc(100% - 160px)',
      position: 'relative',
      padding: '0 20px',
    });
    inputWrapper.appendTo(bottom);

    chatDOM.input = $('<input/>');
    chatDOM.input.attr('type', 'text');
    chatDOM.input.css({
      border: 'none',
      height: '100%',
      'box-sizing': 'border-box',
      width: 'calc(100% - 40px)',
      position: 'absolute',
      'outline-width': '0',
      color: 'gray',
    });
    chatDOM.input.appendTo(inputWrapper);

    chatDOM.button = $('<div/>');
    chatDOM.button.css({
      width: '140px',
      height: '50px',
      display: 'inline-block',
      'border-radius': '50px',
      'background-color': '#a3d063',
      border: '2px solid #a3d063',
      color: '#fff',
      cursor: 'pointer',
      transition: 'all 0.1s linear',
      'text-align': 'center',
      float: 'right',
    });
    chatDOM.button.mouseenter(() => {
      chatDOM.button.css({
        'background-color': '#c3e083',
      });
    });
    chatDOM.button.click(() => {
      chatDOM.button.css({
        'background-color': '#a3d063',
      });
      return true;
    });
    chatDOM.button.mouseleave(() => {
      chatDOM.button.css({
        'background-color': '#a3d063',
      });
    });

    chatDOM.button.appendTo(bottom);

    const buttonText = $('<div/>');
    buttonText.html('Send');
    buttonText.css({
      'font-size': ' 18px',
      'font-weight': ' 300',
      display: ' inline-block',
      'line-height': ' 48px',
      'user-select': 'none',
    });
    buttonText.appendTo(chatDOM.button);

    const statusBar = $('<div/>');
    statusBar.css({
      width: '100%',
      height: '30px',
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'center',
      position: 'relative',
    });
    statusBar.appendTo(chatApp);

    chatDOM.status_text = $('<div/>');
    chatDOM.status_text.html('Online');
    chatDOM.status_text.css({
      width: '200px',
      'text-align': 'center',
    });
    chatDOM.status_text.appendTo(statusBar);

    chatDOM.status_icon = $('<img />');
    chatDOM.status_icon.attr('src', `${ASSETS_DIRECTORY}/${STATUS.OK}`);
    chatDOM.status_icon.css({
      width: '20px',
      position: 'absolute',
      right: '10px',
    });
    chatDOM.status_icon.appendTo(statusBar);
  };

  const addMessage = (data) => {
    const message = $('<li/>');
    message.css({
      clear: ' both',
      overflow: ' hidden',
      'margin-bottom': ' 20px',
      opacity: '0',
    });
    message.appendTo(chatDOM.messages);

    const avatar = $('<div/>');
    avatar.css({
      width: ' 60px',
      height: ' 60px',
      'border-radius': ' 50%',
      'line-height': ' 60px',
      'text-align': ' center',
      color: ' white',
      'font-weight': ' 600',
    });
    avatar.appendTo(message);

    const content = $('<div/>');
    content.css({
      display: 'flex',
      'flex-direction': 'column',
      width: ' calc(100% - 85px)',
      'min-width': ' 100px',
    });
    content.appendTo(message);

    const textWrapper = $('<div/>');
    textWrapper.css({
      display: ' flex',
      'flex-direction': 'column',
      padding: ' 5px 10px',
      'border-radius': ' 6px',
      position: ' relative',
      'line-height': '1.4',
    });
    textWrapper.appendTo(content);
    const image = $('<div/>');
    image.css({
      width: '240px',
      height: '240px',
      'background-image': `url('${data.image}')`,
      'background-color': ' white',
      'background-size': ' contain',
      'background-position': ' center',
      'background-repeat': ' no-repeat',
      'align-self': ' center',
      margin: ' 10px 0px',
    });

    if (data.image) {
      image.appendTo(textWrapper);
    }

    const text = $('<div/>');
    text.html(data.message);
    text.css({
      'font-size': ' 18px',
      'font-weight': ' 300',
      color: ' #c48843',
    });
    text.appendTo(textWrapper);

    updateScroll();

    return {
      avatar,
      content,
      textWrapper,
      fadeIn: () => message.fadeTo(500, 1),
    };
  };

  const addBotMessage = (data) => {
    const { avatar, content, textWrapper, fadeIn } = addMessage(data);
    avatar.css({
      'background-color': ' #f5886e',
      float: ' left',
    });
    avatar.html('BOT');

    content.css({
      'margin-left': ' 20px',
      float: 'left',
    });

    textWrapper.css({
      'background-color': ' #ffe6cb',
    });

    const options = $('<div/>');
    options.css({
      display: 'flex',
      'flex-direction': 'column',
      'margin-left': '30px',
      'max-width': '150px',
    });
    options.appendTo(content);
    if (data.options) {
      data.options.forEach((opt) => {
        const option = $('<div/>');
        option.html(opt);
        option.one('click', () => ChatApp.handleOptionClick(opt, options));
        option.css({
          padding: ' 3px 10px',
          'border-radius': ' 6px',
          'background-color': ' #ffe6cb',
          'margin-top': '10px',
          display: 'inline-block',
          color: ' #c48843',
          cursor: 'pointer',
        });
        option.appendTo(options);
      });
    }

    fadeIn();
  };

  const addUserMessage = (data) => {
    const { avatar, content, textWrapper, fadeIn } = addMessage(data);
    avatar.css({
      'background-color': ' #fdbf68',
      float: ' right',
    });
    avatar.html('YOU');
    content.css({
      'margin-right': ' 20px',
      float: 'right',
    });

    textWrapper.css({
      'background-color': ' #c7eafc',
    });
    fadeIn();
  };

  const getInputText = () => chatDOM.input.val();

  const clearInput = () => chatDOM.input.val('');

  const updateScroll = () =>
    chatDOM.messages.animate(
      { scrollTop: chatDOM.messages.get(0).scrollHeight },
      1000,
    );

  const setStatus = (icon, text) => {
    chatDOM.status_icon.attr('src', `${ASSETS_DIRECTORY}/${icon}`);
    chatDOM.status_icon.bind('load', () => {
      chatDOM.status_text.html(text);
      chatDOM.status_icon.unbind('load');
    });
  };

  const hideOptions = (optionsWrapper) =>
    new Promise((resolve) => {
      optionsWrapper.fadeOut(500, resolve);
    });

  const changeToggleButtonState = (state) => {
    if (state === 'minimize') {
      chatDOM.toggleButton.html('-');
    } else if (state === 'maximize') {
      chatDOM.toggleButton.html('+');
    }
  };

  const toggleChat = () =>
    new Promise((resolve) => chatDOM.chat_content.slideToggle(1000, resolve));

  const createChat = (settings) => {
    createChatDOM();
    addBotMessage({ message: settings.open_message });
    chatDOM.button.on('click', ChatApp.handleUserInput);
    chatDOM.input.on(
      'keypress',
      (e) => e.which !== 13 || ChatApp.handleUserInput(),
    );
  };

  return {
    createChat,
    addBotMessage,
    addUserMessage,
    getInputText,
    clearInput,
    setStatus,
    hideOptions,
    changeToggleButtonState,
    toggleChat,

    STATUS,
    isOpen,
  };
})();

const ConnectionHandler = (() => {
  const connection = {};

  const hasConnected = () => !!connection.botId;

  const startConversation = () =>
    new Promise((resolve, reject) => {
      $.get(`${config.appAddress}/chat/server/init?shop_id=${config.shopId}`)
        .done((data) => {
          const response = JSON.parse(data);
          connection.botId = response.botId;
          resolve(response);
        })
        .fail((error) => {
          reject(error.statusText);
        });
    });

  const sendMessage = (message) =>
    new Promise((resolve, reject) => {
      $.post({
        url: `${config.appAddress}/chat/server/sendQuery?botId=${
          connection.botId
        }`,
        data: JSON.stringify({
          message,
          isRunning: true,
        }),
        contentType: 'application/json',
      })
        .done((data) => {
          resolve(JSON.parse(data));
        })
        .fail((error) => {
          reject(error.statusText);
        });
    });

  const askForCalculation = () =>
    new Promise((resolve, reject) => {
      $.get(
        `${config.appAddress}/chat/server/getCalculation?botId=${
          connection.botId
        }`,
      )
        .done((data) => {
          resolve(JSON.parse(data));
        })
        .fail((error) => {
          reject(error.statusText);
        });
    });

  return {
    hasConnected,
    startConversation,
    sendMessage,
    askForCalculation,
  };
})();

const MessageQueue = (() => {
  const TIMEOUT = 1500;

  let queue = [];
  let timer;

  const send = () => {
    const packet = queue.join('\n');
    queue = [];
    ChatApp.sendMessage(packet);
  };

  const add = (message) => {
    queue.push(message);
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(send, TIMEOUT);
  };

  return {
    add,
  };
})();

const ChatApp = (() => {
  const loadSettings = () => ({
    open_message: 'Do you want to use our bot to measure your size?',
  });
  const handleUserInput = () => {
    const text = DOMHandler.getInputText();
    DOMHandler.clearInput();
    if (text !== '') {
      DOMHandler.addUserMessage({ message: text });
      if (ConnectionHandler.hasConnected()) {
        MessageQueue.add(text);
      } else {
        waitForServerResponse(ConnectionHandler.startConversation());
      }
    }
  };

  const handleBotSendMessage = (data) => {
    if (data.startCalculating) {
      ConnectionHandler.askForCalculation().then(handleBotSendMessage);
    } else {
      DOMHandler.setStatus(DOMHandler.STATUS.OK, 'Online');
    }
    DOMHandler.addBotMessage(data);
  };

  const waitForServerResponse = (promise) => {
    DOMHandler.setStatus(DOMHandler.STATUS.LOADING, 'Bot is typing...');
    promise
      .then((response) => {
        handleBotSendMessage(response);
      })
      .catch((error) => {
        DOMHandler.setStatus(DOMHandler.STATUS.ERROR, error);
      });
  };

  const sendMessage = (message) => {
    waitForServerResponse(ConnectionHandler.sendMessage(message));
  };

  const handleOptionClick = (option, optionsWrapper) => {
    DOMHandler.hideOptions(optionsWrapper).then(() => {
      DOMHandler.addUserMessage({ message: option });
      sendMessage(option);
    });
  };

  const toggleWindow = () => {
    const buttonStatus = DOMHandler.isOpen ? 'maximize' : 'minimize';
    DOMHandler.isOpen = !DOMHandler.isOpen;
    DOMHandler.toggleChat().then(() =>
      DOMHandler.changeToggleButtonState(buttonStatus),
    );
  };

  const init = () => {
    if (
      Array.from(document.getElementsByTagName('meta'))
        .find((meta) => meta.getAttribute('property') === 'og:type')
        .getAttribute('content') === 'product'
    ) {
      const settings = loadSettings();
      DOMHandler.createChat(settings);
    }
  };

  return {
    init,
    handleUserInput,
    sendMessage,
    handleOptionClick,
    toggleWindow,
  };
})();

$(document).ready(() => {
  ChatApp.init();
});
