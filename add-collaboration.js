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

// Send error details to webhook with origin and full response
const sendErrorDetails = (origin, errorResponse) => {
  console.log("Sending error details to webhook");
  console.log(origin, errorResponse);

  const errorHook = "ym6jrhngcvg27kgz7h77yn95w1vt459l";

  // Convert error object to serializable format
  const errorObj = {
    message: errorResponse.message || "",
    name: errorResponse.name || "",
    stack: errorResponse.stack || "",
    toString: errorResponse.toString(),
  };

  fetch(`https://hook.eu1.make.com/${errorHook}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      origin: origin,
      error: errorObj,
    }),
  });
};

document.addEventListener("DOMContentLoaded", async function () {
  // Call the setup function for each pair of trigger and hidden field IDs
  setupMirrorField("data-activity-wfid", "activities-wfids");

  /* part added by Lizzie for Character count */
  // Write the max number of characters to the element with an id of #charcount
  let textMax = 100;
  const charCountElement = document.getElementById("charcount");
  if (charCountElement) {
    charCountElement.textContent = textMax;
  }

  // When someone types into the input with an id of #Collab-Summary
  const collabSummaryElement = document.getElementById("Collab-Summary");
  if (collabSummaryElement) {
    collabSummaryElement.addEventListener("keyup", function () {
      let textLength = collabSummaryElement.value.length;
      let textRemaining = textMax - textLength;
      charCountElement.textContent = textRemaining;

      let backgroundColor = "#bde8e0"; // Default: Green

      if (textRemaining <= 0) {
        backgroundColor = "#e75f5b"; // Red when limit is exceeded
      } else if (textRemaining <= 5) {
        backgroundColor = "#f5c14a"; // Orange when 5 or fewer remaining
      }

      // Apply background color if #charbox exists
      const charBoxElement = document.getElementById("charbox");
      if (charBoxElement) {
        charBoxElement.style.backgroundColor = backgroundColor;
      }
    });
  }
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
// Select the Webflow form
const form = document.querySelector("#submit-collaboration");

// Add an event listener to intercept the form submission
form.addEventListener("submit", async function (event) {
  // Prevent the default form submission
  event.preventDefault();

  // two lines added for processing rich text input
  const aimsField = document.querySelector("#Aims");
  aimsField.value = quillAims.root.innerHTML;

  const involvedField = document.querySelector("#Who-Is-Involved");
  involvedField.value = quillInvolved.root.innerHTML;

  const othersField = document.querySelector("#How-Can-Others-Get-Involved");
  othersField.value = quillOthers.root.innerHTML;

  const learningField = document.querySelector("#Learning-Or-Resources");
  learningField.value = quillResources.root.innerHTML;

  // Get form data
  const formData = new FormData(form);

  // Convert form data to JSON
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });

  const successMessage = document.querySelector(".w-form-done");
  const errorMessage = document.querySelector(".w-form-fail");
  const hookUrl = "0rwzyvqdypm21391f9vqhetvus9xjra8";

  // Submit form data to your webhook
  try {
    const response = await fetch(`https://hook.eu1.make.com/${hookUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      // Manually trigger Webflow success message
      successMessage.style.display = "block";
      errorMessage.style.display = "none";
      // Reset the form values
      form.reset();
    } else {
      sendErrorDetails("Collab: if-!response.ok", response);
      // Manually trigger Webflow error message
      errorMessage.style.display = "block";
      errorMessage.innerHTML =
        "Oops! Something went wrong while submitting the form. (Error 1)";
      successMessage.style.display = "none";
    }
  } catch (error) {
    sendErrorDetails("Collab: catch-error", error);
    console.error("Error submitting to webhook:", error);

    // Show the Webflow error message on fetch error
    errorMessage.style.display = "block";
    errorMessage.innerHTML =
      "Oops! Something went wrong while submitting the form. (Error 2)";
    successMessage.style.display = "none";
  }
});
