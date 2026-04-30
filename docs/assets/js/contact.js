(() => {
  const PLACEHOLDER_ACCESS_KEY = "PASTE_WEB3FORMS_ACCESS_KEY_HERE";
  const SUCCESS_MESSAGE = "Thanks! Your inquiry was sent. I'll follow up soon.";
  const ERROR_MESSAGE = "Something went wrong. Please email FunFavoriteFinds@gmail.com.";
  const CONFIG_MESSAGE = "Form setup needs a Web3Forms access key. Please email FunFavoriteFinds@gmail.com.";

  const setStatus = (form, message, state) => {
    const status = form.querySelector("[data-contact-status]");
    if (!status) return;

    status.textContent = message;
    status.dataset.state = state;
  };

  const isConfigured = (form) => {
    const accessKey = form.querySelector('input[name="access_key"]')?.value?.trim();
    return Boolean(accessKey && accessKey !== PLACEHOLDER_ACCESS_KEY);
  };

  const setButtonState = (button, isSending) => {
    if (!button) return;

    if (!button.dataset.defaultText) {
      button.dataset.defaultText = button.textContent.trim();
    }

    button.disabled = isSending;
    button.textContent = isSending
      ? button.dataset.sendingText || "Sending..."
      : button.dataset.defaultText;
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    const button = form.querySelector('button[type="submit"]');

    event.preventDefault();

    if (!isConfigured(form)) {
      setStatus(form, CONFIG_MESSAGE, "error");
      return;
    }

    setButtonState(button, true);
    setStatus(form, "Sending...", "pending");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json",
        },
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Form submission failed.");
      }

      form.reset();
      setStatus(form, SUCCESS_MESSAGE, "success");
    } catch (error) {
      setStatus(form, ERROR_MESSAGE, "error");
    } finally {
      setButtonState(button, false);
    }
  };

  const init = () => {
    document.querySelectorAll("[data-contact-form]").forEach((form) => {
      form.addEventListener("submit", handleSubmit);
    });
  };

  window.InfluencerContact = { init };
})();
