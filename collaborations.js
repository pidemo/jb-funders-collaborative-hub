// Define common Quill options
const quillOptions = {
  modules: {
    toolbar: [
      //[{ 'header': [2, 3, 4, 5, 6, false] }],
      ["bold", "italic" /*, 'underline', 'strike'*/],
      [/*'blockquote', 'code-block', */ "link"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  },
  theme: "snow",
};

// Initialize Quill editors
const quillAims = new Quill("#editor-aims", {
  ...quillOptions,
  placeholder: "Aims of the collaboration opportunity",
});

const quillInvolved = new Quill("#editor-involved", {
  ...quillOptions,
  placeholder: "Who is involved?",
});

const quillOthers = new Quill("#editor-others", {
  ...quillOptions,
  placeholder: "How can others get involved?",
});

const quillResources = new Quill("#editor-resources", {
  ...quillOptions,
  placeholder: "Learning or resources",
});

// my code
// function necessary to pass specialties (split in 3 fields) to MS
function setupMirrorField(triggerFieldAttr, hiddenFieldId) {
  const checkboxes = document.querySelectorAll(`[${triggerFieldAttr}]`);
  const hiddenField = document.getElementById(hiddenFieldId);

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updateHiddenField);
  });

  function updateHiddenField() {
    const selectedActivities = [];
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        const wfid = checkbox.getAttribute("data-activity-wfid");
        selectedActivities.push(wfid.trim());
      }
    });
    hiddenField.value = selectedActivities.join(",");
  }
}

const setAccessibilityAndKeyboard = (submitButton) => {
  if (!submitButton) return;

  // Set labels and attributes for keyboard accessibility
  submitButton.setAttribute("role", "button");
  submitButton.setAttribute("tabindex", "0");
  submitButton.setAttribute("aria-label", "Submit form");

  // Keyboard accessibility: trigger click on Enter or Space
  submitButton.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      submitButton.click();
    }
  });
};

const checkFormValidity = (form) => {
  if (!form.checkValidity()) {
    form.reportValidity(); // Show browser validation errors
    return false; // Stop further processing
  }
  return true;
};

const displayNotificationMessage = (form, submitButton, success = false) => {
  const formWrapper = form.closest(".w-form");
  if (!formWrapper) return;
  const successMessage = formWrapper.querySelector(".w-form-done");
  const errorMessage = formWrapper.querySelector(".w-form-fail");
  if (!successMessage || !errorMessage) return;

  if (success) {
    form.style.display = "none";
    form.reset();
    successMessage.style.display = "block";
    errorMessage.style.display = "none";
  } else {
    submitButton.style.display = "none";
    successMessage.style.display = "none";
    errorMessage.style.display = "block";
  }
};

const hookUrl = "0rwzyvqdypm21391f9vqhetvus9xjra8";

document.addEventListener("DOMContentLoaded", function () {
  // Call the setup function for each pair of trigger and hidden field IDs
  setupMirrorField("data-activity-wfid", "activities-wfids");
});

// Custom Select script
// Get the select element
const locationSelect = document.getElementById("Location");

// Get all elements with the 'data-location-select' attribute
const locationElements = document.querySelectorAll("[data-location-select]");

// Iterate through each element and create a new option
locationElements.forEach((element) => {
  // Get the name and value from the attributes
  const optionName = element.getAttribute("data-location-select");
  const optionValue = element.getAttribute("data-location-value");

  // Create a new option element
  const newOption = document.createElement("option");
  newOption.text = optionName;
  newOption.value = optionValue;

  // Add the new option to the select
  locationSelect.appendChild(newOption);
});

// Script to submit form to webhook
const submitButton = document.querySelector("#submit-collaboration-button");
setAccessibilityAndKeyboard(submitButton);

// Add an event listener to intercept the form submission
//form.addEventListener('submit', async function(event) {
submitButton.addEventListener("click", async function (event) {
  event.preventDefault();
  // Select the parent form
  const form = submitButton.closest("form");

  const aimsField = document.querySelector("#Aims");
  aimsField.value = quillAims.root.innerHTML;

  const involvedField = document.querySelector("#Who-Is-Involved");
  involvedField.value = quillInvolved.root.innerHTML;

  const othersField = document.querySelector("#How-Can-Others-Get-Involved");
  othersField.value = quillOthers.root.innerHTML;

  const learningField = document.querySelector("#Learning-Or-Resources");
  learningField.value = quillResources.root.innerHTML;

  if (!checkFormValidity(form)) {
    return;
  }

  // Get form data
  const formData = new FormData(form);

  // Convert form data to JSON
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });

  console.log("Form data", data);

  // Submit form data to your webhook
  try {
    const response = await fetch(`https://hook.eu1.make.com/${hookUrl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    displayNotificationMessage(form, submitButton, response.ok);
  } catch (error) {
    console.error("Error submitting to webhook:", error);
    displayNotificationMessage(form, submitButton, false);
  }
});
