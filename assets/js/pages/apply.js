let currentStep = 0;
const formSteps = document.querySelectorAll(".form-step");
const progressCircles = document.querySelectorAll(".progress-circle");
const progressLines = document.querySelectorAll(".progress-line"); // Get the lines
const form = document.getElementById("loanApplicationForm");

// Passport dimensions and max size constants
const PASSPORT_MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB in bytes
const PASSPORT_MIN_WIDTH = 300; // Example minimum width in pixels
const PASSPORT_MAX_WIDTH = 600; // Example maximum width in pixels
const PASSPORT_MIN_HEIGHT = 400; // Example minimum height in pixels
const PASSPORT_MAX_HEIGHT = 800; // Example maximum height in pixels

// Get preview elements
const passportPhotoInput = document.getElementById("passportPhoto");
const passportPreviewImg = document.getElementById("passportPreview");
const passportPlaceholder = document.getElementById("passportPlaceholder");

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
      // Line connects step 'index' to 'index + 1'
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

// Function to validate passport photo size and dimensions
async function validatePassportPhoto() {
  const feedbackElement = document.getElementById("passportPhotoFeedback");
  let isValid = true;
  let feedbackMessage = "Please upload your passport photograph.";

  if (!passportPhotoInput.files.length) {
    isValid = false;
    feedbackMessage = "Please upload your passport photograph.";
    // Clear preview if no file selected or invalid
    passportPreviewImg.style.display = "none";
    passportPlaceholder.style.display = "block";
    passportPhotoInput.classList.add("is-invalid"); // Ensure it's marked invalid
  } else {
    const file = passportPhotoInput.files[0];

    // Validate file size
    if (file.size > PASSPORT_MAX_SIZE_BYTES) {
      isValid = false;
      feedbackMessage = `File size exceeds 2MB. Current size: ${(file.size / (1024 * 1024)).toFixed(
        2,
      )} MB.`;
    }

    // Validate image dimensions (asynchronous operation)
    if (file.type.startsWith("image/") && isValid) {
      try {
        const img = new Image();
        const objectURL = URL.createObjectURL(file);

        await new Promise((resolve, reject) => {
          img.onload = () => {
            // Check dimensions
            if (
              img.width < PASSPORT_MIN_WIDTH ||
              img.width > PASSPORT_MAX_WIDTH ||
              img.height < PASSPORT_MIN_HEIGHT ||
              img.height > PASSPORT_MAX_HEIGHT
            ) {
              isValid = false;
              feedbackMessage = `Image dimensions must be between ${PASSPORT_MIN_WIDTH}x${PASSPORT_MIN_HEIGHT} and ${PASSPORT_MAX_WIDTH}x${PASSPORT_MAX_HEIGHT} pixels. Current: ${img.width}x${img.height}.`;
            }
            URL.revokeObjectURL(objectURL); // Clean up
            resolve();
          };
          img.onerror = () => {
            isValid = false;
            feedbackMessage = "Could not load image to check dimensions.";
            URL.revokeObjectURL(objectURL);
            reject("Image load error");
          };
          img.src = objectURL;
        });
      } catch (error) {
        console.error("Error validating image dimensions:", error);
        isValid = false;
        feedbackMessage = "Error processing image for dimension check.";
      }
    }
  }

  if (!isValid) {
    passportPhotoInput.classList.add("is-invalid");
    feedbackElement.textContent = feedbackMessage;
    // Clear preview if no file selected or invalid
    passportPreviewImg.style.display = "none";
    passportPlaceholder.style.display = "block";
  } else {
    passportPhotoInput.classList.remove("is-invalid");
    // If valid, ensure preview is shown (handled by the change listener)
  }
  return isValid;
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

    const bvnInput = document.getElementById("bvn");
    if (bvnInput && bvnInput.value.length !== 11) {
      bvnInput.classList.add("is-invalid");
      isValid = false;
    } else if (bvnInput) {
      bvnInput.classList.remove("is-invalid");
    }

    const ninInput = document.getElementById("nin");
    if (ninInput && ninInput.value.length !== 11) {
      ninInput.classList.add("is-invalid");
      isValid = false;
    } else if (ninInput) {
      ninInput.classList.remove("is-invalid");
    }
  } else if (stepIndex === 1) {
    // Employment Details step (final step)
    const salaryAccountNumberInput = document.getElementById("salaryAccountNumber");
    if (salaryAccountNumberInput && salaryAccountNumberInput.value.length !== 10) {
      salaryAccountNumberInput.classList.add("is-invalid");
      isValid = false;
    } else if (salaryAccountNumberInput) {
      salaryAccountNumberInput.classList.remove("is-invalid");
    }

    const agreeTermsCheckbox = document.getElementById("agreeTerms");
    if (agreeTermsCheckbox && !agreeTermsCheckbox.checked) {
      agreeTermsCheckbox.classList.add("is-invalid");
      isValid = false;
    } else if (agreeTermsCheckbox) {
      agreeTermsCheckbox.classList.remove("is-invalid");
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

form.addEventListener(
  "submit",
  async function (event) {
    event.preventDefault();
    event.stopPropagation();

    const finalStepIsValid = await validateStep(formSteps.length - 1);
    formSteps[formSteps.length - 1].classList.add("was-validated");

    if (finalStepIsValid) {
      alert("Loan request submitted successfully!");
    } else {
      showStep(formSteps.length - 1);
    }
  },
  false,
);

// --- New JavaScript for Image Preview ---
passportPhotoInput.addEventListener("change", function () {
  if (this.files && this.files[0]) {
    const file = this.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      passportPreviewImg.src = e.target.result;
      passportPreviewImg.style.display = "block"; // Show the image
      passportPlaceholder.style.display = "none"; // Hide the placeholder text
    };

    reader.readAsDataURL(file); // Read the file as a data URL
  } else {
    passportPreviewImg.src = "#"; // Clear the image source
    passportPreviewImg.style.display = "none"; // Hide the image
    passportPlaceholder.style.display = "block"; // Show the placeholder text
  }
  // Re-validate the passport photo immediately after a change
  validatePassportPhoto();
});

// Initial display
showStep(currentStep);
