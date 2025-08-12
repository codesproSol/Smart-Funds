let currentStep = 0;
const formSteps = document.querySelectorAll(".form-step");
const progressCircles = document.querySelectorAll(".progress-circle");
const progressLines = document.querySelectorAll(".progress-line");
const form = document.getElementById("loanApplicationForm");
const messageBox = document.getElementById("messageBox");

// Passport dimensions and max size constants
const PASSPORT_MAX_SIZE_BYTES = 5 * 1024 * 1024; // 2MB in bytes
const PASSPORT_MIN_WIDTH = 300; // Example minimum width in pixels
const PASSPORT_MAX_WIDTH = 600; // Example maximum width in pixels
const PASSPORT_MIN_HEIGHT = 400; // Example minimum height in pixels
const PASSPORT_MAX_HEIGHT = 800; // Example maximum height in pixels

// Get preview elements and clear button
const passportPhotoInput = document.getElementById("passportPhoto");
const passportPreviewImg = document.getElementById("passportPreview");
const passportPlaceholder = document.getElementById("passportPlaceholder");
const clearPassportPhotoButton = document.getElementById("clearPassportPhoto");

// Get number-only input fields
const bvnInput = document.getElementById("bvn");
const ninInput = document.getElementById("nin");
const phoneInput = document.getElementById("phone");
const ippisOracleNumberInput = document.getElementById("ippisOracleNumber");
const salaryAccountNumberInput = document.getElementById("salaryAccountNumber");
const emailInput = document.getElementById("email");

// --- Helper function for showing messages ---
function showMessage(message, type = "success") {
  messageBox.textContent = message;
  messageBox.style.backgroundColor = type === "success" ? "#28a745" : "#dc3545"; // Green for success, red for error
  messageBox.classList.add("show");
  setTimeout(() => {
    messageBox.classList.remove("show");
  }, 3000); // Hide after 3 seconds
}

function updateProgressIndicator() {
  progressCircles.forEach((circle, index) => {
    circle.classList.remove("active", "completed");
    if (index < currentStep) {
      circle.classList.add("completed");
    } else if (index === currentStep) {
      circle.classList.add("active");
    }
  });

  progressLines.forEach((line, index) => {
    line.classList.remove("completed");
    if (index < currentStep) {
      line.classList.add("completed");
    }
  });
}

function showStep(stepIndex) {
  formSteps.forEach((step, index) => {
    step.classList.toggle("active", index === stepIndex);
  });
  updateProgressIndicator();
}

// --- Clear Passport Photo Function ---
function clearPassportPhoto() {
  passportPhotoInput.value = ""; // Clear the selected file
  passportPreviewImg.src = "#"; // Clear the image source
  passportPreviewImg.style.display = "none"; // Hide the image
  passportPlaceholder.style.display = "block"; // Show the placeholder text
  passportPhotoInput.classList.remove("is-invalid"); // Remove validation feedback
  document.getElementById("passportPhotoFeedback").textContent =
    "Please upload your passport photograph."; // Reset feedback message
  showMessage("Passport photo cleared.", "success");
}

// Function to validate passport photo size and dimensions
async function validatePassportPhoto() {
  const feedbackElement = document.getElementById("passportPhotoFeedback");
  let isValid = true;
  let feedbackMessage = "Please upload your passport photograph.";

  if (!passportPhotoInput.files.length) {
    isValid = false;
    feedbackMessage = "Please upload your passport photograph.";
  } else {
    const file = passportPhotoInput.files[0];

    // ✅ Validate file size only
    if (file.size > PASSPORT_MAX_SIZE_BYTES) {
      isValid = false;
      feedbackMessage = `File size exceeds 5MB. Current size: ${(file.size / (1024 * 1024)).toFixed(
        2,
      )} MB.`;
    }

    // ✅ Check if it's an image file (optional, still recommended)
    if (!file.type.startsWith("image/")) {
      isValid = false;
      feedbackMessage = "Please upload an image file (JPEG or PNG).";
    }
  }

  if (!isValid) {
    passportPhotoInput.classList.add("is-invalid");
    feedbackElement.textContent = feedbackMessage;
    passportPreviewImg.style.display = "none";
    passportPlaceholder.style.display = "block";
  } else {
    passportPhotoInput.classList.remove("is-invalid");
  }
  return isValid;
}

