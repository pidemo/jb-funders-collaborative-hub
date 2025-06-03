# jb-fch

## Instructions for Webflow Website Managers

To ensure the collaboration forms work properly with the custom scripts, please follow these guidelines when updating or creating forms in Webflow:

### 1. Rich Text Editors (Quill)

- The following fields use Quill rich text editors:
  - **Aims of the collaboration opportunity**
  - **Who is involved?**
  - **How can others get involved?**
  - **Learning or resources**
- For each of these fields, ensure you have:
  - A Quill editor container with the following IDs:
    - `editor-aims`
    - `editor-involved`
    - `editor-others`
    - `editor-resources`
  - A corresponding hidden input field with the following IDs:
    - `Aims`
    - `Who-Is-Involved`
    - `How-Can-Others-Get-Involved`
    - `Learning-Or-Resources`
- The script will automatically copy the content from the Quill editor into the hidden input before form submission.

### 2. Specialties/Activities Checkboxes

- Each activity checkbox must have a `data-activity-wfid` attribute with the correct value (the activity's Webflow ID).
- There must be a hidden input with the ID `activities-wfids` in the form.
- The script will update this hidden input with a comma-separated list of selected activity IDs whenever checkboxes are changed.

### 3. Location Select

- The main select element for location must have the ID `Location`.
- Each location option to be added dynamically must be represented by an element with:
  - `data-location-select` attribute (the display name)
  - `data-location-value` attribute (the value for the option)
- The script will add these as options to the select automatically.

### 4. Form Submission

- The submit button must have the ID `submit-collaboration-button`.
- The form element should be assigned to a variable named `form` in the script context (e.g., `const form = document.querySelector('form');`).
- On submission, the script sends the form data as JSON to the specified webhook URL.
- Success and error messages are shown by toggling the display of elements with classes `.w-form-done` and `.w-form-fail`.

---

**If you update field names, IDs, or attributes in Webflow, make sure to update them in the script as well to keep everything in sync!**
