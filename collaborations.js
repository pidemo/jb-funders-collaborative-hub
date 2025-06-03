const hookUrl = "0rwzyvqdypm21391f9vqhetvus9xjra8";

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
  // console.log(checkboxes, hiddenField);

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updateHiddenField);
    // console.log("Checkbox change");
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
    // console.log(selectedActivities.join(','));
  }
}

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

// Add an event listener to intercept the form submission
//form.addEventListener('submit', async function(event) {
submitButton.addEventListener("click", async function (event) {
  // Prevent the default form submission

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

/*
  // Script to show/hide Physical location field based on Type of location
  const locationTypeInput = document.querySelector('#Location-type');
  const physicalLocationInput = document.querySelector('#physical-location');
  
  if (locationTypeInput && physicalLocationInput) {
      // Anytime location type changes
    locationTypeInput.addEventListener('change', function() {
      const locationType = locationTypeInput.value;
          
      // Add/remove hide-onload class based on location type 
      if (locationType != "Online") {
        physicalLocationInput.classList.remove('hide-onload');
      } else {
        physicalLocationInput.classList.add('hide-onload');
      }
    })
  };
  */
