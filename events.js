const hookUrl = "xy2rivaujzyfb5969p2yxhb9avghv9pt";

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
    console.log(`Signup type changed to : ${selectedType}`);

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

  // Event listener for the sign-up type selection
  signUpType.addEventListener("change", handleSignUpTypeChange);
});

// Script to suubmit form to webhook
// Select the Webflow form
const submitButton = document.querySelector("#submit-event-button");

// Add an event listener to intercept the form submission
submitButton.addEventListener("click", async function (event) {
  // Select the parent form
  const form = submitButton.closest("form");

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

  // Submit form data to your webhook
  try {
    const response = await fetch(`https://hook.eu1.make.com/${hookUrl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      // Reset the form values
      form.reset();
      // Manually trigger Webflow success message
      document.querySelector(".w-form-done").style.display = "block";
      document.querySelector(".w-form-fail").style.display = "none";
    } else {
      // Manually trigger Webflow error message
      document.querySelector(".w-form-fail").style.display = "block";
      document.querySelector(".w-form-done").style.display = "none";
    }
  } catch (error) {
    console.error("Error submitting to webhook:", error);

    // Show the Webflow error message on fetch error
    document.querySelector(".w-form-fail").style.display = "block";
    document.querySelector(".w-form-done").style.display = "none";
  }
});
