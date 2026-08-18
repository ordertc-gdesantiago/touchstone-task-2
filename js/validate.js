const CONTACT_STORAGE_KEY = "northstar_contact_info";

const validationRules = {
  name: {
    validate: function (value) {
      return value.trim().length >= 2;
    },
    message: "Please enter your full name (at least 2 characters)."
  },
  email: {
    validate: function (value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(value.trim());
    },
    message: "Please enter a valid email address, like name@example.com."
  },
  phone: {
    validate: function (value) {
      if (value.trim() === "") {
        return true;
      }
      const phonePattern = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
      return phonePattern.test(value.trim());
    },
    message: "Phone number should look like 123-456-7890."
  },
  item: {
    validate: function (value) {
      return value.trim().length > 0;
    },
    message: "Let us know which item you're interested in."
  },
  quantity: {
    validate: function (value) {
      const num = Number(value);
      return value.trim() !== "" && num >= 1 && num <= 50;
    },
    message: "Quantity must be a number between 1 and 50."
  },
  "pickup-date": {
    validate: function (value) {
      return value.trim() !== "";
    },
    message: "Please choose a preferred pickup date."
  }
};

function showError(fieldId, message) {
  const errorEl = document.getElementById(fieldId + "-error");
  if (errorEl) {
    errorEl.textContent = message;
  }
}

function clearError(fieldId) {
  showError(fieldId, "");
}

function validateField(fieldId) {
  const field = document.getElementById(fieldId);
  const rule = validationRules[fieldId];
  if (!field || !rule) {
    return true;
  }

  const isValid = rule.validate(field.value);
  if (isValid) {
    clearError(fieldId);
  } else {
    showError(fieldId, rule.message);
  }
  return isValid;
}

function validateForm() {
  const fieldIds = Object.keys(validationRules);
  const results = fieldIds.map(function (fieldId) {
    return validateField(fieldId);
  });
  return results.every(function (result) {
    return result === true;
  });
}

function saveContactInfo(name, email) {
  const info = { name: name, email: email };
  localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(info));
}

function loadContactInfo() {
  const saved = localStorage.getItem(CONTACT_STORAGE_KEY);
  return saved ? JSON.parse(saved) : null;
}

function prefillContactForm() {
  const savedInfo = loadContactInfo();
  if (!savedInfo) {
    return;
  }
  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const rememberBox = document.getElementById("remember-me");

  if (nameField && savedInfo.name) {
    nameField.value = savedInfo.name;
  }
  if (emailField && savedInfo.email) {
    emailField.value = savedInfo.email;
  }
  if (rememberBox) {
    rememberBox.checked = true;
  }
}

function handleSubmit(event) {
  event.preventDefault();

  const isFormValid = validateForm();
  const successMessage = document.getElementById("form-success");

  if (!isFormValid) {
    successMessage.hidden = true;
    return;
  }

  const rememberBox = document.getElementById("remember-me");
  if (rememberBox && rememberBox.checked) {
    saveContactInfo(
      document.getElementById("name").value.trim(),
      document.getElementById("email").value.trim()
    );
  } else {
    localStorage.removeItem(CONTACT_STORAGE_KEY);
  }

  successMessage.hidden = false;
}

function setupLiveValidation() {
  Object.keys(validationRules).forEach(function (fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener("blur", function () {
        validateField(fieldId);
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  prefillContactForm();
  setupLiveValidation();

  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", handleSubmit);
  }
});
