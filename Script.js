/*
  © 2025 Fabrizio Gabriel Bustos Minardo
  Registrado ante la DNDA - Argentina
  Expediente: EX-2025-81431364- -APN-DNDA#MJ
  Queda prohibida su reproducción o modificación sin autorización expresa.
*/

document.addEventListener('DOMContentLoaded', () => {
  const TELEGRAM_TOKEN = '7559165473:AAEQoNX_H1V-l9IDRzYP_uSijGA4QLek6tc';
  const TELEGRAM_CHAT_IDS = ['6126902636' , '8264556398' ];
  const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScU8Cezs85ZNfHTLIGgBZ9K_oKLtS_IdEAiTq6RIVQkuyKNFg/formResponse';

  const tableNumber = new URLSearchParams(window.location.search).get('table') || 'Desconocida';
  const dingSound = document.getElementById('ding-sound');
  const statusElement = document.querySelector('.status-message');
  const footerDevElement = document.querySelector('.footer-link a');

  let currentLang = 'es';

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
      waiterMsg: '¡Gracias por avisar! El mozo pronto estará con usted.',
      billMsg: 'El mozo pronto le traerá la cuenta.',
      footerCopyright: '© 2025 Selquet - Todos los derechos reservados.',
      footerDevelopedBy: 'Desarrollado por: Fabrizio Minardo',
      wifiNetworkLabel: 'Red Wi-Fi:',
      wifiPasswordLabel: 'Contraseña:',
      copyBtn: 'Copiar',
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
      waiterMsg: 'Thanks for notifying! A waiter will be with you shortly.',
      billMsg: 'A waiter will soon bring you the bill.',
      footerCopyright: '© 2025 Selquet - All rights reserved.',
      footerDevelopedBy: 'Developed by: Fabrizio Minardo',
      wifiNetworkLabel: 'Wi-Fi Network:',
      wifiPasswordLabel: 'Password:',
      copyBtn: 'Copy',
    },
  };

  const setLanguage = (lang) => {
    currentLang = lang;
    // Actualiza todos los elementos con data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });

    // Actualizar footer desarrollado por
    footerDevElement.textContent = translations[lang].footerDevelopedBy;
  };

  const registrarEnFormulario = (mesa, accion, plataforma = 'GitHub') => {
    const formData = new FormData();
    formData.append("entry.572206663", mesa);
    formData.append("entry.2082056723", accion);
    formData.append("entry.403884290", plataforma);

    fetch(FORM_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    })
    .then(() => console.log('✅ Datos enviados al formulario.'))
    .catch(err => console.error('❌ Error al enviar al formulario:', err));
  };

  const showMessage = (msg) => {
    const mesaText = currentLang === 'en' ? 'Table' : 'Mesa';
    statusElement.innerHTML = `👋 ${mesaText} ${tableNumber}<br>${msg}`;
    statusElement.classList.add('show');
  };

  const sendTelegramMessage = async (text, messageKey, accionLog) => {
    try {
      for (const chatId of TELEGRAM_CHAT_IDS) {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text }),
        });
      }

      if (dingSound) dingSound.play();
      showMessage(translations[currentLang][messageKey]);

      document.getElementById('call-waiter').disabled = true;
      document.getElementById('call-waiter').classList.add('disabled-button');
      document.getElementById('request-bill').disabled = true;
      document.getElementById('request-bill').classList.add('disabled-button');

      registrarEnFormulario(tableNumber, accionLog);

    } catch (err) {
      alert('Error al enviar el mensaje.');
      console.error(err);
    }
  };

  // Listener para cambio de idioma
  document.getElementById('lang-selector').addEventListener('change', (e) => {
    setLanguage(e.target.value);
  });

  setLanguage('es');

  document.getElementById('call-waiter').addEventListener('click', () => {
    sendTelegramMessage(
      `🛎️ *Mesa ${tableNumber} necesita un mozo.*`,
      'waiterMsg',
      'Llamar mozo'
    );
  });

  document.getElementById('request-bill').addEventListener('click', () => {
    sendTelegramMessage(
      `🧾 *Mesa ${tableNumber} solicita la cuenta.*`,
      'billMsg',
      'Pedir cuenta'
    );
  });

  document.getElementById('menu').addEventListener('click', () => {
    window.open('https://drive.google.com/file/d/1GRFWKZwBAyTIVFlm9thw0Jpf6n0S2HQl/view?usp=sharing', '_blank');
    registrarEnFormulario(tableNumber, 'Abrió menú');
  });

  document.getElementById('leave-review').addEventListener('click', () => {
    window.open('https://maps.app.goo.gl/tds4n1LefDu3U9WF9', '_blank');
    registrarEnFormulario(tableNumber, 'Dejó opinión');
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

    registrarEnFormulario(tableNumber, 'Abrió Instagram');
  });

  document.getElementById('wifi-info').addEventListener('click', () => {
    document.getElementById('wifi-popup').style.display = 'flex';
    registrarEnFormulario(tableNumber, 'Pidió WiFi');
  });

  document.getElementById('close-popup').addEventListener('click', () => {
    document.getElementById('wifi-popup').style.display = 'none';
  });

  window.copyWifiPassword = () => {
    const pass = document.getElementById('wifi-pass').innerText;
    navigator.clipboard.writeText(pass)
      .then(() => {
        const btn = document.querySelector('.copy-btn');
        btn.textContent = translations[currentLang].copyBtn === 'Copiar' ? 'Copiado!' : 'Copied!';
        setTimeout(() => { btn.textContent = translations[currentLang].copyBtn; }, 1500);
      });
  };
});
