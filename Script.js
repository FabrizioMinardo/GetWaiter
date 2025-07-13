document.addEventListener('DOMContentLoaded', () => {
  const TELEGRAM_TOKEN = '7559165473:AAEQoNX_H1V-l9IDRzYP_uSijGA4QLek6tc';
  const TELEGRAM_CHAT_IDS = ['6126902636'];
  const SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyj2nECmPxB3vK6tPzmqOFy68zk126ZylJA2FqyOiqJ5g3rib2ivyO1-__yySw4bTlCWQ/exec';

  const tableNumber = new URLSearchParams(window.location.search).get('table') || 'Desconocida';
  const dingSound = document.getElementById('ding-sound');
  const statusElement = document.querySelector('.status-message');

  const translations = {
    es: {
      welcome: '¡Bienvenido!',
      instruction: 'Use los botones para solicitar atención.',
      callWaiter: '🛎️ Llamar al mozo',
      viewMenu: '📋 Menú',
      requestBill: '💰 Pedir la cuenta',
      freeWifi: '📶 Wifi Gratuito',
      leaveReview: '✍️ Dejar una opinión',
      close: 'Cerrar',
      wifiInfo: '¡Escanea el código QR que se encuentra en la parte de atrás de nuestro menú y accedé a Internet gratis!',
    },
    en: {
      welcome: 'Welcome!',
      instruction: 'Use the buttons to request service.',
      callWaiter: '🛎️ Call Waiter',
      viewMenu: '📋 View Menu',
      requestBill: '💰 Request Bill',
      freeWifi: '📶 Free Wifi',
      leaveReview: '✍️ Leave a Review',
      close: 'Close',
      wifiInfo: 'Scan the QR code on the back of our menu to access free internet!',
    },
  };

  const setLanguage = (lang) => {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = translations[lang][key] || el.textContent;
    });
  };

  const logToSheet = async (mesa, accion) => {
    try {
      await fetch(SHEET_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mesa: mesa,
          accion: accion,
          plataforma: 'GitHub Pages'
        })
      });
    } catch (error) {
      console.error('Error al registrar en Google Sheets:', error);
    }
  };

  const showMessage = (msg) => {
    statusElement.innerHTML = `👋 Mesa ${tableNumber}<br>${msg}`;
    statusElement.classList.add('show');
  };

  const sendTelegramMessage = async (text, successMessage) => {
    try {
      for (const chatId of TELEGRAM_CHAT_IDS) {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text }),
        });
      }

      if (dingSound) dingSound.play();
      showMessage(successMessage);

      document.getElementById('call-waiter').disabled = true;
      document.getElementById('call-waiter').classList.add('disabled-button');
      document.getElementById('request-bill').disabled = true;
      document.getElementById('request-bill').classList.add('disabled-button');
    } catch (err) {
      alert('Error al enviar el mensaje.');
      console.error(err);
    }
  };

  document.getElementById('lang-selector').addEventListener('change', (e) => {
    setLanguage(e.target.value);
  });

  setLanguage('es');

  document.getElementById('call-waiter').addEventListener('click', () => {
    sendTelegramMessage(
      `🛎️ *Mesa ${tableNumber} necesita un mozo.*`,
      '¡Gracias por avisar! El mozo pronto estará con usted.'
    );
    logToSheet(tableNumber, 'Llamó al mozo');
  });

  document.getElementById('request-bill').addEventListener('click', () => {
    sendTelegramMessage(
      `🧾 *Mesa ${tableNumber} solicita la cuenta.*`,
      'El mozo pronto le traerá la cuenta.'
    );
    logToSheet(tableNumber, 'Pidió la cuenta');
  });

  document.getElementById('menu').addEventListener('click', () => {
    window.open('https://drive.google.com/file/d/1GRFWKZwBAyTIVFlm9thw0Jpf6n0S2HQl/view?usp=sharing', '_blank');
    logToSheet(tableNumber, 'Abrió el menú');
  });

  document.getElementById('leave-review').addEventListener('click', () => {
    window.open('https://maps.app.goo.gl/tds4n1LefDu3U9WF9', '_blank');
    logToSheet(tableNumber, 'Dejó opinión');
  });

  document.getElementById('instagram').addEventListener('click', () => {
    const ua = navigator.userAgent;
    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua);

    if (isAndroid) {
      window.location.href = 'intent://instagram.com/_u/selquetrestaurantbar/#Intent;package=com.instagram.android;scheme=https;end';
      setTimeout(() => {
        window.location.href = 'https://www.instagram.com/selquetrestaurantbar/';
      }, 1500);
    } else if (isIOS) {
      window.location.href = 'instagram://user?username=selquetrestaurantbar';
      setTimeout(() => {
        window.location.href = 'https://www.instagram.com/selquetrestaurantbar/';
      }, 1500);
    } else {
      window.open('https://www.instagram.com/selquetrestaurantbar/', '_blank');
    }

    logToSheet(tableNumber, 'Abrió Instagram');
  });

  document.getElementById('wifi-info').addEventListener('click', () => {
    document.getElementById('wifi-popup').style.display = 'flex';
    logToSheet(tableNumber, 'Pidió WiFi');
  });

  document.getElementById('close-popup').addEventListener('click', () => {
    document.getElementById('wifi-popup').style.display = 'none';
  });

  window.copyWifiPassword = () => {
    const pass = document.getElementById('wifi-pass').innerText;
    navigator.clipboard.writeText(pass)
      .then(() => {
        const btn = document.querySelector('.copy-btn');
        btn.textContent = 'Copiado!';
        setTimeout(() => { btn.textContent = 'Copiar'; }, 1500);
      });
  };
});