// --- Email Validation Function ---
function isValidEmail(email) {
  // A common regex for email validation (can be more complex)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function validateStep(stepIndex) {
  let isValid = true;
  const currentFormStep = formSteps[stepIndex];
  const inputsInCurrentStep = currentFormStep.querySelectorAll(
    "input:required, select:required, textarea:required",
  );

  inputsInCurrentStep.forEach((input) => {
    if (!input.checkValidity()) {
      input.classList.add("is-invalid");
      isValid = false;
    } else {
      input.classList.remove("is-invalid");
    }
  });

  if (stepIndex === 0) {
    // Personal Information step
    const passportPhotoValid = await validatePassportPhoto();
    if (!passportPhotoValid) {
      isValid = false;
    }

    // BVN validation
    if (bvnInput && bvnInput.value.length !== 11) {
      bvnInput.classList.add("is-invalid");
      bvnInput.nextElementSibling.textContent = "BVN must be 11 digits.";
      isValid = false;
    } else if (bvnInput) {
      bvnInput.classList.remove("is-invalid");
    }

    // NIN validation
    if (ninInput && ninInput.value.length !== 11) {
      ninInput.classList.add("is-invalid");
      ninInput.nextElementSibling.textContent = "NIN must be 11 digits.";
      isValid = false;
    } else if (ninInput) {
      ninInput.classList.remove("is-invalid");
    }

    // Phone number validation (simple check for now, can add length/format specific to Nigeria)
    if (phoneInput && phoneInput.value.trim() === "") {
      // Basic check for required
      phoneInput.classList.add("is-invalid");
      document.getElementById("phoneFeedback").textContent = "Please provide a valid phone number.";
      isValid = false;
    } else if (phoneInput) {
      phoneInput.classList.remove("is-invalid");
    }

    // Email validation
    // Email validation (only if not empty)
    if (emailInput) {
      const emailValue = emailInput.value.trim();
      if (emailValue !== "" && !isValidEmail(emailValue)) {
        emailInput.classList.add("is-invalid");
        document.getElementById("emailFeedback").textContent =
          "Please enter a valid email address (e.g., example@domain.com).";
        isValid = false;
      } else {
        emailInput.classList.remove("is-invalid");
      }
    }

    const dobInput = document.getElementById("dob");

    if (dobInput) {
      const dobValue = dobInput.value;
      const dobDate = new Date(dobValue);
      const today = new Date();
      const ageLimitDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());

      if (!dobValue || dobDate > ageLimitDate) {
        dobInput.classList.add("is-invalid");
        document.getElementById("dobFeedback").textContent = "You must be at least 16 years old.";
        isValid = false;
      } else {
        dobInput.classList.remove("is-invalid");
      }
    }
  } else if (stepIndex === 1) {
    // Employment Details step (final step)
    // Salary Account Number validation
    if (salaryAccountNumberInput && salaryAccountNumberInput.value.length !== 10) {
      salaryAccountNumberInput.classList.add("is-invalid");
      salaryAccountNumberInput.nextElementSibling.textContent =
        "Salary account number must be 10 digits.";
      isValid = false;
    } else if (salaryAccountNumberInput) {
      salaryAccountNumberInput.classList.remove("is-invalid");
    }

    const employmentDateInput = document.getElementById("employmentDate");

    if (employmentDateInput) {
      const selectedDate = new Date(employmentDateInput.value);
      const today = new Date();

      if (!employmentDateInput.value || selectedDate > today) {
        employmentDateInput.classList.add("is-invalid");
        document.getElementById("employmentDateFeedback").textContent =
          "Employment date cannot be in the future.";
        isValid = false;
      } else {
        employmentDateInput.classList.remove("is-invalid");
      }
    }

    const agreeTermsCheckbox = document.getElementById("agreeTerms");
    if (agreeTermsCheckbox && !agreeTermsCheckbox.checked) {
      agreeTermsCheckbox.classList.add("is-invalid");
      isValid = false;
    } else if (agreeTermsCheckbox) {
      agreeTermsCheckbox.classList.remove("is-invalid");
    }
  } else if (stepIndex === 2) {
    // Uploads step
    const idCardInput = document.getElementById("idCard");
    const payrollInput = document.getElementById("payroll");

    if (!idCardInput.files.length) {
      idCardInput.classList.add("is-invalid");
      isValid = false;
    } else {
      idCardInput.classList.remove("is-invalid");
    }

    if (!payrollInput.files.length) {
      payrollInput.classList.add("is-invalid");
      isValid = false;
    } else {
      payrollInput.classList.remove("is-invalid");
    }
  }

  return isValid;
}

