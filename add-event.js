// Rich text editor
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
const quill = new Quill("#editor", {
  ...quillOptions,
  placeholder: "Enter further details",
});

// Script to show/hide Physical location field based on Type of location
const locationTypeInput = document.querySelector("#Location-type");
const physicalLocationInput = document.querySelector("#physical-location");

if (locationTypeInput && physicalLocationInput) {
  // Anytime location type changes
  locationTypeInput.addEventListener("change", function () {
    const locationType = locationTypeInput.value;

    // Add/remove hide-onload class based on location type
    if (locationType != "Online") {
      physicalLocationInput.classList.remove("hide-onload");
    } else {
      physicalLocationInput.classList.add("hide-onload");
    }
  });
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

// Script to show/hide sign up type field based on sign up type
document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const signUpType = document.querySelector("#signUpType"); // Adjust this selector to match your dropdown or radio button
  const emailField = document.querySelector("#emailField");
  const emailInput = document.querySelector("#Email-to-register");
  const urlField = document.querySelector("#urlField");
  const urlInput = document.querySelector("#Link-to-register");

  // Hide fields initially
  emailField.style.display = "none";
  urlField.style.display = "none";

  // Function to handle showing/hiding fields based on selection
  function handleSignUpTypeChange() {
    const selectedType = signUpType.value;

    if (selectedType === "email") {
      emailField.style.display = "block";
      emailInput.required = true;
      urlField.style.display = "none";
      urlInput.required = false;
    } else if (selectedType === "online") {
      emailField.style.display = "none";
      emailInput.required = false;
      urlField.style.display = "block";
      urlInput.required = true;
    } else {
      emailField.style.display = "none";
      urlField.style.display = "none";
      emailField.required = false;
      urlField.required = false;
    }
  }

  // for add events
  // Set the max number of characters
  let textMax = 100;
  // Write the max number of characters to the element with an id of #charcount
  const charCountElement = document.getElementById("charcount");
  if (charCountElement) {
    charCountElement.textContent = textMax;
  }

  // When someone types into the input with an id of #Short-description
  const shortDescElement = document.getElementById("Short-description");
  if (shortDescElement) {
    shortDescElement.addEventListener("keyup", function () {
      // Set a variable of textLength to the length of the input
      let textLength = shortDescElement.value.length;
      // Set a variable that is the max length of text - the current length
      let textRemaining = textMax - textLength;
      // Write the number of characters remaining to the #charcount element
      if (charCountElement) {
        charCountElement.textContent = textRemaining;
      }

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

  // Event listener for the sign-up type selection
  signUpType.addEventListener("change", handleSignUpTypeChange);
});

// Script to suubmit form to webhook
// Select the Webflow form
const form = document.querySelector("#submit-event");

// Add an event listener to intercept the form submission
form.addEventListener("submit", async function (event) {
  // Prevent the default form submission
  event.preventDefault();

  // two lines added for processing rich text input
  const detailsField = document.querySelector("#Further-details");
  detailsField.value = quill.root.innerHTML;

  // Get form data
  const formData = new FormData(form);

  // Convert form data to JSON
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });

  const successMessage = document.querySelector(".w-form-done");
  const errorMessage = document.querySelector(".w-form-fail");
  const hookUrl = "xy2rivaujzyfb5969p2yxhb9avghv9pt";

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
      sendErrorDetails("Event: if-!response.ok", response);
      // Manually trigger Webflow error message
      errorMessage.style.display = "block";
      errorMessage.innerHTML =
        "Oops! Something went wrong while submitting the form. (Error 1)";
      successMessage.style.display = "none";
    }
  } catch (error) {
    sendErrorDetails("Event: catch-error", error);
    console.error("Error submitting to webhook:", error);

    // Show the Webflow error message on fetch error
    errorMessage.style.display = "block";
    errorMessage.innerHTML =
      "Oops! Something went wrong while submitting the form. (Error 2)";
    successMessage.style.display = "none";
  }
});
