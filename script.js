const form = document.querySelector("#employee-form");
const successMessage = document.querySelector("#success-message");
const passwordInput = document.querySelector("#employee-password");
const passwordToggle = document.querySelector(".password-toggle");
const registerAnotherButton = document.querySelector("#register-another");

function isInputValid(input) {
  if (!input.checkValidity()) {
    return false;
  }

  if (input.name === "phone") {
    const phone = input.value.trim();
    return /^\+?[0-9\s().-]{7,20}$/.test(phone) &&
      (phone.match(/[0-9]/g) || []).length >= 7;
  }

  return true;
}

const fields = [
  {
    input: document.querySelector("#employee-name"),
    error: document.querySelector("#name-error"),
    message: "Enter your name using at least 2 characters.",
  },
  {
    input: document.querySelector("#employee-email"),
    error: document.querySelector("#email-error"),
    message: "Enter a valid email address.",
  },
  {
    input: passwordInput,
    error: document.querySelector("#password-error"),
    message: "Your password must be at least 8 characters.",
  },
  {
    input: document.querySelector("#employee-phone"),
    error: document.querySelector("#phone-error"),
    message: "Enter a valid phone number with at least 7 digits.",
  },
  {
    input: document.querySelector("#employee-department"),
    error: document.querySelector("#department-error"),
    message: "Choose a department.",
  },
];

function validateField(field) {
  const { input, error, message } = field;
  const isValid = isInputValid(input);
  const wrapper = input.closest(".input-wrap");

  error.textContent = isValid ? "" : message;
  wrapper.classList.toggle("has-error", !isValid);
  input.setAttribute("aria-invalid", String(!isValid));

  return isValid;
}

function clearFieldError(input) {
  const field = fields.find((item) => item.input === input);

  if (field && isInputValid(input)) {
    field.error.textContent = "";
    input.closest(".input-wrap").classList.remove("has-error");
    input.setAttribute("aria-invalid", "false");
  }
}

fields.forEach(({ input }) => {
  input.addEventListener("input", () => clearFieldError(input));
  input.addEventListener("change", () => clearFieldError(input));
});

passwordToggle.addEventListener("click", () => {
  const shouldShow = passwordInput.type === "password";
  passwordInput.type = shouldShow ? "text" : "password";
  passwordToggle.setAttribute("aria-pressed", String(shouldShow));
  passwordToggle.setAttribute(
    "aria-label",
    shouldShow ? "Hide password" : "Show password",
  );
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const fieldsAreValid = fields.map(validateField).every(Boolean);
  const terms = document.querySelector("#terms");
  const termsError = document.querySelector("#terms-error");
  const termsAreValid = terms.checked;

  termsError.textContent = termsAreValid
    ? ""
    : "Please confirm that your details are correct.";
  terms.setAttribute("aria-invalid", String(!termsAreValid));

  if (!fieldsAreValid || !termsAreValid) {
    const firstInvalidField = fields.find(({ input }) => !isInputValid(input));
    if (firstInvalidField) {
      firstInvalidField.input.focus();
    } else {
      terms.focus();
    }
    return;
  }

  document.querySelector("#success-name").textContent =
    document.querySelector("#employee-name").value.trim();
  document.querySelector("#success-department").textContent =
    document.querySelector("#employee-department").value;

  form.hidden = true;
  successMessage.hidden = false;
  successMessage.focus();
});

document.querySelector("#terms").addEventListener("change", (event) => {
  if (event.currentTarget.checked) {
    document.querySelector("#terms-error").textContent = "";
    event.currentTarget.setAttribute("aria-invalid", "false");
  }
});

registerAnotherButton.addEventListener("click", () => {
  form.reset();
  fields.forEach(({ input, error }) => {
    error.textContent = "";
    input.closest(".input-wrap").classList.remove("has-error");
    input.setAttribute("aria-invalid", "false");
  });

  const terms = document.querySelector("#terms");
  terms.setAttribute("aria-invalid", "false");
  document.querySelector("#terms-error").textContent = "";
  passwordInput.type = "password";
  passwordToggle.setAttribute("aria-pressed", "false");
  passwordToggle.setAttribute("aria-label", "Show password");
  successMessage.hidden = true;
  form.hidden = false;
  document.querySelector("#employee-name").focus();
});