async function nextStep() {
  const currentStepIsValid = await validateStep(currentStep);
  formSteps[currentStep].classList.add("was-validated");

  if (currentStepIsValid) {
    if (currentStep < formSteps.length - 1) {
      currentStep++;
      showStep(currentStep);
    }
  }
}

function prevStep() {
  if (currentStep > 0) {
    formSteps[currentStep].classList.remove("was-validated");
    currentStep--;
    showStep(currentStep);
  }
}

// --- Save Draft Functions ---
function saveDraft() {
  const formData = {};
  form.querySelectorAll("input, select, textarea").forEach((element) => {
    if (element.type === "file") {
      // We can't save the file, but we can note if one was selected
      formData[element.id] = element.files.length > 0 ? element.files[0].name : "";
    } else if (element.type === "checkbox" || element.type === "radio") {
      formData[element.id] = element.checked;
    } else {
      formData[element.id] = element.value;
    }
  });
  localStorage.setItem("loanApplicationDraft", JSON.stringify(formData));
  showMessage("Draft saved successfully!", "success");
}

function loadDraft() {
  const savedData = localStorage.getItem("loanApplicationDraft");
  if (savedData) {
    const formData = JSON.parse(savedData);
    for (const id in formData) {
      const element = document.getElementById(id);
      if (element) {
        if (element.type === "checkbox" || element.type === "radio") {
          element.checked = formData[id];
        } else if (element.type !== "file") {
          element.value = formData[id];
        }
        // For file inputs, if a name was saved, we can indicate it but the user must re-upload
        if (element.type === "file" && formData[id]) {
          // You might want to display a message like "Previously uploaded: filename.ext"
          // For this example, we just clear it as the actual file isn't restored.
          // However, we ensure the placeholder is shown and no invalid state.
          passportPhotoInput.value = ""; // Ensure no ghost file is "selected"
          passportPreviewImg.style.display = "none";
          passportPlaceholder.style.display = "block";
          passportPhotoInput.classList.remove("is-invalid");
          document.getElementById(
            "passportPhotoFeedback",
          ).textContent = `Note: A file "${formData[id]}" was previously selected. Please re-upload if needed.`;
          setTimeout(() => {
            // Clear the note after some time
            if (document.getElementById("passportPhotoFeedback").textContent.includes("Note:")) {
              document.getElementById("passportPhotoFeedback").textContent =
                "Please upload your passport photograph.";
            }
          }, 5000);
        }
      }
    }
    showMessage("Draft loaded!", "success");
  }
}

function clearDraftStorage() {
  localStorage.removeItem("loanApplicationDraft");
}

function clearValidationStates() {
  // Remove validation styling
  form.querySelectorAll(".is-invalid, .was-validated").forEach((el) => {
    el.classList.remove("is-invalid", "was-validated", "is-valid");
  });

  // Reset feedback text (optional)
  const feedbacks = form.querySelectorAll(".invalid-feedback");
  feedbacks.forEach((el) => (el.textContent = ""));
}

// Handle form submission
form.addEventListener(
  "submit",
  async function (event) {
    event.preventDefault();
    event.stopPropagation();

    const finalStepIsValid = await validateStep(formSteps.length - 1);
    formSteps[formSteps.length - 1].classList.add("was-validated");

    if (finalStepIsValid) {
      showMessage("Loan request submitted successfully!", "success");
      clearDraftStorage(); // Clear draft on successful submission
      setTimeout(() => {
        form.reset(); // Reset form after successful submission and message
        showStep(0); // Go back to the first step
        clearPassportPhoto(); // Ensure passport photo preview is also cleared
        clearValidationStates();
        window.location.reload();
      }, 1500); // Give time for message to display
    } else {
      showMessage("Please correct the errors before submitting.", "error");
      showStep(formSteps.length - 1);
    }
  },
  false,
);

// --- Number-only Input Restriction ---
function setNumberOnly(inputElement) {
  if (inputElement) {
    inputElement.addEventListener("input", function () {
      // Remove any character that is not a digit
      this.value = this.value.replace(/\D/g, "");
    });
    // Also add a paste listener to clean pasted content
    inputElement.addEventListener("paste", function (event) {
      const pasteData = event.clipboardData.getData("text");
      this.value = pasteData.replace(/\D/g, "");
      event.preventDefault(); // Prevent default paste behavior
    });
  }
}

// Apply number-only restriction to relevant fields
setNumberOnly(bvnInput);
setNumberOnly(ninInput);
setNumberOnly(phoneInput);
// setNumberOnly(ippisOracleNumberInput); // If IPPIS/Oracle is purely numeric
setNumberOnly(salaryAccountNumberInput);

// --- Event Listeners and Initial Load ---
passportPhotoInput.addEventListener("change", function () {
  if (this.files && this.files[0]) {
    const file = this.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      passportPreviewImg.src = e.target.result;
      passportPreviewImg.style.display = "block";
      passportPlaceholder.style.display = "none";
    };
    reader.readAsDataURL(file);
  } else {
    passportPreviewImg.src = "#";
    passportPreviewImg.style.display = "none";
    passportPlaceholder.style.display = "block";
  }
  validatePassportPhoto(); // Validate immediately on change
});

clearPassportPhotoButton.addEventListener("click", clearPassportPhoto);

// Initial display and load draft
showStep(currentStep);
loadDraft(); // Attempt to load draft on page load

// Set max date on DOB input (on page load)
window.addEventListener("DOMContentLoaded", () => {
  const dobInput = document.getElementById("dob");
  if (dobInput) {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
    dobInput.max = maxDate.toISOString().split("T")[0];
  }

  const employmentDateInput = document.getElementById("employmentDate");
  if (employmentDateInput) {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    employmentDateInput.max = todayStr;
  }
});

function setupFilePreview(inputId, previewId) {
  const fileInput = document.getElementById(inputId);
  const previewContainer = document.getElementById(previewId);

  fileInput.addEventListener("change", function () {
    const file = fileInput.files[0];

    if (!file) {
      previewContainer.innerHTML = "No file chosen";
      return;
    }

    const fileType = file.type;
    const fileURL = URL.createObjectURL(file);

    if (fileType.startsWith("image/")) {
      previewContainer.innerHTML = `<img src="${fileURL}" alt="Preview" class="img-fluid" style="max-height: 200px;">`;
    } else if (fileType === "application/pdf") {
      previewContainer.innerHTML = `<embed src="${fileURL}" type="application/pdf" width="100%" height="200px">`;
    } else {
      previewContainer.textContent = file.name;
    }
  });
}

// Initialize previews for both uploads
setupFilePreview("idCard", "idCardPreview");
setupFilePreview("payroll", "payrollPreview");
